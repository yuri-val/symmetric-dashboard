#!/bin/sh

# Start the server
cd /app/server
pm2 start src/index.js --name server

# Start nginx to handle all requests
nginx

# Keep the container running and follow logs
tail -f /var/log/nginx/error.log /var/log/nginx/access.log | pm2 logs --raw