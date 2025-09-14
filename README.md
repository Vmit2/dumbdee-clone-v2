# DumbDee E-commerce Platform - Full-Stack Clone

This repository contains a full-stack clone of the DumbDee e-commerce website, built with a modern technology stack. The project includes a complete frontend, backend, seller dashboard, payment integration, and advanced features like multilingual support and location-based services.

## ✨ Features

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Backend**: NestJS, MongoDB, Redis
- **Seller Dashboard**: Full-featured marketplace for sellers to manage products, orders, and analytics.
- **Payment Integration**: PayPal (International) and Razorpay (India) with automatic location-based selection.
- **Location-Based Features**: Geolocation detection, localized content, and feature toggles using Flagsmith.
- **Multilingual Support**: i18n setup with 6 languages (English, Spanish, French, German, Hindi, Chinese).
- **Image Storage**: AWS S3 for product images, seller profiles, and other assets.
- **Deployment**: Dockerized setup with Nginx for production, and a comprehensive deployment script.
- **Authentication**: JWT-based authentication for both users and sellers.

## 🚀 Live Demo

[Link to Live Demo](https://your-deployment-url.com)

## 📸 Screenshots

| Homepage | Seller Dashboard | Checkout |
|---|---|---|
| ![Homepage](https://i.imgur.com/your-homepage-screenshot.png) | ![Seller Dashboard](https://i.imgur.com/your-dashboard-screenshot.png) | ![Checkout](https://i.imgur.com/your-checkout-screenshot.png) |

## 🛠️ Technologies Used

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, React Query, React Hook Form, i18next
- **Backend**: NestJS, MongoDB, Mongoose, Passport.js, JWT
- **Database**: MongoDB, Redis (for caching)
- **Storage**: AWS S3
- **Payments**: PayPal, Razorpay
- **Deployment**: Docker, Nginx, PM2
- **Tooling**: pnpm, Vite, ESLint, Prettier

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Docker and Docker Compose
- AWS Account and S3 Bucket
- PayPal and Razorpay Developer Accounts

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/dumbdee-clone.git
    cd dumbdee-clone
    ```

2.  **Setup development environment:**

    ```bash
    ./deploy.sh setup-dev
    ```

3.  **Configure environment variables:**

    Create `.env` files in both `frontend` and `backend` directories by copying from the `.env.example` files and filling in your credentials.

4.  **Start the development servers:**

    ```bash
    ./deploy.sh start-dev
    ```

    - Frontend will be available at `http://localhost:5173`
    - Backend will be available at `http://localhost:3001`

### Docker Deployment

```bash
docker-compose up -d
```

- Frontend will be available at `http://localhost:3000`
- Backend will be available at `http://localhost:3001`

## 📝 API Documentation

API documentation is available via Swagger at `http://localhost:3001/api`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


## 🚀 Features

### Core Features
- **Multi-category Product Catalog** - Women, Men, and Kids fashion
- **Advanced Search & Filtering** - Find products quickly with smart filters
- **Shopping Cart & Wishlist** - Seamless shopping experience
- **User Authentication** - Secure login and registration
- **Responsive Design** - Optimized for desktop and mobile devices
- **Performance Optimized** - Lazy loading, skeleton loaders, and code splitting

### Seller Features
- **Seller Dashboard** - Comprehensive marketplace management
- **Product Management** - Upload and manage product listings
- **Sales Analytics** - Revenue tracking and performance metrics
- **Order Management** - Track and fulfill customer orders
- **Inventory Tracking** - Real-time stock management

### Advanced Features
- **Multi-language Support** - i18n implementation for global reach
- **Location-based Features** - Auto-detect user location for personalized experience
- **Feature Toggles** - Easy feature management and A/B testing
- **Payment Integration** - PayPal (international) and Razorpay (India)
- **Cloud Storage** - AWS S3 integration for product images

## 🛠 Tech Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Server state management
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **Framer Motion** - Smooth animations

### Backend
- **NestJS** - Scalable Node.js framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Token authentication
- **Passport** - Authentication middleware
- **Multer** - File upload handling
- **Class Validator** - Input validation
- **Swagger** - API documentation

### Third-party Services
- **Auth0** - Authentication service
- **PayPal SDK** - International payments
- **Razorpay** - Indian payment gateway
- **AWS S3** - File storage
- **LaunchDarkly** - Feature flags (or alternative)
- **i18next** - Internationalization

## 📁 Project Structure

```
dumbdee-clone/
├── frontend/                 # React 19 + TypeScript frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API services
│   │   ├── store/           # State management
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   └── assets/          # Static assets
│   ├── public/              # Public assets
│   └── package.json
├── backend/                 # NestJS backend API
│   ├── src/
│   │   ├── modules/         # Feature modules
│   │   ├── common/          # Shared utilities
│   │   ├── config/          # Configuration files
│   │   ├── guards/          # Authentication guards
│   │   ├── decorators/      # Custom decorators
│   │   └── schemas/         # MongoDB schemas
│   └── package.json
├── docs/                    # Documentation
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB (local or cloud)
- AWS account (for S3 storage)
- PayPal Developer account
- Razorpay account

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dumbdee-clone.git
   cd dumbdee-clone
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure your environment variables
   npm run start:dev
   ```

3. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Configure your environment variables
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/api

### Detailed Setup Instructions

For detailed setup instructions, please refer to:
- [Frontend Setup Guide](./frontend/README.md)
- [Backend Setup Guide](./backend/README.md)

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/dumbdee-clone

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=your-region
AWS_S3_BUCKET=your-bucket-name

# Payment Gateways
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-secret
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Feature Flags
LAUNCHDARKLY_SDK_KEY=your-launchdarkly-key

# Auth0
AUTH0_DOMAIN=your-auth0-domain
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
```

#### Frontend (.env)
```env
# API
VITE_API_URL=http://localhost:3001

# Auth0
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id

# Payment Gateways
VITE_PAYPAL_CLIENT_ID=your-paypal-client-id
VITE_RAZORPAY_KEY_ID=your-razorpay-key

# Feature Flags
VITE_LAUNCHDARKLY_CLIENT_ID=your-launchdarkly-client-id
```

## 📚 API Documentation

The API documentation is automatically generated using Swagger and available at:
- Development: http://localhost:3001/api
- Production: https://your-domain.com/api

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run test          # Run unit tests
npm run test:e2e      # Run end-to-end tests
npm run test:coverage # Generate coverage report
```

### Backend Testing
```bash
cd backend
npm run test          # Run unit tests
npm run test:e2e      # Run end-to-end tests
npm run test:cov      # Generate coverage report
```

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the dist/ folder to your hosting service
```

### Backend Deployment (Railway/Heroku/AWS)
```bash
cd backend
npm run build
# Deploy using your preferred platform
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original DumbDee website for design inspiration
- React and NestJS communities for excellent documentation
- All contributors who help improve this project

## 📞 Support

For support, email support@yourcompany.com or join our Slack channel.

---

**Note**: This is a clone project for educational purposes. Please ensure you have proper rights and permissions before using any copyrighted content.

