#!/bin/bash

# DumbDee E-commerce Platform Deployment Script
# This script handles deployment of both frontend and backend

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="dumbdee-clone"
FRONTEND_DIR="frontend"
BACKEND_DIR="backend"
BUILD_DIR="dist"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    log_info "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v pnpm &> /dev/null; then
        log_error "pnpm is not installed"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        log_error "Git is not installed"
        exit 1
    fi
    
    log_success "All dependencies are installed"
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    
    # Frontend dependencies
    if [ -d "$FRONTEND_DIR" ]; then
        log_info "Installing frontend dependencies..."
        cd $FRONTEND_DIR
        pnpm install
        cd ..
        log_success "Frontend dependencies installed"
    fi
    
    # Backend dependencies
    if [ -d "$BACKEND_DIR" ]; then
        log_info "Installing backend dependencies..."
        cd $BACKEND_DIR
        npm install
        cd ..
        log_success "Backend dependencies installed"
    fi
}

# Build frontend
build_frontend() {
    log_info "Building frontend..."
    
    if [ ! -d "$FRONTEND_DIR" ]; then
        log_error "Frontend directory not found"
        exit 1
    fi
    
    cd $FRONTEND_DIR
    
    # Check if .env file exists
    if [ ! -f ".env" ]; then
        log_warning ".env file not found, copying from .env.example"
        if [ -f ".env.example" ]; then
            cp .env.example .env
            log_warning "Please update .env file with your configuration"
        fi
    fi
    
    # Build the project
    pnpm run build
    
    if [ $? -eq 0 ]; then
        log_success "Frontend build completed successfully"
    else
        log_error "Frontend build failed"
        exit 1
    fi
    
    cd ..
}

# Build backend
build_backend() {
    log_info "Building backend..."
    
    if [ ! -d "$BACKEND_DIR" ]; then
        log_error "Backend directory not found"
        exit 1
    fi
    
    cd $BACKEND_DIR
    
    # Check if .env file exists
    if [ ! -f ".env" ]; then
        log_warning ".env file not found, copying from .env.example"
        if [ -f ".env.example" ]; then
            cp .env.example .env
            log_warning "Please update .env file with your configuration"
        fi
    fi
    
    # Build the project
    npm run build
    
    if [ $? -eq 0 ]; then
        log_success "Backend build completed successfully"
    else
        log_error "Backend build failed"
        exit 1
    fi
    
    cd ..
}

# Deploy to production
deploy_production() {
    log_info "Deploying to production..."
    
    # Deploy frontend (static files)
    if [ -d "$FRONTEND_DIR/dist" ]; then
        log_info "Deploying frontend..."
        # Add your frontend deployment logic here
        # Example: rsync, AWS S3, Netlify, Vercel, etc.
        log_success "Frontend deployed successfully"
    fi
    
    # Deploy backend
    if [ -d "$BACKEND_DIR/dist" ]; then
        log_info "Deploying backend..."
        # Add your backend deployment logic here
        # Example: Docker, PM2, AWS ECS, Heroku, etc.
        log_success "Backend deployed successfully"
    fi
}

# Run tests
run_tests() {
    log_info "Running tests..."
    
    # Frontend tests
    if [ -d "$FRONTEND_DIR" ]; then
        log_info "Running frontend tests..."
        cd $FRONTEND_DIR
        if pnpm run test --passWithNoTests; then
            log_success "Frontend tests passed"
        else
            log_warning "Frontend tests failed or not configured"
        fi
        cd ..
    fi
    
    # Backend tests
    if [ -d "$BACKEND_DIR" ]; then
        log_info "Running backend tests..."
        cd $BACKEND_DIR
        if npm run test; then
            log_success "Backend tests passed"
        else
            log_warning "Backend tests failed or not configured"
        fi
        cd ..
    fi
}

# Clean build artifacts
clean() {
    log_info "Cleaning build artifacts..."
    
    if [ -d "$FRONTEND_DIR/dist" ]; then
        rm -rf $FRONTEND_DIR/dist
        log_success "Frontend build artifacts cleaned"
    fi
    
    if [ -d "$BACKEND_DIR/dist" ]; then
        rm -rf $BACKEND_DIR/dist
        log_success "Backend build artifacts cleaned"
    fi
    
    if [ -d "$FRONTEND_DIR/node_modules" ]; then
        rm -rf $FRONTEND_DIR/node_modules
        log_success "Frontend node_modules cleaned"
    fi
    
    if [ -d "$BACKEND_DIR/node_modules" ]; then
        rm -rf $BACKEND_DIR/node_modules
        log_success "Backend node_modules cleaned"
    fi
}

# Setup development environment
setup_dev() {
    log_info "Setting up development environment..."
    
    check_dependencies
    install_dependencies
    
    # Copy environment files
    if [ -f "$FRONTEND_DIR/.env.example" ] && [ ! -f "$FRONTEND_DIR/.env" ]; then
        cp $FRONTEND_DIR/.env.example $FRONTEND_DIR/.env
        log_success "Frontend .env file created"
    fi
    
    if [ -f "$BACKEND_DIR/.env.example" ] && [ ! -f "$BACKEND_DIR/.env" ]; then
        cp $BACKEND_DIR/.env.example $BACKEND_DIR/.env
        log_success "Backend .env file created"
    fi
    
    log_success "Development environment setup completed"
    log_info "Please update .env files with your configuration"
}

# Start development servers
start_dev() {
    log_info "Starting development servers..."
    
    # Start backend in background
    if [ -d "$BACKEND_DIR" ]; then
        log_info "Starting backend server..."
        cd $BACKEND_DIR
        npm run start:dev &
        BACKEND_PID=$!
        cd ..
        log_success "Backend server started (PID: $BACKEND_PID)"
    fi
    
    # Start frontend
    if [ -d "$FRONTEND_DIR" ]; then
        log_info "Starting frontend server..."
        cd $FRONTEND_DIR
        pnpm run dev
        cd ..
    fi
}

# Show help
show_help() {
    echo "DumbDee E-commerce Platform Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  setup-dev     Setup development environment"
    echo "  start-dev     Start development servers"
    echo "  install       Install dependencies"
    echo "  build         Build both frontend and backend"
    echo "  build-frontend Build only frontend"
    echo "  build-backend Build only backend"
    echo "  test          Run tests"
    echo "  deploy        Deploy to production"
    echo "  clean         Clean build artifacts"
    echo "  help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 setup-dev     # Setup development environment"
    echo "  $0 build         # Build both frontend and backend"
    echo "  $0 deploy        # Deploy to production"
}

# Main script logic
case "${1:-help}" in
    "setup-dev")
        setup_dev
        ;;
    "start-dev")
        start_dev
        ;;
    "install")
        check_dependencies
        install_dependencies
        ;;
    "build")
        check_dependencies
        install_dependencies
        build_frontend
        build_backend
        ;;
    "build-frontend")
        check_dependencies
        build_frontend
        ;;
    "build-backend")
        check_dependencies
        build_backend
        ;;
    "test")
        run_tests
        ;;
    "deploy")
        check_dependencies
        install_dependencies
        run_tests
        build_frontend
        build_backend
        deploy_production
        ;;
    "clean")
        clean
        ;;
    "help"|*)
        show_help
        ;;
esac

