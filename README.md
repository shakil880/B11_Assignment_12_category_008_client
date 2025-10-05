# Elite Properties - Real Estate Platform

A comprehensive real estate platform built with the MERN stack, enabling users to buy, sell, and manage properties with role-based access control.

## 🚀 Live Demo

- **Live Site**: [Your deployed URL here]
- **Admin Username**: admin@eliteproperties.com
- **Admin Password**: Admin123!@#

## ✨ Key Features

• **Multi-role Authentication System** - Secure user management with User, Agent, and Admin roles
• **Advanced Property Management** - Complete CRUD operations with image upload and verification system
• **Smart Wishlist & Offers** - Users can save properties and make offers with price validation
• **Integrated Review System** - Property reviews with rating system and moderation controls
• **Real-time Notifications** - Toast notifications for all user actions and updates
• **Responsive Dashboard** - Role-specific dashboards with comprehensive management tools
• **Secure Payment Integration** - Stripe integration for property transactions
• **Advanced Search & Filtering** - Search by location, price range, and property features
• **Agent Verification System** - Admin-controlled agent verification and fraud detection
• **Property Advertisement** - Admin-managed featured property promotion system

## 🛠️ Technologies Used

### Frontend
- **React 19** - Latest React version with modern hooks
- **React Router DOM** - Client-side routing
- **TanStack Query** - Data fetching and state management
- **React Hook Form** - Form validation and management
- **Firebase Authentication** - Secure user authentication
- **Swiper.js** - Modern slider components
- **React Hot Toast** - Beautiful notifications
- **Vanilla CSS** - Custom styling with CSS variables

### Backend
- **Node.js & Express.js** - Server-side runtime and framework
- **MongoDB & Mongoose** - Database and ODM
- **Firebase Admin SDK** - Authentication verification
- **JWT** - Token-based authentication
- **Multer & Cloudinary** - File upload and storage
- **Stripe** - Payment processing

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB database
- Firebase project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd B11_Assignment_12_category_008
   ```

2. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Environment Setup**
   
   Create `.env` in the client directory:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

5. **Start the development servers**
   
   Client (in client directory):
   ```bash
   npm run dev
   ```
   
   Server (in server directory):
   ```bash
   npm run dev
   ```

## 🎯 User Roles & Permissions

### 👤 User
- Browse and search properties
- Add properties to wishlist
- Make offers on properties
- Write and manage reviews
- Track property purchases

### 🏢 Agent
- Add and manage property listings
- Update property information
- View and respond to offers
- Track sold properties
- Manage requested properties

### 👑 Admin
- Verify/reject property listings
- Manage user roles and permissions
- Control property advertisements
- Moderate reviews and content
- Mark agents as fraudulent
- Comprehensive user management+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
