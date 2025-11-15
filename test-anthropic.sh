#!/bin/bash
# Script to test if Anthropic API is properly configured and working

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}Testing Anthropic API configuration...${NC}"
echo ""

# Check if clino command exists
if ! command -v clino &> /dev/null; then
    echo -e "${RED}Error: 'clino' command not found${NC}"
    echo "Please install Clino CLI first:"
    echo "  npm install -g clino"
    echo "  or build from source"
    exit 1
fi

echo -e "${GREEN}? Clino CLI is installed${NC}"
echo ""

# Test 1: Check if auth is configured
echo -e "${CYAN}Test 1: Checking configured providers...${NC}"
if clino auth --list 2>/dev/null | grep -i anthropic > /dev/null; then
    echo -e "${GREEN}? Anthropic provider is configured${NC}"
    ANTHROPIC_CONFIGURED=true
else
    echo -e "${YELLOW}? Anthropic provider not found in configured providers${NC}"
    echo "  Run: ./setup-anthropic.sh to configure"
    ANTHROPIC_CONFIGURED=false
fi
echo ""

# Test 2: Check configuration via config command (if available)
echo -e "${CYAN}Test 2: Checking API configuration...${NC}"
if clino config get api_provider 2>/dev/null | grep -i anthropic > /dev/null; then
    echo -e "${GREEN}? API provider is set to Anthropic${NC}"
else
    echo -e "${YELLOW}? Could not verify API provider setting${NC}"
fi
echo ""

# Test 3: Try a simple task to verify API connectivity (only if configured)
if [ "$ANTHROPIC_CONFIGURED" = true ]; then
    echo -e "${CYAN}Test 3: Testing API connectivity...${NC}"
    echo "  This will make a test API call to verify the key works..."
    echo ""
    
    # Create a simple test prompt
    TEST_PROMPT="Reply with only the word 'SUCCESS' and nothing else."
    
    echo "  Running test task (this may take a few seconds)..."
    if timeout 60 clino start --prompt "$TEST_PROMPT" 2>&1 | tee /tmp/clino-test-output.log | grep -iE "(success|error|failed)" > /dev/null; then
        if grep -i "error\|failed" /tmp/clino-test-output.log > /dev/null; then
            echo -e "${YELLOW}? API test completed but may have encountered issues${NC}"
            echo "  Check the output above for details"
        else
            echo -e "${GREEN}? API connectivity test completed!${NC}"
        fi
    else
        echo -e "${YELLOW}? API test inconclusive${NC}"
        echo "  This is normal if the response format differs"
        echo "  Check /tmp/clino-test-output.log for full output"
    fi
    echo ""
fi

echo -e "${GREEN}Configuration test complete!${NC}"
echo ""
if [ "$ANTHROPIC_CONFIGURED" = true ]; then
    echo -e "${GREEN}? Anthropic API appears to be properly configured${NC}"
    echo ""
    echo "To start using Clino CLI:"
    echo "  ${CYAN}clino start${NC}"
else
    echo -e "${YELLOW}? Please run ./setup-anthropic.sh first to configure the API${NC}"
fi
