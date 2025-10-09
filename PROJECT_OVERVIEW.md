# Elite Properties - Project Overview

## What is This Project?

**Elite Properties** is a comprehensive, full-stack real estate platform that enables users to buy, sell, and manage properties online. Built with the modern MERN stack (MongoDB, Express.js, React, Node.js), it provides a complete solution for real estate transactions with sophisticated role-based access control and secure payment processing.

## Project Type

This is the **frontend client application** of the Elite Properties platform, built with React 19 and Vite. It communicates with a separate backend API server to provide a seamless user experience.

## Core Purpose

The platform serves three main purposes:

1. **Property Marketplace** - Users can browse, search, and view detailed property listings
2. **Property Management** - Agents can list and manage their properties
3. **Platform Administration** - Admins can moderate content, manage users, and control advertisements

## Target Users

### 👤 Regular Users
- Browse and search properties
- Add properties to wishlist
- Make offers on properties
- Submit reviews and ratings
- Manage their profile and purchased properties

### 🏢 Real Estate Agents
- List new properties (subject to admin verification)
- Manage their property listings
- Respond to offers from potential buyers
- Track sales and commissions

### 👨‍💼 Administrators
- Verify and approve agent listings
- Manage user roles and permissions
- Mark fraudulent users
- Control property advertisements
- Moderate reviews and content

## Key Features

### Authentication & Authorization
- **Firebase Authentication** - Secure email/password and Google OAuth sign-in
- **JWT Token Management** - Server-side authentication with token-based security
- **Role-Based Access Control (RBAC)** - Three distinct user roles with specific permissions
- **Protected Routes** - Client-side route protection based on authentication status

### Property Management
- **Property Listings** - Complete CRUD operations for properties
- **Image Upload** - Cloud-based image storage via Cloudinary
- **Verification System** - Admin approval workflow for new listings
- **Status Management** - Track property status (pending, verified, rejected, sold)
- **Advanced Search** - Filter by location, price range, and features

### User Interactions
- **Wishlist System** - Save favorite properties for later viewing
- **Offer System** - Make and negotiate property offers with price validation
- **Review & Rating** - 5-star rating system with written reviews
- **Real-time Notifications** - Toast notifications for all user actions

### Payment Integration
- **Stripe Integration** - Secure payment processing for property purchases
- **Transaction History** - Track payment records and receipts

### Dashboard System
- **Role-Specific Dashboards** - Customized views based on user role
- **User Dashboard** - Manage wishlist, offers, and purchased properties
- **Agent Dashboard** - Property management and offer tracking
- **Admin Dashboard** - User management, property verification, and analytics

## Technology Stack

### Frontend (This Repository)
- **React 19.1.1** - Latest React with modern hooks and concurrent features
- **Vite 7.1.7** - Next-generation frontend build tool for fast development
- **React Router DOM 7.9.3** - Client-side routing and navigation
- **TanStack Query 5.90.2** - Data fetching, caching, and state management
- **Firebase 12.3.0** - Authentication and user management
- **Axios 1.12.2** - HTTP client for API communication
- **React Hook Form 7.63.0** - Performant form validation
- **React Hot Toast 2.6.0** - Beautiful toast notifications
- **Swiper.js 12.0.2** - Modern touch slider for image galleries
- **Vanilla CSS** - Custom styling with CSS variables and modern CSS features

### Backend (Separate Repository)
- **Node.js & Express.js** - Server runtime and web framework
- **MongoDB & Mongoose** - NoSQL database and ODM
- **Firebase Admin SDK** - Server-side Firebase authentication verification
- **JWT** - JSON Web Token for API authentication
- **Multer** - Multipart form data handling for file uploads
- **Cloudinary** - Cloud-based image storage and management
- **Stripe** - Payment processing API

## Project Structure

```
B11_Assignment_12_category_008_client/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── dashboard/       # Dashboard-specific components
│   │   ├── home/            # Home page components
│   │   ├── layout/          # Layout components (Header, Footer)
│   │   └── shared/          # Shared components (Navbar, PrivateRoute)
│   ├── pages/               # Page components
│   │   ├── dashboard/       # Dashboard pages (Admin, Agent, User)
│   │   ├── Home.jsx         # Landing page
│   │   ├── Login.jsx        # Login page
│   │   ├── Register.jsx     # Registration page
│   │   ├── AllProperties.jsx # Property listing page
│   │   ├── PropertyDetails.jsx # Single property details
│   │   └── AddPropertyPublic.jsx # Public property submission
│   ├── contexts/            # React Context providers
│   │   └── AuthContext.jsx  # Authentication context
│   ├── services/            # API and external services
│   │   ├── api.js           # Axios configuration
│   │   ├── firebase.js      # Firebase configuration
│   │   └── keepAlive.js     # Keep backend alive service
│   ├── router/              # Routing configuration
│   │   └── AppRouter.jsx    # Main app router
│   ├── utils/               # Utility functions
│   │   └── toast.js         # Toast notification utilities
│   ├── config/              # Configuration files
│   │   └── queryClient.js   # TanStack Query configuration
│   ├── styles/              # Additional stylesheets
│   ├── App.jsx              # Root application component
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Project dependencies
├── vite.config.js           # Vite configuration
├── eslint.config.js         # ESLint configuration
└── vercel.json              # Vercel deployment configuration
```

## Application Architecture

### Data Flow
1. **User Authentication** → Firebase Auth → Server JWT Token → Authenticated API Calls
2. **Property Browsing** → API Request → TanStack Query Cache → React Components
3. **Property Submission** → Form Validation → API Post → Admin Verification Queue
4. **Payment Processing** → Stripe Checkout → Server Verification → Database Update

### State Management
- **Server State**: TanStack Query for API data (properties, users, offers, etc.)
- **Auth State**: React Context for user authentication status
- **Local State**: React hooks (useState, useReducer) for component state
- **Form State**: React Hook Form for form management

### Routing Strategy
- **Public Routes**: Home, Login, Register, Property Listings
- **Protected Routes**: Dashboard, Wishlist, Make Offer, Add Review
- **Role-Based Routes**: Admin panel, Agent management, User profile

## Live Deployment

### Frontend
- **URL**: https://b11a12elite.netlify.app
- **Hosting**: Netlify
- **Deployment**: Automatic from main branch

### Backend API
- **URL**: https://b11-assignment-12-category-008-serv.vercel.app
- **Hosting**: Vercel
- **Database**: MongoDB Atlas

### Demo Credentials
- **Admin**: admin@site.com / admin@site.com
- **Agent**: agent@site.com / agent@site.com

## Development Workflow

### Prerequisites
- Node.js v16 or higher
- npm or yarn package manager
- Firebase project credentials
- Backend API running or accessible

### Setup & Installation
```bash
# Install dependencies
npm install

# Set up environment variables
# Create .env file with:
# VITE_API_BASE_URL=<backend-api-url>
# VITE_FIREBASE_API_KEY=<firebase-key>
# VITE_FIREBASE_AUTH_DOMAIN=<firebase-domain>
# VITE_FIREBASE_PROJECT_ID=<firebase-project-id>
# VITE_FIREBASE_STORAGE_BUCKET=<firebase-bucket>
# VITE_FIREBASE_MESSAGING_SENDER_ID=<firebase-sender-id>
# VITE_FIREBASE_APP_ID=<firebase-app-id>

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Development Server
- Runs on `http://localhost:5173` by default
- Hot module replacement (HMR) enabled
- Fast refresh for React components

## Key Workflows

### 1. User Registration & Authentication
- User registers with email/password or Google OAuth
- Firebase creates user account
- Backend receives user data and creates database record
- JWT token issued for subsequent API calls

### 2. Property Listing Flow
- Agent submits property with details and images
- Images uploaded to Cloudinary
- Property marked as "pending" status
- Admin reviews and verifies property
- Verified properties appear in public listings

### 3. Property Purchase Flow
- User browses verified properties
- User adds property to wishlist or makes offer
- Offer negotiation between user and agent
- Payment via Stripe integration
- Property marked as "sold"
- Transaction recorded in database

### 4. Review & Rating System
- Users can review properties they've purchased
- 5-star rating system with written comments
- Admins can moderate inappropriate reviews
- Average ratings displayed on property cards

## Security Features

- **Firebase Authentication** - Industry-standard authentication
- **JWT Token Validation** - Server-side token verification
- **HTTPS Only** - Secure communication
- **Role-Based Access** - Granular permission control
- **Input Validation** - Client and server-side validation
- **CORS Configuration** - Controlled cross-origin requests
- **Fraud Detection** - Admin can mark fraudulent accounts

## Performance Optimizations

- **Code Splitting** - Lazy loading with React Router
- **Query Caching** - TanStack Query reduces API calls
- **Image Optimization** - Cloudinary CDN delivery
- **Production Build** - Vite optimized bundling
- **Keep-Alive Service** - Prevents backend cold starts

## Testing Strategy

- **Manual Testing** - All features tested in development
- **API Testing Tool** - Built-in `/api-test` route for debugging
- **Production Testing** - Live demo site for validation

## Future Enhancements

- Advanced search filters (bedrooms, bathrooms, etc.)
- Property comparison tool
- Saved searches and email alerts
- Agent performance analytics
- Mobile application
- Virtual property tours
- Chat/messaging system
- Property valuation estimator

## Contributing

This project follows standard Git workflow:
1. Fork the repository
2. Create a feature branch
3. Make changes and test thoroughly
4. Submit pull request for review

## License

This project is part of a portfolio/assignment project (B11_Assignment_12_category_008).

## Support

For issues or questions:
- Check the README.md for setup instructions
- Review API documentation
- Contact the development team

---

**Built with ❤️ using modern web technologies**
