#!/bin/bash
# Integration test script for deployed contracts on local Anvil node
# This script verifies that deployed contracts are working correctly

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Load environment variables
if [ -f .env.local ]; then
    set -a
    source .env.local
    set +a
else
    echo -e "${RED}Error: .env.local file not found!${NC}"
    exit 1
fi

RPC_URL=${RPC_URL:-http://127.0.0.1:8545}
PRIVATE_KEY=${PRIVATE_KEY:-0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80}

# Check if Anvil is running
if ! curl -s $RPC_URL > /dev/null 2>&1; then
    echo -e "${RED}Error: Anvil is not running on $RPC_URL${NC}"
    echo "Please start Anvil in another terminal: anvil"
    exit 1
fi

# Extract deployed addresses from broadcast file
BROADCAST_FILE="broadcast/DeployAll.s.sol/31337/run-latest.json"
if [ ! -f "$BROADCAST_FILE" ]; then
    echo -e "${RED}Error: Broadcast file not found: $BROADCAST_FILE${NC}"
    echo "Please deploy contracts first using ./deploy-local.sh"
    exit 1
fi

echo -e "${GREEN}=== Integration Tests for Deployed Contracts ===${NC}\n"

# Extract addresses from broadcast file (simplified - assumes jq is available)
if command -v jq &> /dev/null; then
    FACTORY_ADDRESS=$(jq -r '.transactions[] | select(.contractName == "LSSVMPairFactory") | .contractAddress' "$BROADCAST_FILE" | head -1)
    ROUTER_ADDRESS=$(jq -r '.transactions[] | select(.contractName == "VeryFastRouter") | .contractAddress' "$BROADCAST_FILE" | head -1)
    LINEAR_CURVE=$(jq -r '.transactions[] | select(.contractName == "LinearCurve") | .contractAddress' "$BROADCAST_FILE" | head -1)
    ROYALTY_ENGINE=$(jq -r '.transactions[] | select(.contractName == "RoyaltyEngine") | .contractAddress' "$BROADCAST_FILE" | head -1)
else
    echo -e "${YELLOW}Warning: jq not found. Please set addresses manually:${NC}"
    echo "export FACTORY_ADDRESS=<address>"
    echo "export ROUTER_ADDRESS=<address>"
    echo "export LINEAR_CURVE=<address>"
    echo "export ROYALTY_ENGINE=<address>"
    exit 1
fi

if [ -z "$FACTORY_ADDRESS" ] || [ "$FACTORY_ADDRESS" == "null" ]; then
    echo -e "${RED}Error: Could not extract factory address from broadcast file${NC}"
    exit 1
fi

echo "Using deployed addresses:"
echo "  Factory: $FACTORY_ADDRESS"
echo "  Router: $ROUTER_ADDRESS"
echo "  LinearCurve: $LINEAR_CURVE"
echo "  RoyaltyEngine: $ROYALTY_ENGINE"
echo ""

# Test 1: Check factory owner
echo -e "${GREEN}[Test 1] Checking factory owner...${NC}"
FACTORY_OWNER=$(cast call $FACTORY_ADDRESS "owner()" --rpc-url $RPC_URL 2>/dev/null || echo "")
if [ -z "$FACTORY_OWNER" ]; then
    echo -e "${RED}  ✗ Failed to get factory owner${NC}"
    exit 1
else
    echo -e "${GREEN}  ✓ Factory owner: $FACTORY_OWNER${NC}"
    if [ "$FACTORY_OWNER" != "$(cast --to-checksum-address $FACTORY_OWNER)" ]; then
        echo -e "${YELLOW}  ⚠ Warning: Owner address format mismatch${NC}"
    fi
fi

# Test 2: Check bonding curve whitelist
echo -e "${GREEN}[Test 2] Checking bonding curve whitelist...${NC}"
CURVE_ALLOWED=$(cast call $FACTORY_ADDRESS "bondingCurveAllowed(address)" $LINEAR_CURVE --rpc-url $RPC_URL 2>/dev/null || echo "")
if [ "$CURVE_ALLOWED" == "0x0000000000000000000000000000000000000000000000000000000000000001" ]; then
    echo -e "${GREEN}  ✓ LinearCurve is whitelisted${NC}"
else
    echo -e "${RED}  ✗ LinearCurve is NOT whitelisted${NC}"
    echo -e "${YELLOW}  Response: $CURVE_ALLOWED${NC}"
fi

# Test 3: Check router whitelist
echo -e "${GREEN}[Test 3] Checking router whitelist...${NC}"
ROUTER_ALLOWED=$(cast call $FACTORY_ADDRESS "routerAllowed(address)" $ROUTER_ADDRESS --rpc-url $RPC_URL 2>/dev/null || echo "")
if [ "$ROUTER_ALLOWED" == "0x0000000000000000000000000000000000000000000000000000000000000001" ]; then
    echo -e "${GREEN}  ✓ Router is whitelisted${NC}"
else
    echo -e "${RED}  ✗ Router is NOT whitelisted${NC}"
    echo -e "${YELLOW}  Response: $ROUTER_ALLOWED${NC}"
fi

# Test 4: Check protocol fee recipient
echo -e "${GREEN}[Test 4] Checking protocol fee recipient...${NC}"
FEE_RECIPIENT=$(cast call $FACTORY_ADDRESS "protocolFeeRecipient()" --rpc-url $RPC_URL 2>/dev/null || echo "")
if [ -n "$FEE_RECIPIENT" ]; then
    echo -e "${GREEN}  ✓ Protocol fee recipient: $FEE_RECIPIENT${NC}"
else
    echo -e "${RED}  ✗ Failed to get protocol fee recipient${NC}"
fi

# Test 5: Check protocol fee multiplier
echo -e "${GREEN}[Test 5] Checking protocol fee multiplier...${NC}"
FEE_MULTIPLIER=$(cast call $FACTORY_ADDRESS "protocolFeeMultiplier()" --rpc-url $RPC_URL 2>/dev/null || echo "")
if [ -n "$FEE_MULTIPLIER" ]; then
    FEE_PERCENT=$(cast --to-unit $FEE_MULTIPLIER 18 | awk '{printf "%.2f%%", $1 * 100}')
    echo -e "${GREEN}  ✓ Protocol fee multiplier: $FEE_MULTIPLIER ($FEE_PERCENT)${NC}"
else
    echo -e "${RED}  ✗ Failed to get protocol fee multiplier${NC}"
fi

# Test 6: Verify RoyaltyEngine is set
echo -e "${GREEN}[Test 6] Checking RoyaltyEngine...${NC}"
ROYALTY_ENGINE_FROM_FACTORY=$(cast call $FACTORY_ADDRESS "royaltyEngine()" --rpc-url $RPC_URL 2>/dev/null || echo "")
if [ -n "$ROYALTY_ENGINE_FROM_FACTORY" ]; then
    if [ "$(cast --to-checksum-address $ROYALTY_ENGINE_FROM_FACTORY)" == "$(cast --to-checksum-address $ROYALTY_ENGINE)" ]; then
        echo -e "${GREEN}  ✓ RoyaltyEngine matches deployment${NC}"
    else
        echo -e "${YELLOW}  ⚠ RoyaltyEngine mismatch (expected: $ROYALTY_ENGINE, got: $ROYALTY_ENGINE_FROM_FACTORY)${NC}"
    fi
else
    echo -e "${RED}  ✗ Failed to get RoyaltyEngine from factory${NC}"
fi

echo ""
echo -e "${GREEN}=== Integration Tests Complete ===${NC}"
echo ""
echo "Next steps:"
echo "  1. Run full test suite: forge test"
echo "  2. Test pool creation: See LOCAL_TESTING.md"
echo "  3. Test trading: See LOCAL_TESTING.md"

