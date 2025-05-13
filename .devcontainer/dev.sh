#!/bin/bash

# This script helps with starting development servers in the container

# Function to start the client development server
start_client() {
  echo "Starting client development server..."
  cd /workspace/client
  npm run dev
}

# Function to start the server in development mode
start_server() {
  echo "Starting server in development mode..."
  cd /workspace/server
  npm run dev
}

# Function to start both client and server
start_all() {
  echo "Starting both client and server..."
  cd /workspace
  pm2 start --name client npm -- --prefix client run dev
  pm2 start --name server npm -- --prefix server run dev
  pm2 logs
}

# Print help
print_help() {
  echo "Usage: ./dev.sh [command]"
  echo ""
  echo "Commands:"
  echo "  client   - Start the client development server"
  echo "  server   - Start the server in development mode"
  echo "  all      - Start both client and server using PM2"
  echo "  help     - Show this help message"
}

# Main script logic
if [ "$1" = "client" ]; then
  start_client
elif [ "$1" = "server" ]; then
  start_server
elif [ "$1" = "all" ]; then
  start_all
else
  print_help
fi
