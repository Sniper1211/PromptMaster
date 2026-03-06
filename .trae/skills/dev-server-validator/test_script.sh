#!/bin/bash

# Development Server Validator - Test Script
# This script tests the core functionality of the dev-server-validator skill

echo "=== Development Server Validator Test ==="
echo "Project: pentaprompt"
echo "Frontend port: 3000"
echo "Backend port: 3001"
echo ""

# Function to check port status
check_port() {
    local port=$1
    local service=$2
    
    echo "Checking $service port $port..."
    local pid=$(lsof -ti:$port 2>/dev/null)
    
    if [ -z "$pid" ]; then
        echo "  ✅ Port $port is free"
        return 0
    else
        echo "  ⚠️  Port $port is occupied by PID: $pid"
        
        # Get process details
        local cmd=$(ps -p $pid -o command= 2>/dev/null)
        local cwd=$(lsof -p $pid | grep cwd | awk '{print $9}' 2>/dev/null)
        
        echo "  Process command: $cmd"
        echo "  Working directory: $cwd"
        
        # Check if it's our project
        if [[ "$cmd" == *"vite"* ]] || [[ "$cmd" == *"node server/index.js"* ]]; then
            if [[ "$cwd" == *"PromptMaster"* ]]; then
                echo "  ✅ This is our project's development server"
                return 1
            else
                echo "  ❌ Different project running on port $port"
                return 2
            fi
        else
            echo "  ❌ Unknown process on port $port"
            return 3
        fi
    fi
}

# Function to start development server
start_dev_server() {
    echo ""
    echo "Starting development server..."
    echo "Command: npm run dev"
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        echo "❌ Error: package.json not found"
        return 1
    fi
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "⚠️  Warning: node_modules not found, running npm install first..."
        npm install
    fi
    
    # Start the server in background
    echo "Starting npm run dev..."
    # Note: In real implementation, this would be handled by RunCommand tool
    # For testing, we just show what would happen
    echo "✅ Development server would be started with: npm run dev"
    echo "✅ Preview URL: http://localhost:3000"
    return 0
}

# Main test
echo "=== Port Status Check ==="
check_port 3000 "Frontend (Vite)"
frontend_status=$?

check_port 3001 "Backend (Node.js)"
backend_status=$?

echo ""
echo "=== Summary ==="

# Determine action based on port status
if [ $frontend_status -eq 0 ] && [ $backend_status -eq 0 ]; then
    echo "✅ Both ports are free. Ready to start development server."
    start_dev_server
elif [ $frontend_status -eq 1 ] || [ $backend_status -eq 1 ]; then
    echo "✅ Development server is already running for this project."
    echo "✅ Preview URL: http://localhost:3000"
    echo "✅ You can test your changes at the above URL."
elif [ $frontend_status -eq 2 ] || [ $backend_status -eq 2 ] || [ $frontend_status -eq 3 ] || [ $backend_status -eq 3 ]; then
    echo "⚠️  Port conflict detected!"
    echo "Options:"
    echo "  1. Kill the existing process(es)"
    echo "  2. Use different ports"
    echo "  3. Manual resolution"
    echo ""
    echo "Please choose an option or provide instructions."
else
    echo "❌ Unknown port status. Manual intervention required."
fi

echo ""
echo "=== Test Complete ==="