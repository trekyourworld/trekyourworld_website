#!/bin/bash
set -e

# Variables
IMAGE_NAME="trekyourworld-website"
CONTAINER_NAME="web_app"
PORT="3000"

echo "====== Starting deployment process ======"

# Load Docker image from tar file
echo "Loading Docker image from tar file..."
docker load < trekyourworld-website.tar

# Check if container with the same name is already running
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "Stopping running container..."
    docker stop $CONTAINER_NAME
    docker rm $CONTAINER_NAME
fi

# Check for any stopped containers with the same name
if [ "$(docker ps -aq -f status=exited -f name=$CONTAINER_NAME)" ]; then
    echo "Removing stopped container..."
    docker rm $CONTAINER_NAME
fi

# Run the new container
echo "Starting new container..."
docker run -d \
    --name $CONTAINER_NAME \
    -p $PORT:3000 \
    --restart unless-stopped \
    $IMAGE_NAME:latest

echo "====== Deployment completed successfully ======"

# Cleanup
echo "Cleaning up..."
rm -f trekyourworld-website.tar

echo "Done!"