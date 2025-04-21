# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json from the app directory
COPY app/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code from the app directory
COPY app/ .

# Build the Vite React app
RUN npm run build

# Install serve package to serve the static files
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Command to serve the application
CMD ["serve", "-s", "dist", "-l", "3000"]