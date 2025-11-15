#!/bin/bash
# Script to configure Anthropic API key for Clino CLI from .env file

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if clino command exists
if ! command -v clino &> /dev/null; then
    echo -e "${RED}Error: 'clino' command not found${NC}"
    echo ""
    echo "Please install Clino CLI first:"
    echo "  1. Install via npm: ${YELLOW}npm install -g clino${NC}"
    echo "  2. Or build from source (requires Go):"
    echo "     ${YELLOW}cd cli && npm run compile-cli${NC}"
    echo ""
    echo "After installation, add it to your PATH and run this script again."
    exit 1
fi

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}Error: .env file not found at $ENV_FILE${NC}"
    exit 1
fi

# Read API key and model from .env file
source "$ENV_FILE"

# Check if API key is set
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo -e "${RED}Error: ANTHROPIC_API_KEY not found in .env file${NC}"
    exit 1
fi

# Set default model if not specified
MODEL="${ANTHROPIC_MODEL:-claude-haiku-4-5-20251001}"

echo -e "${GREEN}Configuring Anthropic API for Clino CLI...${NC}"
echo "Model: $MODEL"
echo ""

# Configure using CLI auth command
if clino auth --provider anthropic --apikey "$ANTHROPIC_API_KEY" --modelid "$MODEL"; then
    echo ""
    echo -e "${GREEN}? Successfully configured Anthropic API!${NC}"
    echo ""
    echo "You can now use Clino CLI with Anthropic Claude models."
    echo "Run 'clino start' to begin a new task."
    exit 0
else
    echo ""
    echo -e "${RED}? Failed to configure Anthropic API${NC}"
    exit 1
fi
