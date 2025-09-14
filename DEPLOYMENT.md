# DumbDee E-commerce Platform - Deployment Guide

This guide covers deployment options for the DumbDee e-commerce platform, including local development, staging, and production environments.

## 🏗️ Architecture Overview

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: NestJS + MongoDB + Redis
- **Storage**: AWS S3 for images and static assets
- **Payments**: PayPal (International) + Razorpay (India)
- **Features**: i18n, Location-based services, Feature toggles

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm
- MongoDB 6.0+
- Redis 7+ (optional)
- AWS Account with S3 access
- PayPal Developer Account
- Razorpay Account (for India)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone https://github.com/your-username/dumbdee-clone.git
cd dumbdee-clone
./deploy.sh setup-dev
```

### 2. Configure Environment

Copy and update environment files:

```bash
# Frontend
cp frontend/.env.example frontend/.env

# Backend
cp backend/.env.example backend/.env
```

### 3. Start Development

```bash
./deploy.sh start-dev
```

## 🔧 Environment Configuration

### Frontend (.env)

```env
# AWS S3 Configuration
REACT_APP_AWS_REGION=us-east-1
REACT_APP_AWS_ACCESS_KEY_ID=your_access_key
REACT_APP_AWS_SECRET_ACCESS_KEY=your_secret_key
REACT_APP_S3_BUCKET_NAME=dumbdee-images

# API Configuration
REACT_APP_API_BASE_URL=http://localhost:3001/api

# Payment Configuration
REACT_APP_PAYPAL_CLIENT_ID=your_paypal_client_id
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id

# Feature Flags
REACT_APP_FLAGSMITH_ENVIRONMENT_ID=your_flagsmith_id
```

### Backend (.env)

```env
# Database
MONGODB_URI=mongodb://localhost:27017/dumbdee
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=dumbdee-images

# Payments
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

## 🐳 Docker Deployment

### Development with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Docker Build

```bash
# Build images
docker build -f Dockerfile.frontend -t dumbdee-frontend .
docker build -f Dockerfile.backend -t dumbdee-backend .

# Run containers
docker run -d -p 3000:80 dumbdee-frontend
docker run -d -p 3001:3001 dumbdee-backend
```

## ☁️ Cloud Deployment Options

### 1. AWS Deployment

#### Frontend (S3 + CloudFront)

```bash
# Build frontend
cd frontend
pnpm run build

# Deploy to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

#### Backend (ECS/EC2)

```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ECR_URI
docker build -f Dockerfile.backend -t dumbdee-backend .
docker tag dumbdee-backend:latest YOUR_ECR_URI/dumbdee-backend:latest
docker push YOUR_ECR_URI/dumbdee-backend:latest
```

### 2. Vercel Deployment (Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

### 3. Heroku Deployment (Backend)

```bash
# Create Heroku app
heroku create dumbdee-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret

# Deploy
git subtree push --prefix backend heroku main
```

### 4. Railway Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway deploy
```

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. Create MongoDB Atlas account
2. Create cluster and database
3. Get connection string
4. Update MONGODB_URI in environment

### Local MongoDB

```bash
# Install MongoDB
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb-community

# Start MongoDB
sudo systemctl start mongod

# Connect
mongo mongodb://localhost:27017/dumbdee
```

## 📦 AWS S3 Setup

### 1. Create S3 Bucket

```bash
aws s3 mb s3://dumbdee-images --region us-east-1
```

### 2. Configure CORS

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

### 3. Set Bucket Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::dumbdee-images/*"
    }
  ]
}
```

## 💳 Payment Integration Setup

### PayPal Setup

1. Create PayPal Developer account
2. Create application
3. Get Client ID and Secret
4. Configure webhooks for order events

### Razorpay Setup

1. Create Razorpay account
2. Get API keys from dashboard
3. Configure webhooks
4. Set up payment methods

## 🌍 CDN and Performance

### CloudFront Setup

```bash
# Create CloudFront distribution
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

### Performance Optimizations

- Enable gzip compression
- Set proper cache headers
- Use WebP images
- Implement lazy loading
- Enable service worker

## 📊 Monitoring and Analytics

### Application Monitoring

- **Sentry**: Error tracking and performance monitoring
- **LogRocket**: Session replay and debugging
- **New Relic**: Application performance monitoring

### Analytics

- **Google Analytics**: Web analytics
- **Facebook Pixel**: Social media tracking
- **Hotjar**: User behavior analytics

## 🔒 Security Considerations

### SSL/TLS

```bash
# Let's Encrypt with Certbot
sudo certbot --nginx -d yourdomain.com
```

### Security Headers

- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options
- X-Content-Type-Options

### Environment Security

- Use environment variables for secrets
- Rotate API keys regularly
- Implement rate limiting
- Use HTTPS everywhere

## 🧪 Testing

### Frontend Testing

```bash
cd frontend
pnpm run test
pnpm run test:e2e
```

### Backend Testing

```bash
cd backend
npm run test
npm run test:e2e
```

### Load Testing

```bash
# Using Artillery
npm install -g artillery
artillery run load-test.yml
```

## 📈 Scaling Considerations

### Horizontal Scaling

- Load balancer configuration
- Database sharding
- Redis clustering
- CDN optimization

### Vertical Scaling

- Server resource optimization
- Database indexing
- Query optimization
- Caching strategies

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: ./deploy.sh install
      - name: Run tests
        run: ./deploy.sh test
      - name: Build
        run: ./deploy.sh build
      - name: Deploy
        run: ./deploy.sh deploy
```

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**: Check API base URL and CORS configuration
2. **Image Upload Fails**: Verify AWS credentials and S3 permissions
3. **Payment Issues**: Check API keys and webhook configurations
4. **Build Failures**: Ensure all environment variables are set

### Debug Commands

```bash
# Check logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Database connection
mongo $MONGODB_URI

# Redis connection
redis-cli -u $REDIS_URL

# S3 access
aws s3 ls s3://dumbdee-images
```

## 📞 Support

For deployment issues or questions:

1. Check the troubleshooting section
2. Review environment configuration
3. Check application logs
4. Contact support team

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

