#!/bin/bash
# init.sh - commands to run when container starts

set -e  # Exit on error

WORKFLOW_ID=$1
FOLDER_PATH="/$WORKFLOW_ID"
VENV_PATH="$FOLDER_PATH/venv"

echo "Starting container setup..."
echo "Workflow ID: $WORKFLOW_ID"
echo "Creating folder: $FOLDER_PATH"

# Create base directory if it doesn't exist
mkdir -p /workflows

# Create the folder for this workflow
mkdir -p "$FOLDER_PATH"

# Update package list and install system packages
apt-get update -y
apt-get install -y \
    python3 \
    python3-venv \
    python3-pip \
    curl \
    vim \
    git \
    build-essential

echo "Creating Python virtual environment at $VENV_PATH"

# Create virtual environment
python3 -m venv "$VENV_PATH"

# Activate venv
source "$VENV_PATH/bin/activate"

# Upgrade pip
pip install --upgrade pip setuptools wheel

echo "Installing ML libraries..."

# Install common ML / data science libraries
pip install \
    numpy \
    pandas \
    scipy \
    scikit-learn \
    matplotlib \
    seaborn \
    jupyter \
    torch \
    torchvision \
    torchaudio \
    tensorflow

echo "Python venv ready with ML libraries installed."

# Notify backend that container is ready
echo "Notifying backend at ${BACKEND_URL}/api/container/workflow/$WORKFLOW_ID/ready"
curl -X POST "${BACKEND_URL}/api/container/workflow/$WORKFLOW_ID/ready"

# Keep the container running
sleep infinity
