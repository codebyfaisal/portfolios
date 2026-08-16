# 📘 Portfolio System & Admin Dashboard — Client & Operating Manual

Welcome to your complete **Portfolio System & Admin Management Dashboard**. This manual provides a step-by-step guide to installing, configuring, operating, and managing your portfolio website, blog, service catalog, job recruitment board, custom forms builder, and multi-device security monitoring system.

---

## 📑 Table of Contents
1. [System Architecture Overview](#1-system-architecture-overview)
2. [Installation & Local Setup](#2-installation--local-setup)
3. [Environment Configuration Reference](#3-environment-configuration-reference)
4. [Admin Dashboard Guide](#4-admin-dashboard-guide)
   - [Authentication & First Login](#authentication--first-login)
   - [Security & Active Sessions Page](#security--active-sessions-page)
   - [Overview & Quick Metrics](#overview--quick-metrics)
   - [Projects Management](#projects-management)
   - [Services & Pricing Plans](#services--pricing-plans)
   - [Blog Articles & Rich Text Editor](#blog-articles--rich-text-editor)
   - [Job Board & Applicant Tracking System (ATS)](#job-board--applicant-tracking-system-ats)
   - [Custom Forms Builder](#custom-forms-builder)
   - [File Manager & Cloud Storage](#file-manager--cloud-storage)
   - [Messages & Subscribers](#messages--subscribers)
   - [Visitor Analytics](#visitor-analytics)
   - [Profile & Global Configuration](#profile--global-configuration)
5. [Troubleshooting & FAQ](#5-troubleshooting--faq)
6. [Security Best Practices](#6-security-best-practices)

---

## 1. System Architecture Overview

Your portfolio system is comprised of **three interconnected modules**:

```
+-----------------------------------------------------------------------------------+
|                                  DATABASE & CLOUD                                 |
|                 MongoDB (Data)  <--->  Cloudinary (Media Hosting)                  |
+-----------------------------------------------------------------------------------+
                                         ^
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                                  SERVER (BACKEND)                                 |
|      Express RESTful API  |  JWT Auth  |  Multi-Device Session Engine |  GeoIP      |
+-----------------------------------------------------------------------------------+
                        ^                                   ^
                        |                                   |
                        v                                   v
+-----------------------------------+               +-------------------------------+
|          ADMIN DASHBOARD          |               |       PUBLIC PORTFOLIO        |
|  React Admin Panel (Port: 5173)   |               |   React Website (Port: 5174)  |
+-----------------------------------+               +-------------------------------+
```

1. **Server (Backend API)**: Manages database transactions, user authentication, file uploads, security validation, and API routes.
2. **Admin (Management Dashboard)**: Private control panel where you update content, manage jobs, review applicants, monitor active device sessions, and view analytics.
3. **Client (Public Portfolio Website)**: Responsive public site that showcases your bio, skills, services, projects, blog posts, pricing plans, contact form, and active job listings.

---

## 2. Installation & Local Setup

### Prerequisites
Make sure the following software is installed on your computer:
- **Node.js** (v18.0.0 or higher): [https://nodejs.org/](https://nodejs.org/)
- **MongoDB**: Local MongoDB installation or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) database.
- **Cloudinary Account**: Free account for hosting images and PDF resumes: [https://cloudinary.com/](https://cloudinary.com/)

---

### Step 1: Install Dependencies
Open your command terminal (PowerShell, Command Prompt, or Terminal) in the project folder and run:

```bash
# 1. Install Backend Dependencies
cd server
npm install

# 2. Install Admin Dashboard Dependencies
cd ../admin
npm install

# 3. Install Public Website Dependencies
cd ../client
npm install
```

---

### Step 2: Configure Environment Files (`.env`)

You must create a `.env` file in each directory (`server/.env`, `admin/.env`, `client/.env`).

#### A. Backend Configuration (`server/.env`)
Create `server/.env`:
```ini
# Server Port & Mode
PORT=4000
NODE_ENV=development

# Database Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/portfolio

# Allowed Origins (CORS Security)
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
CLIENT_ALLOWED_ORIGINS=http://localhost:5174
ADMIN_ALLOWED_ORIGINS=http://localhost:5173

# JWT Security Secrets (Use strong random strings)
ACCESS_TOKEN_SECRET=your_super_secret_access_key
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_super_secret_refresh_key
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary Integration (Media Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=portfolio

# Environment Master Admin Password
ADMIN_PASSWORD=your_secure_admin_password
```

#### B. Admin Dashboard Configuration (`admin/.env`)
Create `admin/.env`:
```ini
VITE_BASE_API_URL=http://localhost:4000/api/v1
VITE_CLIENT_URL=http://localhost:5173
VITE_ENVIRONMENT_MODE=DEV
```

#### C. Public Client Website Configuration (`client/.env`)
Create `client/.env`:
```ini
VITE_BASE_API_URL=http://localhost:4000/api/v1
VITE_ENVIRONMENT_MODE=DEV
```

---

### Step 3: Start the Application

Start all three services simultaneously by opening 3 separate terminal tabs:

```bash
# Terminal 1: Start Backend Server
cd server
npm run dev

# Terminal 2: Start Admin Dashboard
cd admin
npm run dev

# Terminal 3: Start Public Client Site
cd client
npm run dev
```

#### Default URLs:
- **Admin Dashboard**: [http://localhost:5173](http://localhost:5173)
- **Public Portfolio**: [http://localhost:5174](http://localhost:5174)
- **Backend API**: `http://localhost:4000/api/v1`

---

## 3. Environment Configuration Reference

| Environment Variable | Package | Required | Purpose |
| :--- | :--- | :--- | :--- |
| `MONGODB_URI` | `server` | **Yes** | Connection string for MongoDB database |
| `ACCESS_TOKEN_SECRET` | `server` | **Yes** | Secret key for signing JWT access tokens |
| `REFRESH_TOKEN_SECRET` | `server` | **Yes** | Secret key for signing JWT refresh tokens |
| `ADMIN_PASSWORD` | `server` | **Yes** | Fixed password used to authenticate Admin login |
| `CLOUDINARY_CLOUD_NAME` | `server` | **Yes** | Cloudinary account cloud name for media hosting |
| `CLOUDINARY_API_KEY` | `server` | **Yes** | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | `server` | **Yes** | Cloudinary API Secret |
| `VITE_BASE_API_URL` | `admin`/`client` | **Yes** | Endpoint URL pointing to the Backend API |

> [!IMPORTANT]
> The server has built-in **startup validation**. If `MONGODB_URI`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, or `ADMIN_PASSWORD` are missing, the backend server will intentionally halt and print a descriptive configuration error.

---

## 4. Admin Dashboard Guide

### Authentication & First Login
1. Navigate to your Admin URL (e.g. `http://localhost:5173/login`).
2. Enter the **`ADMIN_PASSWORD`** defined in your `server/.env` file.
3. Upon authentication, an HTTP-Only secure cookie is set in your browser, establishing an active session.

---

### Security & Active Sessions Page (`/security`)
The Security Page provides complete transparency into active sessions, remote device access, and 30-day security history.

- **Active Devices List**: Shows all currently logged-in devices and browser windows (including Normal vs Incognito windows).
- **Session Badges**:
  - `This Device (Current Session)`: Marks the browser window you are currently using.
  - `Active Session`: Marks other active devices/browsers logged into your account.
- **Session Details**: Displays IP address, GeoIP location (City, Region, Country), browser user-agent, and login timestamp.
- **Remote Logout**: Click **"Logout Device"** next to any remote device to invalidate its session tokens remotely.
- **Revoke All Other Devices**: Click **"Revoke All Other Devices"** at the top right to log out all other devices simultaneously.
- **30-Day Audit Log**: View a full chronological log of all login activities over the last 30 days.

---

### Overview & Quick Metrics (`/`)
- View total site visitors, active device count, unread messages, recent applications, and content item counts.

---

### Projects Management (`/projects`)
- Add, edit, or delete portfolio projects.
- Attach project thumbnails, live demo URLs, GitHub repository links, tags, and category filters.

---

### Services & Pricing Plans (`/services`, `/plans`)
- **Services**: Define offerings (e.g., *Full-Stack Development*, *UI/UX Design*) with icons and descriptions.
- **Plans**: Create tiered pricing packages with highlighted feature lists.

---

### Blog Articles & Rich Text Editor (`/blogs`)
- Write articles using a Markdown / Rich-Text editor.
- Set feature images, read times, and tags.
- Use the **Copy Link** button to copy direct article links or **View Live** to preview on the public site.

---

### Job Board & Applicant Tracking System (ATS) (`/jobs`, `/applications`)
- **Posting Jobs (`/jobs`)**: Create job openings specifying Job Title, Location (Remote/Hybrid/On-site), Job Type (Full-time/Part-time/Contract), Salary Range, Description, and Requirements.
- **Managing Applicants (`/applications`)**:
  - View candidates who applied via the portfolio site.
  - Filter applicants by job posting or status (`Pending`, `Reviewed`, `Shortlisted`, `Rejected`).
  - View applicant email, phone, covering notes, and download submitted PDF resumes.

---

### Custom Forms Builder (`/forms`)
- Create standalone custom forms (e.g., *Client Brief*, *Project Inquiry*).
- Define custom form fields.
- Copy the **Shareable Form Link** to send directly to clients.
- View and export submitted form responses in real-time.

---

### File Manager & Cloud Storage (`/files`)
- Upload images (`JPEG`, `PNG`, `WEBP`) and PDF files directly to Cloudinary.
- **Double Security Validation**: Blocked malicious extension types and enforced MIME-type checks (`image/*`, `application/pdf`).
- Copy direct Cloudinary CDN URLs for use in blogs, portfolio items, or external messages.

---

### Messages & Subscribers (`/messages`, `/subscribers`)
- **Messages**: Review direct inquiries sent through the portfolio's contact form.
- **Subscribers**: View and manage email newsletter subscribers.

---

### Visitor Analytics (`/visitors`)
- Monitor visitors, device types (Desktop/Mobile/Tablet), browsers, operating systems, and location analytics.

---

### Profile & Global Configuration (`/user`, `/configuration`)
- **Profile (`/user`)**: Update personal bio, contact info, social media handles, skills, and work experience.
- **Configuration (`/configuration`)**:
  - Update global SEO Metadata Title & Description.
  - Update global Resume / CV download URL.
  - Toggle **Maintenance Mode** (hides the public client site with a friendly maintenance screen when enabled).

---

## 5. Troubleshooting & FAQ

#### Q1: Server refuses to start with `[SERVER CONFIG ERROR]`.
**Cause**: One of the mandatory environment variables (`MONGODB_URI`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, or `ADMIN_PASSWORD`) is missing in `server/.env`.
**Fix**: Open `server/.env` and ensure all required keys are defined.

#### Q2: Logging in on a second device logs out the first device.
**Cause**: Outdated single-token logic.
**Fix**: The current system uses a dedicated `LoginLog` database collection with unique `sessionId` tracking. Ensure the server has been restarted with the latest code.

#### Q3: File uploads fail with "Invalid file type".
**Cause**: The uploaded file extension or MIME type is not permitted.
**Fix**: Ensure uploaded files are valid images (`.jpg`, `.jpeg`, `.png`, `.webp`) or documents (`.pdf`). Malicious binaries (`.exe`, `.sh`, `.bat`) are strictly blocked.

#### Q4: Client website shows "Maintenance Mode".
**Cause**: Maintenance Mode is enabled in the Admin Configuration.
**Fix**: Log into Admin Dashboard, navigate to **Configuration**, and turn off Maintenance Mode.

---

## 6. Security Best Practices

1. **Keep Secrets Private**: Never commit `.env` files containing `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, or `ADMIN_PASSWORD` to public Git repositories.
2. **Use Strong Passwords**: Set `ADMIN_PASSWORD` in `server/.env` to a long, complex string.
3. **Monitor Active Sessions**: Regularly review the `/security` page in your Admin Dashboard to verify that only authorized devices are connected. If an unrecognized device appears, click **"Logout Device"** immediately.
