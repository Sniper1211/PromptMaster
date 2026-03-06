---
name: "dev-server-validator"
description: "Starts local development server for code validation with port conflict detection. Invoke after code modifications to verify changes, or when user asks to test/validate code changes locally."
---

# Development Server Validator

This skill automatically starts the local development server to validate code changes, with intelligent port conflict detection and resolution.

## Purpose

After making code modifications, this skill helps you verify the changes by:
1. Starting the local development server
2. Checking for port conflicts (3000 for frontend, 3001 for backend)
3. Ensuring the correct project is running on those ports
4. Providing a preview URL for manual testing

## When to Invoke

**ALWAYS invoke this skill when:**
- User asks to "verify" or "test" code changes
- User says "check if it works" after modifications
- User requests to "start the dev server" or "preview changes"
- User asks to "validate the implementation"
- After completing significant code changes that need testing

**DO NOT invoke this skill when:**
- Only doing static analysis or type checking
- User explicitly says they don't want to start the server
- Testing is already running or server is already started

## How It Works

### 1. Port Conflict Detection
The skill checks if ports 3000 (frontend) and 3001 (backend) are occupied by:
- Using `lsof` to identify processes on these ports
- Checking if the processes belong to the current project
- Providing clear feedback about port status

### 2. Project Verification
For each occupied port, the skill verifies:
- If it's the current project's development server
- If it's a different project or process
- Whether the process is healthy and responding

### 3. Conflict Resolution
Based on port status, the skill will:
- **Port free**: Start the development server normally
- **Current project running**: Inform user and provide preview URL
- **Different project running**: Ask user for action (kill process or use different port)
- **Process not responding**: Attempt to kill and restart

### 4. Server Startup
Once ports are confirmed available, the skill:
- Runs `npm run dev` to start both frontend and backend
- Waits for servers to be ready
- Provides the preview URL: `http://localhost:3000`
- Monitors startup for errors

## Implementation Details

### Port Checking Commands
```bash
# Check port 3000
lsof -ti:3000

# Check port 3001  
lsof -ti:3001

# Get process details
ps -p <PID> -o command=
```

### Project Identification
The skill identifies the current project by:
- Checking if the process command contains "vite" (frontend)
- Checking if the process command contains "node server/index.js" (backend)
- Verifying the working directory matches the current project

### Error Handling
- If `npm run dev` fails, the skill will:
  1. Show the error output
  2. Suggest common fixes
  3. Offer to run build/test commands if needed
- If ports cannot be freed, the skill will:
  1. Suggest alternative ports
  2. Provide manual resolution steps
  3. Ask user for preference

## Usage Examples

### Example 1: Normal Validation
```
User: "I've added the new feature, can you verify it works?"
Assistant: Invokes dev-server-validator skill
Result: Server starts on http://localhost:3000, user can test the feature
```

### Example 2: Port Conflict
```
User: "Test my changes please"
Assistant: Invokes dev-server-validator skill
Result: "Port 3000 is occupied by a different project. Would you like me to kill it or use a different port?"
```

### Example 3: Server Already Running
```
User: "Check if the fix works"
Assistant: Invokes dev-server-validator skill  
Result: "Development server is already running at http://localhost:3000. You can test your changes there."
```

## Configuration

The skill is configured for this specific project:
- **Frontend port**: 3000 (Vite)
- **Backend port**: 3001 (Node.js/Express)
- **Start command**: `npm run dev`
- **Project name**: "pentaprompt" (from package.json)

## Notes

- The skill assumes standard Vite + Node.js setup
- It respects user preferences for port handling
- It provides educational feedback about port conflicts
- It maintains safety by asking before killing processes
- It integrates with the existing project workflow