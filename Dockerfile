FROM node:22-alpine

# Install PM2 globally and http-server instead of serve
RUN npm install -g pm2 http-server

WORKDIR /app

# Copy package files for both client and server
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
WORKDIR /app/client
RUN npm ci

WORKDIR /app/server
RUN npm ci

# Copy source files
WORKDIR /app
COPY client ./client
COPY server ./server

# Build the client
WORKDIR /app/client
RUN npm run build

# Create startup script
WORKDIR /app
COPY start.sh .
RUN chmod +x start.sh

EXPOSE 13322 13322

CMD ["./start.sh"]