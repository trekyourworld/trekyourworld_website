# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json from the app directory
COPY app/package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code from the app directory
COPY app/ .

ARG API_BASE_URL
ARG APP_ENV

# Set environment variables for the build
ENV VITE_API_BASE_URL=${API_BASE_URL}
ENV VITE_APP_ENV=${APP_ENV}

# Build the Vite React app
RUN npm run build

# Install serve package to serve the static files
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Command to serve the application
CMD ["serve", "-s", "dist", "-l", "3000"]