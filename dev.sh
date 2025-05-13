#!/bin/bash

# Function to start the client
start_client() {
    echo "Starting client on port 6789..."
    cd /workspace/client
    PORT=6789 npm run dev
}

# Function to start the server
start_server() {
    echo "Starting server on port 3322..."
    cd /workspace/server
    PORT=3322 npm run dev
}

# Function to start both client and server in the background
start_all() {
    echo "Starting both client and server..."
    # Start server in the background
    cd /workspace/server
    PORT=3322 npm run dev &
    SERVER_PID=$!

    # Start client in the background
    cd /workspace/client
    PORT=6789 npm run dev &
    CLIENT_PID=$!

    # Create a function to handle exit
    trap cleanup INT TERM EXIT

    # Function to kill background processes when script is terminated
    cleanup() {
        echo "Cleaning up processes..."
        kill $SERVER_PID $CLIENT_PID 2>/dev/null
        exit 0
    }

    # Wait for both processes to finish
    wait
}

# Main logic
case "$1" in
    client)
        start_client
        ;;
    server)
        start_server
        ;;
    all)
        start_all
        ;;
    *)
        echo "Usage: $0 {client|server|all}"
        echo "  client: Start only the client (port 3000)"
        echo "  server: Start only the server (port 3001)"
        echo "  all: Start both client and server"
        exit 1
esac
