#!/bin/bash
set -eu

npm run protos
npm run protos-go

mkdir -p dist-standalone/extension
cp package.json dist-standalone/extension

# Extract version information for ldflags
CORE_VERSION=$(node -p "require('./package.json').version")
CLI_VERSION=$(node -p "require('./cli/package.json').version")
COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
DATE=$(date -u '+%Y-%m-%dT%H:%M:%SZ')
BUILT_BY="${USER:-unknown}"

# Build ldflags to inject version info
LDFLAGS="-X 'github.com/clica/cli/pkg/cli/global.Version=${CORE_VERSION}' \
         -X 'github.com/clica/cli/pkg/cli/global.CliVersion=${CLI_VERSION}' \
         -X 'github.com/clica/cli/pkg/cli/global.Commit=${COMMIT}' \
         -X 'github.com/clica/cli/pkg/cli/global.Date=${DATE}' \
         -X 'github.com/clica/cli/pkg/cli/global.BuiltBy=${BUILT_BY}'"

cd cli

# Detect current platform
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

# Normalize architecture names
case "$ARCH" in
    x86_64)
        ARCH="amd64"
        ;;
    aarch64)
        ARCH="arm64"
        ;;
    arm64)
        ARCH="arm64"
        ;;
esac

# Build for current platform only
echo "Building for current platform ($OS-$ARCH)..."

GO111MODULE=on go build -ldflags "$LDFLAGS" -o bin/clica ./cmd/clica
echo "  ✓ bin/clica built"

GO111MODULE=on go build -ldflags "$LDFLAGS" -o bin/clica-host ./cmd/clica-host
echo "  ✓ bin/clica-host built"

echo ""
echo "Build complete for current platform!"

# Copy binaries to dist-standalone/bin with platform-specific names AND generic names
cd ..
mkdir -p dist-standalone/bin
cp cli/bin/clica dist-standalone/bin/clica
cp cli/bin/clica dist-standalone/bin/clica-${OS}-${ARCH}
cp cli/bin/clica-host dist-standalone/bin/clica-host
cp cli/bin/clica-host dist-standalone/bin/clica-host-${OS}-${ARCH}
echo "Copied binaries to dist-standalone/bin/ (both generic and platform-specific names)"