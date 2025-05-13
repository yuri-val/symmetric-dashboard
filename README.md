# SymmetricDS Dashboard

A modern web-based dashboard for monitoring and managing SymmetricDS database synchronization. This application provides real-time insights into node status, batch processing, and synchronization statistics.

## Overview

SymmetricDS Dashboard is a full-stack application that connects to a SymmetricDS meta database to provide visualization and management capabilities for your SymmetricDS deployment. It offers a clean, intuitive interface for monitoring synchronization status, node health, and batch processing.

## Features

- **Dashboard Overview**: At-a-glance statistics showing total nodes, active nodes, error nodes, and pending batches
- **Node Management**: View detailed information about all nodes in your SymmetricDS network
- **Batch Monitoring**: Track incoming and outgoing batches with status information
- **Configuration**: View and manage SymmetricDS configuration settings
- **Real-time Updates**: Automatic data refresh with 30-second polling interval
- **Responsive Design**: Modern UI that adapts to different screen sizes
- **Theme Support**: Toggle between light and dark modes for optimal viewing experience
- **Error Handling**: Robust error boundaries and friendly error messages

## Architecture

The application consists of two main components:

### Backend (Server)

- Node.js Express server that connects to the SymmetricDS meta database
- RESTful API endpoints for retrieving node and batch information
- Structured with controllers, services, and repositories for clean separation of concerns
- Optimized database queries with advanced error handling and query logging
- Modular service design for different data processing tasks

### Frontend (Client)

- React application built with Vite for fast development and optimized production builds
- Material UI for consistent, responsive design
- React Router for seamless client-side navigation
- Recharts for interactive data visualization
- Axios for API communication with request/response interceptors
- Framer Motion for smooth animations and transitions
- React Error Boundary for graceful error handling
- TanStack React Query for efficient data fetching, caching, and state management

## System Requirements

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
PORT=13322
```

4. Start the development servers

```bash
# Start the server (from the server directory)
cd ../server
npm run dev

# Start the client (from the client directory, in a new terminal)
cd ../client
npm run dev
```

### Docker Deployment

The application can be deployed using Docker:

1. Create a `docker-compose.yml` file based on the example provided:

```bash
cp docker-compose.example.yml docker-compose.yml
```

2. Edit the environment variables in the docker-compose.yml file to match your SymmetricDS database configuration

3. Build and start the containers

```bash
docker-compose up -d
```

This will:
- Build the Docker image with both client and server
- Start the application with the server on port 13322 and the client on port 13333

## Docker Hub

The SymmetricDS Dashboard is also available as a Docker image on Docker Hub.

### Using Docker Run

You can run the application directly using Docker:

```bash
docker run -d \
  --name symmetric-dashboard \
  -p 13333:13333 \
  -e DB_HOST=your-db-host \
  -e DB_PORT=3306 \
  -e DB_USER=root \
  -e DB_PASSWORD=your-password \
  -e DB_NAME=symmetricds_meta \
  -e PORT=13322 \
  softo/symmetric-dashboard:latest
```

### Using Docker Compose

Create a `docker-compose.yml` file with the following content:

```yaml
version: '3.8'

services:
  symmetric-dashboard:
    image: softo/symmetric-dashboard:latest
    ports:
      - "13333:13333"  # Web interface port
    environment:
      - DB_HOST=your-db-host
      - DB_PORT=3306
      - DB_USER=root
      - DB_PASSWORD=your-password
      - DB_NAME=symmetricds_meta
      - PORT=13322
    restart: unless-stopped
```

Then run:

```bash
docker-compose up -d
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|--------|
| DB_HOST | SymmetricDS database host | localhost |
| DB_PORT | SymmetricDS database port | 3306 |
| DB_USER | Database username | root |
| DB_PASSWORD | Database password | - |
| DB_NAME | SymmetricDS meta database name | symmetric |
| PORT | Server API port | 13322 |

## Usage

Once running, access the dashboard at:

- Development: http://localhost:5173 (or the port shown in your Vite output)
- Docker deployment: http://localhost:13333

### Dashboard Sections

1. **Overview**: The main dashboard showing key metrics and statistics
2. **Nodes**: List of all nodes with their status and synchronization information
3. **Batches**: Monitor incoming and outgoing batches with detailed status
4. **Configuration**: View system configuration including node groups, channels, and triggers

## API Endpoints

The server provides the following RESTful API endpoints:

- `GET /health` - Health check endpoint
- `GET /api/node/status` - Get node status statistics
- `GET /api/node/nodes` - Get list of all nodes
- `GET /api/engine/config` - Get configuration (node groups, channels, and triggers)
- `GET /api/batch/channels` - Get unique batch channel IDs
- `GET /api/batch/status` - Get batch processing status
- `GET /api/batch/:batchId/data` - Get data entries associated with a specific batch
- `GET /api/batch/:direction/:batchId` - Get detailed information for a specific batch (incoming or outgoing)

## Technology Stack

### Backend
- Node.js
- Express
- MySQL2 (for database connectivity)
- Dotenv (for environment configuration)
- CORS (for cross-origin resource sharing)

### Frontend
- React 18
- Vite (build tool)
- Material UI 5
- React Router 6
- Recharts (for charts and visualizations)
- Axios (for API requests)
- TanStack React Query (for data fetching and caching)
- Framer Motion (for animations and transitions)
- React Error Boundary (for graceful error handling)

### Deployment
- Docker
- Nginx (for serving the frontend and proxying API requests)
- PM2 (for process management in production)
- Alpine-based Node.js container for minimal image size

## Project Structure

```
├── client/                 # Frontend React application
│   ├── public/             # Static assets
│   └── src/                # React source code
│       ├── api/            # API client functions
│       │   ├── axiosConfig.js  # Axios configuration with interceptors
│       │   └── models/     # API model functions by domain
│       ├── components/     # Reusable UI components
│       │   ├── batches/    # Batch-related components
│       │   ├── configuration/ # Configuration-related components
│       │   ├── dashboard/  # Dashboard-specific components
│       │   └── nodes/      # Node-related components
│       ├── context/        # React contexts (e.g., ThemeContext)
│       ├── pages/          # Page components
│       ├── theme/          # Theme and styling
│       ├── App.jsx         # Main application component
│       └── main.jsx        # Application entry point
├── server/                 # Backend Node.js application
│   ├── logs/               # Server logs
│   └── src/                # Server source code
│       ├── constants/      # Application constants
│       ├── controllers/    # API route handlers
│       ├── repositories/   # Database access layer
│       ├── services/       # Business logic by domain
│       ├── transformers/   # Data transformation utilities
│       ├── utils/          # Utility functions
│       ├── index.js        # Server entry point
│       └── logger.js       # Logging utility
├── diff/                   # Differential files (for development)
├── .github/                # GitHub workflows
├── Dockerfile              # Docker build configuration
├── docker-compose.example.yml # Example Docker Compose configuration
├── nginx.conf             # Nginx configuration for production
└── start.sh               # Container startup script
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify your database credentials in the .env file
   - Ensure the SymmetricDS database is running and accessible
   - Check network connectivity between the application and database
   - Review logs in the server/logs directory for SQL errors

2. **Docker Deployment Issues**
   - Ensure ports 13322 and 13333 are not in use by other applications
   - Verify Docker and Docker Compose are installed correctly
   - Check Docker logs: `docker logs symmetric-dashboard`
   - Inspect Nginx logs in container: `docker exec symmetric-dashboard cat /var/log/nginx/error.log`

3. **Development Server Issues**
   - Clear node_modules and reinstall dependencies if you encounter module errors
   - Ensure you're using a compatible Node.js version (v14 or higher)
   - Check for React development mode warnings in browser console
   - Verify Vite configuration in client/vite.config.js

4. **UI Performance Issues**
   - Large batch tables might cause slowdowns - consider filtering data
   - Disable animations if performance is an issue on low-end devices
   - Check browser console for memory warnings

## Security Considerations

- The application does not implement authentication by default
- Consider placing the application behind a reverse proxy with authentication
- Never expose the dashboard directly to the internet without proper security measures
- Use environment variables for all sensitive configuration and never commit credentials
- Consider implementing rate limiting for production deployments
- Review the database user permissions - use a read-only user for the dashboard when possible
- In production environments, consider implementing HTTPS using a reverse proxy

## Performance Optimization

The SymmetricDS Dashboard has been optimized for performance in several ways:

1. **Code Splitting**: React components are lazy-loaded to reduce initial bundle size
2. **Efficient Rendering**: Components use memoization to prevent unnecessary re-renders
3. **Optimized Database Queries**: The server uses efficient SQL queries with proper indexing
4. **Data Caching**: TanStack React Query provides automatic caching of API responses
5. **Dynamic Loading**: Data is fetched only when needed and displayed with loading states

## License

[Add your license information here]

## Contributing

[Add contribution guidelines here]

## Release Notes

### Version 1.0.0 (May 2025)
- Initial release with core dashboard functionality
- Support for monitoring nodes and batches
- Configuration viewing capabilities
- Docker deployment options
