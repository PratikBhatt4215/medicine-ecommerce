#!/bin/bash

# Medicine E-commerce Application Stop Script

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Stopping Medicine E-commerce Application...${NC}"

# Kill backend on port 8080
BACKEND_PID=$(lsof -ti:8080)
if [ ! -z "$BACKEND_PID" ]; then
    echo -e "${GREEN}Stopping backend (PID: $BACKEND_PID)${NC}"
    kill -9 $BACKEND_PID
else
    echo -e "${YELLOW}Backend not running${NC}"
fi

# Kill frontend on port 5173
FRONTEND_PID=$(lsof -ti:5173)
if [ ! -z "$FRONTEND_PID" ]; then
    echo -e "${GREEN}Stopping frontend (PID: $FRONTEND_PID)${NC}"
    kill -9 $FRONTEND_PID
else
    echo -e "${YELLOW}Frontend not running${NC}"
fi

echo -e "${GREEN}✓ Application stopped${NC}"
