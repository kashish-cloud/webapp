#!/bin/bash

# Ensure the script is run as root
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 
   exit 1
fi

# Update and Upgrade System (for CentOS)
yum update -y

# Install PostgreSQL
yum install -y postgresql-server postgresql-contrib

# Initialize and start PostgreSQL
postgresql-setup initdb
systemctl start postgresql
systemctl enable postgresql

# Set PostgreSQL password and create database
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'Flender@1';"
sudo -u postgres createdb kashishdesai

# Install Node.js and npm
yum install -y nodejs npm

# Verify installations
echo "Verifying installations...."
psql --version
node --version
npm --version

echo "Installation completed!"

# Navigate to /opt directory
cd /opt

# Install unzip
yum install -y unzip

# Unzip the zip file
unzip Kashish_Desai_002795337_04.zip