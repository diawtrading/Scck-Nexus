#!/bin/bash

# SCCK ERP NEXUS Production Deployment Script
# Run this script to deploy on a Linux/Ubuntu server

set -e

echo "======================================"
echo "SCCK ERP NEXUS Production Deployment"
echo "======================================"

# Check prerequisites
echo "[1/7] Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Install Node.js 16+ first"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

if ! command -v sqlite3 &> /dev/null; then
    echo "⚠️  SQLite is not installed. Installing..."
    sudo apt-get update && sudo apt-get install -y sqlite3
fi

echo "✓ Prerequisites OK"

# Clone/Setup repository
echo "[2/7] Setting up application..."
if [ ! -d ".git" ]; then
    echo "❌ This is not a git repository"
    exit 1
fi

git pull origin main || echo "Unable to pull latest changes"

# Install dependencies
echo "[3/7] Installing dependencies..."
npm ci --only=production

# Setup environment
echo "[4/7] Configuring environment..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "⚠️  Created .env file. Please edit it with your configuration"
    echo "Press Enter to continue..."
    read
fi

# Create necessary directories
echo "[5/7] Creating directories..."
mkdir -p ./data
mkdir -p ./backups
mkdir -p ./uploads
mkdir -p ./logs

# Initialize database
echo "[6/7] Initializing database..."
node -e "const DB = require('./db/database'); const db = new DB(); db.initialize(); console.log('Database initialized');"

# Start application with PM2
echo "[7/7] Starting application..."
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
    pm2 startup
fi

pm2 restart scck-erp || pm2 start server.js --name "scck-erp"
pm2 save

echo ""
echo "======================================"
echo "✓ Deployment Complete!"
echo "======================================"
echo ""
echo "Application started successfully"
echo "Server running at: http://localhost:$(grep PORT .env | cut -d '=' -f 2)"
echo ""
echo "Next steps:"
echo "1. Edit .env with your production settings"
echo "2. Setup a reverse proxy (nginx/Apache)"
echo "3. Configure SSL certificates"
echo "4. Setup automated backups"
echo "5. Monitor application logs: pm2 logs scck-erp"
echo ""
echo "Commands:"
echo "  pm2 logs scck-erp          - View logs"
echo "  pm2 stop scck-erp         - Stop app"
echo "  pm2 restart scck-erp      - Restart app"
echo "  pm2 delete scck-erp       - Remove app"
echo ""
