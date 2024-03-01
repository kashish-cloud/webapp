#!/bin/bash

# Ensure the script is run as root
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 
fi

# Update and Upgrade System (for CentOS)
sudo yum update -y

# Install Node.js and npm
sudo yum install -y nodejs npm

# Verify installations
echo "Verifying installations...."
sudo node --version
sudo npm --version

echo "Installation completed!"

# Navigate to /opt directory
cd /opt

# sudo useradd -g csye6225 -s /usr/sbin/nologin csye6225

sudo usermod -s /usr/sbin/nologin csye6225

sudo mkdir -p /opt/webapp/

sudo chown -R csye6225:csye6225 /opt/webapp

# Install unzip
sudo yum install -y unzip

# Unzip the zip file
sudo unzip -o /tmp/webapp.zip -d /opt/webapp

sudo mv /opt/webapp/kas.service /etc/systemd/system/kas.service

sudo systemctl daemon-reload

sudo systemctl enable kas.service