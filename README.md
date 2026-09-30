# Muhammad Ahmed — Full Stack Developer Portfolio & Admin Dashboard

A modern, high-performance, animated Full Stack Portfolio and Content Management System built for **Muhammad Ahmed**, presenting production-grade engineering in the MERN stack.

---

## 🗂️ Project Structure

```text
My Portfolio/
├── frontend/                     # React + TypeScript + Vite + Tailwind CSS
│   ├── public/                   # Static assets & default documents
│   ├── src/
│   │   ├── components/           # Public & Admin UI components
│   │   │   ├── admin/            # Dashboard, projects, messages, settings UI
│   │   │   ├── common/           # Shared UI widgets (badges, modals, toasts)
│   │   │   ├── home/             # Hero, About, Skills, Backend, Experience, Contact
│   │   │   ├── layout/           # Navbar, Footer
│   │   │   └── projects/         # Project cards, detail modals, filters
│   │   ├── context/              # Dynamic portfolio settings provider
│   │   ├── data/                 # Baseline fallback configs
│   │   ├── hooks/                # Custom React hooks (motion, scroll, active section)
│   │   ├── pages/
│   │   │   ├── admin/            # Admin dashboard, project CRUD, messages, settings
│   │   │   └── public/           # Landing page
│   │   ├── services/             # Axios API client & backend service modules
│   │   ├── types/                # TypeScript interface declarations
│   │   └── utils/                # Animations, formatting helpers
│   ├── .env.example              # Frontend environment template
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/                      # Node.js + Express + TypeScript + MongoDB + JWT
│   ├── src/
│   │   ├── config/               # Database, Cloudinary, and ENV configuration
│   │   ├── controllers/          # Request handlers for auth, projects, messages, settings
│   │   ├── middleware/           # Auth guard, upload filters, validation, error handler
│   │   ├── models/               # Mongoose schemas (Admin, Project, Message, Settings, Activity)
│   │   ├── routes/               # Express REST API routes
│   │   ├── scripts/              # Database seeding scripts (admin, initial projects)
│   │   ├── services/             # Cloudinary upload, Nodemailer, activity logging
│   │   ├── utils/                # Custom ApiError, asyncHandler, JWT helper
│   │   ├── app.ts                # Express application setup, CORS, Helmet, rate-limiting
│   │   └── server.ts             # Server entry point & auto-initialization
│   ├── uploads/                  # Local media storage fallback
│   ├── .env.example              # Backend environment template
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
├── package.json                  # Root monorepo script runner (concurrently)
└── README.md
```

---

## 🚀 Quick Start & Development Workflow

### 1. Root Installation

Install dependencies across both root, frontend, and backend with one command:

```bash
npm run install:all
```

Or individually:

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Configure Environment Variables

#### Backend (`backend/.env`)

Copy `backend/.env.example` to `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/portfolio

JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:5173

# Cloudinary (Optional for local dev, uses local uploads fallback if omitted)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# SMTP Email Notifications (Optional for local dev)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
FROM_EMAIL=info.ahmadkhan.com@gmail.com

# Initial Admin Credentials (used during seeding)
ADMIN_EMAIL=info.ahmadkhan.com@gmail.com
ADMIN_PASSWORD=YourSecurePassword123!
ADMIN_NAME=Muhammad Ahmed
```

#### Frontend (`frontend/.env`)

Copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🔐 Database Seeding & Admin Initialization

To seed the initial admin account and default projects (`Digital Medical`, `AKR Restaurant`, `Laptop Shop`) into MongoDB:

```bash
# From root directory:
npm run seed

# Or run separately:
npm run seed:admin
npm run seed:projects
```

> **Security Note:** Passwords are never stored in plain text. They are hashed using bcrypt with salt factor 10. Passwords and credentials are never exposed in UI or console outputs.

---

## 💻 Running Locally

### Run Both Frontend & Backend Concurrently

From the root project folder:

```bash
npm run dev
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000/api](http://localhost:5000/api)
- **Admin Dashboard:** [http://localhost:5173/admin/login](http://localhost:5173/admin/login)

### Run Services Individually

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

---

## 📦 Production Builds

```bash
# Build both frontend and backend
npm run build

# Start production backend server
cd backend
npm start
```

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| **POST** | `/api/auth/login` | Public (Rate Limited) | Authenticate admin, returns token & HTTP-only cookie |
| **GET** | `/api/auth/me` | Admin Protected | Get current authenticated admin session |
| **POST** | `/api/auth/logout` | Admin Protected | Clear authentication session & cookie |
| **PATCH** | `/api/auth/change-password` | Admin Protected | Verify current and update to new bcrypt password |
| **GET** | `/api/projects` | Public | Get ordered list of projects |
| **GET** | `/api/projects/:slug` | Public | Get single project by slug |
| **POST** | `/api/projects` | Admin Protected | Create new project |
| **PUT** | `/api/projects/:id` | Admin Protected | Update existing project |
| **DELETE** | `/api/projects/:id` | Admin Protected | Delete project and remove Cloudinary asset |
| **PATCH** | `/api/projects/reorder` | Admin Protected | Bulk reorder project display sequence |
| **POST** | `/api/messages` | Public (Rate Limited) | Send contact inquiry + triggers admin email alert |
| **GET** | `/api/messages` | Admin Protected | List all contact messages |
| **PATCH** | `/api/messages/:id/read` | Admin Protected | Mark message as read/unread |
| **DELETE** | `/api/messages/:id` | Admin Protected | Remove message |
| **GET** | `/api/settings` | Public | Retrieve public portfolio text & active resume URL |
| **PUT** | `/api/settings` | Admin Protected | Update hero, about, and contact details |
| **POST** | `/api/admin/resume` | Admin Protected | Upload replacement PDF resume (Cloudinary raw/storage) |
| **POST** | `/api/uploads/project-image`| Admin Protected | Upload project screenshot (Cloudinary/storage) |
| **GET** | `/api/admin/dashboard` | Admin Protected | Fetch aggregated dashboard metrics & stats |
| **GET** | `/api/admin/activity` | Admin Protected | Fetch audit activity logs (recent actions) |
