
#!/usr/bin/env bash
set -euo pipefail

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

# Configuration
INSTALL_DIR="${CLINE_INSTALL_DIR:-$HOME/.clino/cli}"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo ""
echo -e "${MAGENTA}${BOLD}Installing Clino CLI from local build${NC}"
echo ""

# Always rebuild CLI to ensure latest changes
echo -e "${CYAN}→${NC} ${DIM}Rebuilding CLI binaries...${NC}"
cd "$PROJECT_ROOT"
if npm run compile-cli 2>&1 | grep -E "(built|error|Error)" || true; then
    echo -e "${GREEN}✓${NC} CLI binaries rebuilt"
else
    echo -e "${YELLOW}⚠${NC}  CLI build may have issues - check output above"
fi

# Always rebuild standalone to ensure latest clino-core.js
echo -e "${CYAN}→${NC} ${DIM}Rebuilding standalone package (this may take ~30 seconds)...${NC}"
if npm run compile-standalone 2>&1 | tail -5; then
    echo -e "${GREEN}✓${NC} Standalone package rebuilt"
else
    echo -e "${YELLOW}⚠${NC}  Standalone build may have issues - check output above"
fi
echo ""

echo -e "${CYAN}→${NC} ${DIM}Installing to $INSTALL_DIR${NC}"

# Remove existing installation (clean install)
# This ensures no conflicts with old versions and guarantees a fresh state
if [ -d "$INSTALL_DIR" ]; then
    echo -e "${YELLOW}→${NC} ${DIM}Removing existing installation for clean install${NC}"
    rm -rf "$INSTALL_DIR"
fi

# Create installation directory
mkdir -p "$INSTALL_DIR/bin"

# Copy standalone package first (includes node_modules, clino-core.js, etc.)
rsync -a --exclude='bin' "$PROJECT_ROOT/dist-standalone/" "$INSTALL_DIR/"

# Detect platform for native modules
os=$(uname -s | tr '[:upper:]' '[:lower:]')
arch=$(uname -m)
if [[ "$arch" == "aarch64" ]]; then arch="arm64"; fi
if [[ "$arch" == "x86_64" ]]; then arch="x64"; fi
platform="$os-$arch"

# Copy platform-specific native modules (like better-sqlite3)
if [ -d "$PROJECT_ROOT/dist-standalone/binaries/$platform/node_modules" ]; then
    echo -e "${CYAN}→${NC} ${DIM}Installing platform-specific modules for $platform${NC}"
    cp -r "$PROJECT_ROOT/dist-standalone/binaries/$platform/node_modules/"* "$INSTALL_DIR/node_modules/" 2>/dev/null || true
fi

# Copy binaries (this will create/overwrite the bin directory)
mkdir -p "$INSTALL_DIR/bin"
cp "$PROJECT_ROOT/cli/bin/clino" "$INSTALL_DIR/bin/"
cp "$PROJECT_ROOT/cli/bin/clino-host" "$INSTALL_DIR/bin/"

# Use system Node.js (symlink to avoid copying large binary)
if command -v node >/dev/null 2>&1; then
    ln -sf "$(which node)" "$INSTALL_DIR/bin/node"
    echo -e "${GREEN}✓${NC} Linked to system Node.js: $(node --version)"
else
    echo -e "${YELLOW}⚠${NC}  Node.js not found in PATH. Please install Node.js."
    exit 1
fi

# Make binaries executable
chmod +x "$INSTALL_DIR/bin/clino"
chmod +x "$INSTALL_DIR/bin/clino-host"
chmod +x "$INSTALL_DIR/bin/node" 2>/dev/null || true

# Create fake_node_modules with vscode stub (needed for clino-core)
if [ -d "$INSTALL_DIR/node_modules/vscode" ] && [ ! -d "$INSTALL_DIR/fake_node_modules" ]; then
    echo -e "${CYAN}→${NC} ${DIM}Creating fake_node_modules with vscode stub...${NC}"
    mkdir -p "$INSTALL_DIR/fake_node_modules"
    cp -r "$INSTALL_DIR/node_modules/vscode" "$INSTALL_DIR/fake_node_modules/"
    echo -e "${GREEN}✓${NC} fake_node_modules created"
fi

# Ensure all dependencies are installed
echo -e "${CYAN}→${NC} ${DIM}Installing/updating dependencies...${NC}"
cd "$INSTALL_DIR"
if [ -f "package.json" ]; then
    npm install --production > /dev/null 2>&1
    echo -e "${GREEN}✓${NC} Dependencies installed"
fi

# Rebuild better-sqlite3 for system Node.js version
echo -e "${CYAN}→${NC} ${DIM}Rebuilding native modules for Node.js $(node --version)...${NC}"
npm rebuild better-sqlite3 > /dev/null 2>&1
cd "$PROJECT_ROOT"
echo -e "${GREEN}✓${NC} Native modules rebuilt"

echo -e "${GREEN}✓${NC} Installed to ${MAGENTA}${BOLD}$INSTALL_DIR${NC}"

# Configure PATH
BIN_DIR="$INSTALL_DIR/bin"
SHELL_CONFIG="$HOME/.zshrc"

if [ -f "$HOME/.bashrc" ]; then
    SHELL_CONFIG="$HOME/.bashrc"
fi

if ! grep -q "$BIN_DIR" "$SHELL_CONFIG" 2>/dev/null; then
    echo "" >> "$SHELL_CONFIG"
    echo "# Clino CLI" >> "$SHELL_CONFIG"
    echo "export PATH=\"$BIN_DIR:\$PATH\"" >> "$SHELL_CONFIG"
    echo -e "${GREEN}✓${NC} Added to PATH in ${CYAN}$(basename $SHELL_CONFIG)${NC}"
else
    echo -e "${GREEN}✓${NC} Already in PATH"
fi

echo ""
echo -e "${GREEN}${BOLD}Installation complete!${NC}"
echo ""
echo -e "Run this to start using ${MAGENTA}${BOLD}clino${NC} immediately:"
echo ""
echo -e "${YELLOW}${BOLD}    exec \$SHELL${NC}"
echo ""
echo -e "${DIM}(or just open a new terminal window)${NC}"
echo ""
