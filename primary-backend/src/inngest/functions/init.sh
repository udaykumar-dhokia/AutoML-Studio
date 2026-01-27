#!/bin/bash
# init.sh - commands to run when container starts

WORKFLOW_ID=$1  # Get workflow ID from argument
FOLDER_PATH="/$WORKFLOW_ID"

echo "Starting container setup..."
echo "Creating folder: $FOLDER_PATH"

# Create base directory if it doesn't exist
mkdir -p /workflows

# Create the folder for this workflow
mkdir -p "$FOLDER_PATH"

# Update package list and install packages
apt-get update -y
apt-get install -y curl vim git

echo "Container setup complete. Folder created at $FOLDER_PATH"

# Keep the container running
sleep infinity
