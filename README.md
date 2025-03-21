# SymmetricDS Dashboard

A modern web-based dashboard for monitoring and managing SymmetricDS database synchronization. This application provides real-time insights into node status, batch processing, and synchronization statistics.

## Overview

SymmetricDS Dashboard is a full-stack application that connects to a SymmetricDS meta database to provide visualization and management capabilities for your SymmetricDS deployment. It offers a clean, intuitive interface for monitoring synchronization status, node health, and batch processing.

## Features

- **Dashboard Overview**: At-a-glance statistics showing total nodes, active nodes, error nodes, and pending batches
- **Node Management**: View detailed information about all nodes in your SymmetricDS network
- **Batch Monitoring**: Track incoming and outgoing batches with status information
- **Configuration**: View and manage SymmetricDS configuration settings

## Architecture

The application consists of two main components:

### Backend (Server)

- Node.js Express server that connects to the SymmetricDS meta database
- RESTful API endpoints for retrieving node and batch information
- Structured with controllers, services, and repositories for clean separation of concerns

### Frontend (Client)

- React application built with Vite
- Material UI for consistent, responsive design
- React Router for navigation
- Recharts for data visualization
- Axios for API communication

## Prerequisites

- Node.js (v14 or higher)
- Access to a SymmetricDS meta database
- Docker and Docker Compose (for containerized deployment)

## Installation and Setup

### Development Setup

1. Clone the repository

```bash
git clone <repository-url>
cd symmetric-dashboard
```

2. Install dependencies for both client and server

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Configure the server environment

Create or modify the `.env` file in the server directory with your SymmetricDS database connection details:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=symmetricds_meta
PORT=3322
```

4. Start the development servers

```bash
# Start the server (from the server directory)
npm run dev

# Start the client (from the client directory)
npm run dev
```

### Docker Deployment

The application can be deployed using Docker:

```bash
# Build and start the containers
docker-compose up -d
```

This will:
- Build the Docker image with both client and server
- Start the application with the server on port 3322 and the client on port 3333

## Usage

Once running, access the dashboard at:

- Development: http://localhost:5173 (or the port shown in your Vite output)
- Docker deployment: http://localhost:3333

## API Endpoints

The server provides the following API endpoints:

- `GET /api/node/status` - Get node status statistics
- `GET /api/node/nodes` - Get list of all nodes
- `GET /api/batch/status` - Get batch processing status

## Technology Stack

### Backend
- Node.js
- Express
- MySQL2 (for database connectivity)
- Dotenv (for environment configuration)

### Frontend
- React
- Vite (build tool)
- Material UI
- React Router
- Recharts (for charts and visualizations)
- Axios (for API requests)

## License

[Add your license information here]

## Contributing

[Add contribution guidelines here]