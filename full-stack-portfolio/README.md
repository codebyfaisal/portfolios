# Full-Stack Portfolio & Admin Dashboard System

A production-grade, highly secure, and dynamic full-stack Portfolio Web Application and Admin Management Dashboard built with **React**, **Vite**, **TailwindCSS**, **Node.js**, **Express**, **MongoDB**, and **Cloudinary**.

---

## Overview

This repository is a complete solution for personal branding, professional showcase, blogging, service offerings, job recruitment, custom forms collection, and real-time security tracking.

The project is structured into three main packages:

1. **`server`**: Node.js & Express RESTful API with MongoDB, JWT Authentication, Multi-Device Session Tracking, GeoIP Location Resolution, and Cloudinary Media Management.
2. **`admin`**: React & Vite Admin Dashboard for content management, applicant review, security monitoring, visitor analytics, and configuration.
3. **`client`**: React & Vite modern public-facing portfolio website optimized for performance, SEO, dark/light aesthetics, and dynamic content rendering.

---

## Technology Stack

### Backend (`server`)
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) with HTTP-Only Cookies & Multi-Device Session Revocation
- **Media Storage**: Cloudinary SDK (Image & PDF uploads with strict MIME/extension validation)
- **Security & Utilities**: `bcryptjs`, `express-rate-limit`, `helmet`, `cors`, `cookie-parser`, `geoip-lite`

### Frontend Admin & Client (`admin` & `client`)
- **Core Library**: React 18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, CSS Modules, Lucide / React Icons
- **State Management**: Zustand
- **HTTP Client**: Axios (with custom request/response interceptors for silent token refresh)
- **Notifications**: React Hot Toast
- **Rich Text Editing**: React Quill / Custom Markdown components

---

## Key Features

### Enterprise Security & Multi-Device Session Management
- **Environment Password Auth**: Secure admin login validated via environment variables.
- **Dedicated `LoginLog` Collection**: Independent session tracking per device/browser.
- **Multi-Device Concurrent Sessions**: Supports concurrent logins from normal, incognito, and mobile devices without token overwrite.
- **GeoIP & Device Detection**: Automatic IP resolution to city, region, and country via `geoip-lite` / Vercel headers.
- **Remote Session Revocation**: Ability to log out specific remote devices or revoke all other active sessions with 1-click.
- **30-Day Audit Logging**: Retains a 30-day chronological log of all login activities and device details.
- **Upload Security**: Double-layer Multer file validation (file extension + MIME type validation for `image/jpeg`, `image/png`, `image/webp`, `application/pdf`).
- **Rate Limiting & CORS Control**: Global and strict rate limiters with environment-configured origin whitelists.

### Portfolio & Content Management
- **Projects Showcase**: Categories, tech stacks, live links, GitHub links, and media galleries.
- **Blogs System**: Rich-text article creation, tags, read time estimates, and public shareable URLs.
- **Services & Pricing Plans**: Customizable service offerings, feature lists, and tiered pricing packages.
- **Testimonials**: Manage client feedback, ratings, and avatars.

### Job Board & Recruitment Portal
- **Job Listings**: Post openings with descriptions, requirements, salary ranges, location type (Remote/Hybrid/On-site), and status toggles.
- **Applicant Tracking System (ATS)**: Review applications, update status flow (`Pending` ➔ `Reviewed` ➔ `Shortlisted` ➔ `Rejected`), download PDF resumes, and email candidates.

### Custom Forms Manager
- **Form Builder**: Create custom forms with title, description, and custom fields.
- **Public Shareable Links**: Generate direct public URLs for form submissions.
- **Response Management**: View and export form submissions from the dashboard.

### Analytics & Visitors Tracking
- **Visitor Logs**: Track unique visits, device types, browsers, operating systems, referrers, and locations.
- **Dashboard Overview**: Metrics overview for active sessions, message volume, recent applications, and content counts.

### System Configuration & SEO
- **Global SEO**: Metadata title, description, and canonical URL management.
- **Maintenance Mode**: Toggle public site maintenance mode with custom display messages.
- **Global Resume Link**: One-click update for portfolio resume links.

---

## Repository Directory Structure

```
portfolio-react/
├── server/                    # Node.js Express Backend API
│   ├── src/
│   │   ├── constants.js       # Startup environment validation & constants
│   │   ├── app.js             # Express app setup, rate limiters, routes
│   │   ├── index.js           # Server bootstrapper & MongoDB connection
│   │   ├── middlewares/       # Auth JWT verification, Multer upload filters, Error handlers
│   │   ├── modules/           # Feature modules (auth, user, projects, blogs, jobs, forms, etc.)
│   │   │   └── auth/          # LoginLog schema, AuthService, AuthController, AuthRoutes
│   │   └── utils/             # ApiError, ApiResponse, GeoIP lookup, Cloudinary helper
│   └── package.json
├── admin/                     # React Vite Admin Dashboard
│   ├── src/
│   │   ├── api/               # Axios instance & request interceptors
│   │   ├── components/        # Layout, Sidebar, Navbar, PageHeader, Modals
│   │   ├── features/          # Feature UI components (security, user, blogs, jobs, etc.)
│   │   ├── store/             # Zustand global state store
│   │   └── App.jsx            # Router setup & Auth guards
│   └── package.json
├── client/                    # React Vite Public Portfolio
│   ├── src/                   # Components, Pages, Sections, API integration
│   └── package.json
├── CLIENT_MANUAL.md           # Comprehensive End-User & Client Operating Manual
└── README.md                  # Project Developer Documentation
```

---

## Quick Start Guide

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **MongoDB**: Local MongoDB instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- **Cloudinary Account**: Cloud Name, API Key, and API Secret

### 1. Environment Setup

Create `.env` files in each sub-directory based on the templates below:

#### `server/.env`
```ini
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/portfolio

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
CLIENT_ALLOWED_ORIGINS=http://localhost:5174
ADMIN_ALLOWED_ORIGINS=http://localhost:5173

ACCESS_TOKEN_SECRET=your_jwt_access_secret_key_here
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_jwt_refresh_secret_key_here
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_FOLDER=portfolio

ADMIN_PASSWORD=your_secure_admin_password
```

#### `admin/.env`
```ini
VITE_BASE_API_URL=http://localhost:4000/api/v1
VITE_CLIENT_URL=http://localhost:5174
VITE_ENVIRONMENT_MODE=DEV
```

#### `client/.env`
```ini
VITE_BASE_API_URL=http://localhost:4000/api/v1
VITE_ENVIRONMENT_MODE=DEV
```

---

### 2. Installation & Running Locally

Open three terminal tabs to run all packages concurrently:

```bash
# Terminal 1: Backend Server
cd server
npm install
npm run dev

# Terminal 2: Admin Dashboard
cd admin
npm install
npm run dev

# Terminal 3: Public Client Portfolio
cd client
npm install
npm run dev
```

Default Local URLs:
- **Server API**: `http://localhost:4000/api/v1`
- **Admin Dashboard**: `http://localhost:5173`
- **Public Portfolio**: `http://localhost:5174`

---

## API Endpoints Reference Overview

| Module | Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/v1/auth/login` | Public | Authenticate admin with password |
| **Auth** | `POST` | `/api/v1/auth/logout` | Private | Revoke current device session & clear cookies |
| **Auth** | `GET` | `/api/v1/auth/login-history` | Private | Fetch 30-day audit log & active device list |
| **Auth** | `POST` | `/api/v1/auth/sessions/revoke/:sessionId` | Private | Revoke specific remote session |
| **Auth** | `POST` | `/api/v1/auth/sessions/revoke-others` | Private | Revoke all other active device sessions |
| **Auth** | `POST` | `/api/v1/auth/refresh` | Public/Cookie | Silent refresh access token using refresh token |
| **User** | `GET` | `/api/v1/users/me` | Public | Get public portfolio user profile details |
| **User** | `PUT` | `/api/v1/users/me` | Private | Update admin profile details, skills, & stats |
| **Projects**| `GET` | `/api/v1/projects` | Public | Fetch all portfolio projects |
| **Blogs** | `GET` | `/api/v1/posts` | Public | Fetch all published blog articles |
| **Jobs** | `GET` | `/api/v1/jobs` | Public | Fetch active job postings |
| **Jobs** | `POST` | `/api/v1/jobs/:id/apply` | Public | Submit job application with resume file upload |
| **Forms** | `POST` | `/api/v1/forms/:id/submit` | Public | Submit custom form response |
| **Messages**| `POST` | `/api/v1/messages` | Public | Send direct contact message |

---

## Deployment Guide

### Backend (`server`) Deployment (Render / Railway / VPS / Vercel Serverless)
1. Set all environment variables defined in `server/.env`.
2. Ensure MongoDB connection string allows remote connections from your host IP.
3. Configured CORS allowed origins (`CORS_ALLOWED_ORIGINS`, `CLIENT_ALLOWED_ORIGINS`, `ADMIN_ALLOWED_ORIGINS`).

### Admin & Client Deployment (Vercel / Netlify)
1. Connect GitHub repository to Vercel/Netlify.
2. For **Admin**: Set root directory to `admin`, build command `npm run build`, output directory `dist`. Set `VITE_BASE_API_URL`.
3. For **Client**: Set root directory to `client`, build command `npm run build`, output directory `dist`. Set `VITE_BASE_API_URL`.

---

## License & Author

Designed & Developed by **Muhammad Faisal** ([codebyfaisal](https://github.com/codebyfaisal)).
Licensed under the **MIT License**.
