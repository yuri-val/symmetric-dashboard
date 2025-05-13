# Symmetric Dashboard Development Environment

This setup provides a complete development environment for the Symmetric Dashboard project using VS Code devcontainers.

## Usage

1. Make sure you have Docker and VS Code with the Dev Containers extension installed.
2. Open this project in VS Code.
3. Click on the green button in the bottom-left corner or press `F1` and select "Dev Containers: Reopen in Container".
4. VS Code will build the container and set up the environment (this may take a few minutes on first run).

## Development Commands

Once inside the container, you can use the `dev.sh` script to start development servers:

```bash
# Start the client development server only
./dev.sh client

# Start the server in development mode only
./dev.sh server

# Start both client and server with PM2
./dev.sh all
```

## Container Features

- Node.js 22 with npm
- MySQL 8.0 database
- Development tools (git, curl, etc.)
- PM2 for process management
- Pre-configured environment variables

## Port Mapping

- 3000: Client Vite development server
- 3001: Backend Express server
- 3306: MySQL database

## VS Code Extensions

The devcontainer comes with several useful extensions pre-installed:

- ESLint
- Prettier
- Git Lens
- VS Code Icons
- JavaScript Debugger
- NPM IntelliSense
