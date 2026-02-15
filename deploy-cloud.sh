#!/bin/bash

# SCCK ERP NEXUS - Modern Cloud Deployment Script
# Deploys to Railway (Backend) + Vercel (Frontend) + Supabase (Database)

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  SCCK ERP NEXUS - Cloud Deployment"
echo "  Railway + Vercel + Supabase"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}➤${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${CYAN}ℹ${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        echo "Install from: https://nodejs.org"
        exit 1
    fi
    print_success "Node.js $(node -v)"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    print_success "npm $(npm -v)"
    
    # Check Git
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed"
        exit 1
    fi
    
    echo ""
}

# Setup environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    # Backend .env
    if [ ! -f ".env" ]; then
        if [ -f ".env.production" ]; then
            cp .env.production .env
            print_success "Created .env from .env.production"
            print_warning "Edit .env with your actual credentials before deploying!"
        else
            print_error ".env.production template not found"
            exit 1
        fi
    else
        print_success ".env already exists"
    fi
    
    # Frontend .env
    if [ ! -f "frontend/.env" ]; then
        if [ -f "frontend/.env.example" ]; then
            cp frontend/.env.example frontend/.env
            print_success "Created frontend/.env"
            print_warning "Update VITE_API_URL after Railway deployment"
        fi
    fi
    
    echo ""
}

# Install all dependencies
install_deps() {
    print_status "Installing dependencies..."
    
    # Backend
    print_status "Installing backend dependencies..."
    npm install
    print_success "Backend dependencies installed"
    
    # Frontend
    print_status "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
    print_success "Frontend dependencies installed"
    
    echo ""
}

# Test Supabase connection
test_database() {
    print_status "Testing Supabase connection..."
    
    if node test-supabase.js; then
        print_success "Database connection OK"
    else
        print_error "Database connection failed"
        print_info "Check SUPABASE_URL and SUPABASE_SERVICE_KEY in .env"
        exit 1
    fi
    
    echo ""
}

# Build frontend
build() {
    print_status "Building frontend..."
    
    cd frontend
    if npm run build; then
        print_success "Frontend built successfully"
    else
        print_error "Build failed"
        cd ..
        exit 1
    fi
    cd ..
    
    echo ""
}

# Install Railway CLI
install_railway_cli() {
    if ! command -v railway &> /dev/null; then
        print_status "Installing Railway CLI..."
        npm install -g @railway/cli
        print_success "Railway CLI installed"
    else
        print_success "Railway CLI already installed"
    fi
}

# Deploy backend to Railway
deploy_railway() {
    print_status "Deploying backend to Railway..."
    
    install_railway_cli
    
    print_info "Opening Railway login..."
    railway login
    
    print_status "Linking to Railway project..."
    railway link || railway init
    
    print_status "Setting environment variables..."
    # Read .env and set variables
    while IFS='=' read -r key value; do
        # Skip comments and empty lines
        [[ "$key" =~ ^#.*$ ]] && continue
        [[ -z "$key" ]] && continue
        # Remove quotes if present
        value=$(echo "$value" | sed -e 's/^["\'"'"']*//g' -e 's/["\'"'"']*$//g')
        railway variables set "$key=$value" || true
    done < .env
    
    print_status "Deploying..."
    railway up
    
    print_success "Backend deployed to Railway!"
    print_info "Check Railway dashboard for URL"
    
    echo ""
}

# Install Vercel CLI
install_vercel_cli() {
    if ! command -v vercel &> /dev/null; then
        print_status "Installing Vercel CLI..."
        npm install -g vercel
        print_success "Vercel CLI installed"
    else
        print_success "Vercel CLI already installed"
    fi
}

# Deploy frontend to Vercel
deploy_vercel() {
    print_status "Deploying frontend to Vercel..."
    
    install_vercel_cli
    
    print_status "Building for production..."
    cd frontend && npm run build && cd ..
    
    print_status "Deploying to Vercel..."
    vercel --prod
    
    print_success "Frontend deployed to Vercel!"
    
    echo ""
}

# Generate summary
generate_summary() {
    cat > DEPLOYMENT_STATUS.txt << EOF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  DEPLOYMENT STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Date: $(date)

✓ Backend: Railway
✓ Frontend: Vercel  
✓ Database: Supabase

Next Steps:
1. Copy Railway URL to frontend/.env as VITE_API_URL
2. Redeploy frontend: vercel --prod
3. Add Vercel URL to Railway ALLOWED_ORIGINS
4. Test the application

URLs:
- Railway: Check dashboard
- Vercel: Check dashboard
- Supabase: https://app.supabase.com/project/wjxqtkvpcdeynmfnlfox

Cost: $0/month (Free Tier)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF
    
    print_success "Deployment status saved to DEPLOYMENT_STATUS.txt"
}

# Quick deployment
quick_deploy() {
    print_status "Starting quick deployment..."
    
    check_prerequisites
    setup_environment
    install_deps
    test_database
    build
    deploy_railway
    deploy_vercel
    generate_summary
    
    print_success "Deployment complete!"
    print_info "Check DEPLOYMENT_STATUS.txt for details"
}

# Show help
show_help() {
    echo "Usage: ./deploy-cloud.sh [command]"
    echo ""
    echo "Commands:"
    echo "  setup       - Setup environment files"
    echo "  install     - Install all dependencies"
    echo "  test        - Test database connection"
    echo "  build       - Build frontend"
    echo "  railway     - Deploy backend to Railway"
    echo "  vercel      - Deploy frontend to Vercel"
    echo "  full        - Full deployment (all steps)"
    echo "  help        - Show this help"
    echo ""
    echo "Examples:"
    echo "  ./deploy-cloud.sh full      # Complete deployment"
    echo "  ./deploy-cloud.sh railway   # Deploy backend only"
    echo "  ./deploy-cloud.sh vercel    # Deploy frontend only"
}

# Main
case "${1:-full}" in
    setup)
        setup_environment
        ;;
    install)
        install_deps
        ;;
    test)
        test_database
        ;;
    build)
        build
        ;;
    railway)
        deploy_railway
        ;;
    vercel)
        deploy_vercel
        ;;
    full)
        quick_deploy
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
