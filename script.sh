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
sudo postgresql-setup --initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Set PostgreSQL password and create database
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'Flender@1';"
sudo -u postgres createdb kashishdesai

# Update pg_hba.conf for md5 authentication
PG_HBA_CONF="/var/lib/pgsql/data/pg_hba.conf"

if [ -f "$PG_HBA_CONF" ]; then
    # Use sed to replace "ident" and "peer" with "md5" in the file
    sudo sed -i 's/ident/md5/g; s/peer/md5/g' "$PG_HBA_CONF"
    echo "pg_hba.conf updated successfully."
else
    echo "Error: pg_hba.conf not found at $PG_HBA_CONF."
fi

sudo systemctl restart postgresql

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