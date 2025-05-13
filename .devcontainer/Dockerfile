FROM node:lts-bookworm

# Install git, additional tools and utilities
RUN apt-get update && apt-get install -y \
    git \
    bash \
    curl \
    wget \
    vim \
    htop \
    tzdata \
    python3 \
    nginx

# Install global NPM packages
RUN npm install -g nodemon pm2 http-server

# Set the working directory
WORKDIR /workspace

# Set timezone
ENV TZ=UTC

# Command to keep the container running
CMD ["sleep", "infinity"]
