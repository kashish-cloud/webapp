#!/bin/bash

# Ensure the script is run as root
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 
fi

# Update and Upgrade System (for CentOS)
sudo dnf update -y

# Enable Node.js module for version 18
sudo dnf module enable -y nodejs:18

# Install Node.js and npm
sudo dnf install -y nodejs npm

# Verify installations
echo "Verifying installations...."
sudo node --version
sudo npm --version

echo "Installation completed!"

# Set file permissions for /var/log/webapp/ directory
sudo mkdir -p /var/log/webapp/
sudo chown -R csye6225:csye6225 /var/log/webapp/

# Navigate to /opt directory
cd /opt

# sudo useradd -g csye6225 -s /usr/sbin/nologin csye6225

sudo usermod -s /usr/sbin/nologin csye6225

sudo mkdir -p /opt/webapp/

sudo chown -R csye6225:csye6225 /opt/webapp

# Install unzip
sudo dnf install -y unzip

# Unzip the zip file
sudo unzip -o /tmp/webapp.zip -d /opt/webapp

sudo mv /opt/webapp/kas.service /etc/systemd/system/kas.service

sudo systemctl daemon-reload

sudo systemctl enable kas.service

# Copy config.yaml to the right destination
#sudo mv /tmp/config.yaml /etc/google-cloud-ops-agent/config.yaml

# Restart Ops Agent
#sudo systemctl restart google-cloud-ops-agent