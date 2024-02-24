#!/bin/bash

# Ensure the script is run as root
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 
fi

# Update and Upgrade System (for CentOS)
sudo yum update -y

# Install PostgreSQL
sudo yum install -y postgresql-server postgresql-contrib

# Initialize and start PostgreSQL
sudo postgresql-setup initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Set PostgreSQL password and create database
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'Flender@1';"
sudo -u postgres createdb kashishdesai

# Install Node.js and npm
sudo yum install -y nodejs npm

# Verify installations
echo "Verifying installations...."
sudo psql --version
sudo node --version
sudo npm --version

echo "Installation completed!"

# Navigate to /opt directory
cd /opt

#zip webapp.zip webapp-fork

# Install unzip
sudo yum install -y unzip

# Unzip the zip file
sudo unzip /tmp/webapp.zip