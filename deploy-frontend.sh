#!/bin/bash
# Vercel Deployment Script for SCCK ERP Frontend
# Set VERCEL_TOKEN environment variable before running

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  SCCK ERP NEXUS - Vercel Deployment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

VERCEL_TOKEN="${VERCEL_TOKEN:-}"  # Set this environment variable with your Vercel token

# Check prerequisites
echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js $(node -v)"

# Check if we're in the right directory
if [ ! -f "vercel.json" ]; then
    echo -e "${RED}❌ Error: Not in project root directory${NC}"
    echo "Please run this script from SCCK_ERP_NEXUS folder"
    exit 1
fi

# Install Vercel CLI if needed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

echo -e "${GREEN}✓${NC} Vercel CLI installed"

# Navigate to frontend
cd frontend

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << 'EOF'
VITE_API_URL=https://scck-api.up.railway.app
EOF
    echo -e "${YELLOW}⚠${NC} Please update VITE_API_URL with your Railway backend URL"
fi

# Install dependencies
echo "Installing frontend dependencies..."
npm install

# Build project
echo "Building frontend..."
npm run build

# Deploy to Vercel
echo ""
echo "Deploying to Vercel..."
echo ""
vercel --token "$VERCEL_TOKEN" --prod --yes

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✅ Deployment Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Next steps:"
echo "1. Copy the Vercel URL above"
echo "2. Update Railway ALLOWED_ORIGINS with this URL"
echo "3. Test the application"
echo ""
