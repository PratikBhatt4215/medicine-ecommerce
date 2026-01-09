#!/bin/bash

# Medicine E-commerce Application Startup Script
# This script starts both backend and frontend servers

set -e

PROJECT_DIR="/Users/pratikkumar/IdeaProjects/LetsDoIT"
BACKEND_DIR="$PROJECT_DIR/medicine-ecommerce-backend"
FRONTEND_DIR="$PROJECT_DIR/medicine-ecommerce-frontend"
BACKEND_PORT=8080
FRONTEND_PORT=5173

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Medicine E-commerce Application Startup${NC}"
echo -e "${GREEN}========================================${NC}"

# Function to kill process on port
kill_port() {
    local port=$1
    local pid=$(lsof -ti:$port)
    if [ ! -z "$pid" ]; then
        echo -e "${YELLOW}Killing process on port $port (PID: $pid)${NC}"
        kill -9 $pid 2>/dev/null || true
        sleep 2
    fi
}

# Stop any existing servers
echo -e "\n${YELLOW}Checking for existing servers...${NC}"
kill_port $BACKEND_PORT
kill_port $FRONTEND_PORT

# Start Backend
echo -e "\n${GREEN}Starting Backend Server...${NC}"
cd "$BACKEND_DIR"

# Set Java 17
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
echo "Using Java: $JAVA_HOME"

# Check if JAR exists, if not build it
# Always build to ensure latest changes are picked up
echo -e "${YELLOW}Building backend...${NC}"
mvn clean package -DskipTests

# Start backend in background
echo -e "${GREEN}Starting backend on port $BACKEND_PORT...${NC}"
# Discard console output as Spring Boot logs to logs/application.log
nohup java -jar target/medicine-ecommerce-1.0.0.jar > /dev/null 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to start
echo -e "${YELLOW}Waiting for backend to start...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:$BACKEND_PORT/api/categories > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend is ready!${NC}"
        break
    fi
    echo -n "."
    sleep 1
done

# Start Frontend
echo -e "\n${GREEN}Starting Frontend Server...${NC}"
cd "$FRONTEND_DIR"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    npm install
fi

# Start frontend in background
echo -e "${GREEN}Starting frontend on port $FRONTEND_PORT...${NC}"
nohup npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

# Wait for frontend to start
echo -e "${YELLOW}Waiting for frontend to start...${NC}"
for i in {1..20}; do
    if curl -s http://localhost:$FRONTEND_PORT > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Frontend is ready!${NC}"
        break
    fi
    echo -n "."
    sleep 1
done

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Application Started Successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "\n${GREEN}Backend:${NC}  http://localhost:$BACKEND_PORT"
echo -e "${GREEN}Frontend:${NC} http://localhost:$FRONTEND_PORT"
echo -e "\n${YELLOW}Admin Login:${NC}"
echo -e "  Email: admin@medstore.com"
echo -e "  Password: Admin@123"
echo -e "\n${YELLOW}Logs:${NC}"
# Corrected log path
echo -e "  Backend:  $BACKEND_DIR/logs/application.log"
echo -e "  Frontend: $FRONTEND_DIR/frontend.log"
echo -e "\n${YELLOW}To stop servers:${NC}"
echo -e "  kill $BACKEND_PID $FRONTEND_PID"
echo -e "\n${GREEN}Open your browser to: http://localhost:$FRONTEND_PORT${NC}"
