#!/usr/bin/env bash
set -euo pipefail

# Clica Deployment Script
# This script builds and deploys the Clica CLI application

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INSTALL_TO_PATH="${INSTALL_TO_PATH:-true}"

# Print functions
print_step() {
    echo -e "${CYAN}→${NC} ${DIM}$1${NC}"
}

print_ok() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} ${RED}$1${NC}" >&2
}

print_warn() {
    echo -e "${YELLOW}⚠${NC}  $1"
}

print_header() {
    echo ""
    echo -e "${MAGENTA}${BOLD}$1${NC}"
    echo ""
}

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    local missing_deps=()
    
    # Check Node.js
    if ! command -v node >/dev/null 2>&1; then
        missing_deps+=("Node.js")
    else
        local node_version=$(node --version)
        print_ok "Node.js found: $node_version"
    fi
    
    # Check npm
    if ! command -v npm >/dev/null 2>&1; then
        missing_deps+=("npm")
    else
        local npm_version=$(npm --version)
        print_ok "npm found: v$npm_version"
    fi
    
    # Check Go
    if ! command -v go >/dev/null 2>&1; then
        missing_deps+=("Go")
    else
        local go_version=$(go version | awk '{print $3}')
        print_ok "Go found: $go_version"
    fi
    
    # Check if we're in the right directory
    if [ ! -f "$PROJECT_ROOT/package.json" ]; then
        print_error "package.json not found. Are you in the project root?"
        exit 1
    fi
    
    if [ ${#missing_deps[@]} -gt 0 ]; then
        print_error "Missing dependencies: ${missing_deps[*]}"
        echo ""
        echo "Please install the missing dependencies and try again."
        exit 1
    fi
    
    print_ok "All prerequisites satisfied"
    echo ""
}

# Install npm dependencies if needed
install_dependencies() {
    print_header "Installing Dependencies"
    
    if [ ! -d "$PROJECT_ROOT/node_modules" ]; then
        print_step "Installing npm dependencies (this may take a few minutes)..."
        cd "$PROJECT_ROOT"
        npm install
        print_ok "Dependencies installed"
    else
        print_ok "Dependencies already installed (skipping)"
    fi
    echo ""
}

# Build protobuf files
build_protos() {
    print_header "Building Protocol Buffers"
    
    cd "$PROJECT_ROOT"
    
    print_step "Generating TypeScript protobuf files..."
    if npm run protos > /dev/null 2>&1; then
        print_ok "TypeScript protobuf files generated"
    else
        print_warn "TypeScript protobuf generation had issues (continuing anyway)"
    fi
    
    print_step "Generating Go protobuf files..."
    # Ensure Go bin is in PATH for protoc-gen-go
    export PATH="$PATH:${HOME}/go/bin"
    if npm run protos-go > /dev/null 2>&1; then
        print_ok "Go protobuf files generated"
    else
        print_error "Go protobuf generation failed"
        exit 1
    fi
    
    echo ""
}

# Build CLI binaries
build_cli() {
    print_header "Building CLI Binaries"
    
    cd "$PROJECT_ROOT"
    
    print_step "Building Go CLI binaries..."
    if npm run compile-cli > /dev/null 2>&1; then
        print_ok "CLI binaries built successfully"
    else
        print_error "CLI build failed"
        exit 1
    fi
    
    # Verify binaries exist
    if [ -f "$PROJECT_ROOT/cli/bin/clica" ] && [ -f "$PROJECT_ROOT/cli/bin/clica-host" ]; then
        print_ok "Binaries verified: clica, clica-host"
    else
        print_error "Binaries not found after build"
        exit 1
    fi
    
    echo ""
}

# Build standalone package
build_standalone() {
    print_header "Building Standalone Package"
    
    cd "$PROJECT_ROOT"
    
    print_step "Building standalone package (this may take ~30 seconds)..."
    if npm run compile-standalone > /dev/null 2>&1; then
        print_ok "Standalone package built"
    else
        print_warn "Standalone build had issues (continuing anyway)"
    fi
    
    # Verify clica-core.js exists
    if [ -f "$PROJECT_ROOT/dist-standalone/clica-core.js" ]; then
        print_ok "clica-core.js verified"
    else
        print_warn "clica-core.js not found (may cause runtime issues)"
    fi
    
    echo ""
}

# Install to PATH
install_to_path() {
    if [ "$INSTALL_TO_PATH" != "true" ]; then
        print_header "Skipping PATH Installation"
        echo "Set INSTALL_TO_PATH=true to install to PATH"
        echo ""
        return
    fi
    
    print_header "Installing to PATH"
    
    cd "$PROJECT_ROOT/cli"
    
    print_step "Installing clica binary to PATH..."
    if CLICA_FORCE_INSTALL=true node postinstall.js > /dev/null 2>&1; then
        print_ok "clica installed to PATH"
    else
        print_warn "PATH installation had issues (you may need to add it manually)"
    fi
    
    # Verify installation
    if command -v clica >/dev/null 2>&1; then
        local clica_path=$(which clica)
        print_ok "clica command found at: $clica_path"
    else
        print_warn "clica command not found in PATH"
        echo "You may need to restart your terminal or run: hash -r"
    fi
    
    echo ""
}

# Verify installation
verify_installation() {
    print_header "Verifying Installation"
    
    # Check binaries
    if [ -f "$PROJECT_ROOT/cli/bin/clica" ]; then
        print_ok "clica binary exists"
    else
        print_error "clica binary not found"
        exit 1
    fi
    
    if [ -f "$PROJECT_ROOT/cli/bin/clica-host" ]; then
        print_ok "clica-host binary exists"
    else
        print_error "clica-host binary not found"
        exit 1
    fi
    
    # Test clica command if available
    if command -v clica >/dev/null 2>&1; then
        print_step "Testing clica command..."
        if clica --help > /dev/null 2>&1; then
            print_ok "clica command is working"
        else
            print_warn "clica command found but may have issues"
        fi
    else
        print_warn "clica command not in PATH (run 'hash -r' or restart terminal)"
    fi
    
    echo ""
}

# Print success message
print_success() {
    echo ""
    echo -e "${GREEN}${BOLD}========================================${NC}"
    echo -e "${GREEN}${BOLD}  Deployment Complete!${NC}"
    echo -e "${GREEN}${BOLD}========================================${NC}"
    echo ""
    echo -e "Clica CLI has been successfully built and deployed."
    echo ""
    
    if command -v clica >/dev/null 2>&1; then
        echo -e "You can now use the ${MAGENTA}${BOLD}clica${NC} command:"
        echo ""
        echo -e "  ${CYAN}clica --help${NC}           # Show help"
        echo -e "  ${CYAN}clica \"your prompt\"${NC}     # Start a new task"
        echo ""
    else
        echo -e "To use the ${MAGENTA}${BOLD}clica${NC} command:"
        echo ""
        echo -e "  ${CYAN}Restart your terminal${NC}, or"
        echo -e "  ${CYAN}Run: hash -r${NC}, or"
        echo -e "  ${CYAN}Use: $PROJECT_ROOT/cli/bin/clica${NC}"
        echo ""
    fi
    
    echo -e "${DIM}Binary location: $PROJECT_ROOT/cli/bin/clica${NC}"
    echo ""
}

# Main deployment flow
main() {
    print_header "Clica Deployment Script"
    
    echo -e "${DIM}Project root: $PROJECT_ROOT${NC}"
    echo -e "${DIM}Install to PATH: $INSTALL_TO_PATH${NC}"
    echo ""
    
    check_prerequisites
    install_dependencies
    build_protos
    build_cli
    build_standalone
    install_to_path
    verify_installation
    print_success
}

# Run main function
main "$@"
