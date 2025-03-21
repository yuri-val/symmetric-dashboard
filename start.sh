#!/bin/sh

# Start the server
cd /app/server
pm2 start src/index.js -p 3322 --name server

# Serve the client build using http-server instead of serve
cd /app/client
pm2 start http-server -- dist -p 3333 --name client

# Keep the container running and follow logs
pm2 logs