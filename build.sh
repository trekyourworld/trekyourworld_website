#!/bin/bash

# Variables
IMAGE_NAME="neo73/trekyourworld-website"

# Prompt for tag input
read -p "Enter the tag for the image: " TAG

# Build the Docker image
echo "Building the Docker image..."
docker build -t $IMAGE_NAME:$TAG .
docker tag $IMAGE_NAME:$TAG $IMAGE_NAME:latest

# Authenticate to Docker Hub
echo "Logging in to Docker Hub..."
docker login

# Push the Docker image to Docker Hub
echo "Pushing the Docker image to Docker Hub..."
docker push $IMAGE_NAME:$TAG
docker push $IMAGE_NAME:latest

echo "Done!"
