## MediQueue - Healthcare Queue Management

This repository contains a full-stack healthcare queue management system with a Node.js/Express backend and a React frontend. The backend uses Sequelize (MySQL) for managing clinics, customers, queues and tickets, and includes authentication with a complete password reset flow using Nodemailer and Gmail.

### Prerequisites

Before you begin, ensure you have the following installed and running:

- **Node.js 18+** (required for both frontend and backend)
- **MySQL 8+** (or compatible database) - **MySQL server must be running before starting the backend**
- **A Gmail account and app password** (for sending password reset emails)
- **Git** (to clone the repository)

**Important:** Make sure your MySQL server is running before attempting to start the backend application. The backend will fail to connect if MySQL is not running.

### Project Structure

```
healthcare-queue/
  ├── backend/              # Node.js/Express API server
  │   ├── server.js         # Entry point
  │   ├── package.json
  │   ├── .env              # Environment variables (create this)
  │   ├── scripts/
  │   │   └── seed.js       # Database seeding script
  │   └── src/
  │       ├── controllers/  # Request handlers
  │       ├── middlewares/  # Auth middleware, etc.
  │       ├── models/       # Sequelize models
  │       ├── routes/       # API routes
  │       └── utils/       # Utilities (email, etc.)
  │
  └── frontend/            # React + Vite application
      ├── package.json
      ├── .env              # Optional: frontend env vars
      ├── vite.config.js
      └── src/
          ├── components/   # React components
          ├── pages/        # Page components
          ├── services/     # API service layer
          ├── context/      # React context (AuthContext)
          └── routes/       # Routing configuration
```

---

## Setup Instructions

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd healthcare-queue
```

### Step 2: Backend Setup

#### 2.1 Install Backend Dependencies

```bash
cd backend
npm install
```

#### 2.2 Configure Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Server
PORT=3000

# Database
DB_HOST=localhost
DB_NAME=healthcare_queue
DB_USER=root
DB_PASS=your_mysql_password

# JWT
JWT_SECRET=super_secret_jwt_key_change_me

# Email (Gmail)
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password

# Frontend URL (for password reset links)
APP_URL=http://localhost:5173
```

**Important Notes:**
- Replace `your_mysql_password` with your actual MySQL root password
- Replace `your@gmail.com` with your Gmail address
- For `GMAIL_APP_PASSWORD`: You must use a Gmail App Password (not your regular password). Generate one at: https://myaccount.google.com/apppasswords
- `JWT_SECRET` should be a strong, random string in production
- `APP_URL` is used to build password reset email links

#### 2.3 Start MySQL Server

**Before proceeding, ensure MySQL is running on your system.**

- **Windows**: Start MySQL from Services or use `net start MySQL`
- **macOS**: Use `brew services start mysql` or start from System Preferences
- **Linux**: Use `sudo systemctl start mysql` or `sudo service mysql start`

#### 2.4 Create MySQL Database

1. Connect to MySQL (using MySQL Workbench, command line, or any MySQL client)
2. Create the database:

```sql
CREATE DATABASE healthcare_queue CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**Note:** If you're using the command line, you can connect with:
```bash
mysql -u root -p
```
Then enter your MySQL root password when prompted.

#### 2.5 Initialize Database Schema

The database tables will be created automatically when you start the backend server for the first time (Sequelize `sync()` runs on startup).

**Important:** Make sure MySQL is running and the database exists before starting the backend, otherwise the connection will fail.

#### 2.6 (Optional) Seed Demo Data

After starting the backend at least once, you can seed the database with demo data:

```bash
cd backend
npm run build:DB
```

This will:
- Reset and recreate the database schema
- Create a system admin:
  - **Email**: `admin@mediqueue.com`
  - **Password**: `admin`
- Create sample clinics, doctors, patients, queues and tickets
- Non-admin demo users use the password `Password123!` with randomly generated emails/phone numbers

### Step 3: Frontend Setup

#### 3.1 Install Frontend Dependencies

```bash
cd frontend
npm install
```

#### 3.2 (Optional) Configure Frontend Environment Variables

The frontend will work with default settings, but you can create a `.env` file in the `frontend/` directory to customize the API URL:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

**Note:** If `VITE_API_BASE_URL` is not set, it defaults to `http://localhost:3000/api` (see `frontend/src/services/api.js`). Only create this file if you need to point to a different backend URL.

---

## Running the Application

### Running the Backend

**Before starting the backend, ensure:**
1. MySQL server is running
2. The `healthcare_queue` database exists
3. Your `.env` file is configured correctly

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. The backend API will be available at:
   - **API Base URL**: `http://localhost:3000`
   - **Swagger Documentation**: `http://localhost:3000/api-docs`
   - **Health Check**: `http://localhost:3000/`

**Note:** If you see database connection errors, verify MySQL is running and your database credentials in `.env` are correct.

### Running the Frontend

1. Open a **new terminal window/tab** (keep the backend running)

2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. The frontend will be available at:
   - **Frontend URL**: `http://localhost:5173` (Vite default port)

### Accessing the Application

1. Open your browser and navigate to `http://localhost:5173`
2. Make sure the backend is running before attempting to login or register
3. Use the seeded admin credentials to login:
   - **Email**: `admin@mediqueue.com`
   - **Password**: `admin`

---

## API Documentation

### Swagger UI

Once the backend is running, you can access the interactive API documentation at:
- **Swagger UI**: `http://localhost:3000/api-docs`

This provides complete documentation of all endpoints, request/response schemas, and allows you to test the API directly.

### Core API Endpoints

Base URL: `http://localhost:3000`

**Authentication:**
- `POST /api/auth/register` - Register a new user (requires `role` field: `patient`, `clinic`, `doctor`, or `admin`)
- `POST /api/auth/login` - Login user (works for all roles)
- `GET /api/auth/me` - Get current authenticated user (requires authentication token)
- `POST /api/auth/password/forgot` - Request password reset
- `POST /api/auth/password/reset` - Reset password with token

**Resources:**
- `/api/clinics` - Clinic management
- `/api/doctors` - Doctor management
- `/api/patients` - Patient management
- `/api/queues` - Queue management
- `/api/tickets` - Ticket management
- `/api/users` - User management (admin only)

Refer to Swagger UI for complete endpoint documentation, schemas, and examples.

---

## Password Reset Flow

1. User submits email at `POST /api/auth/password/forgot`
2. Server generates a one-hour token and emails a link: `APP_URL/reset-password?token=...`
3. Frontend captures the `token` from the URL and new password, then calls `POST /api/auth/password/reset`
4. On success, the token is marked as used and the password is updated

Email transport is configured in `backend/src/utils/email.js` using Nodemailer with Gmail credentials from `.env`.

---

## User Roles & Dashboards

The application supports four main roles:

- **Patient (`patient`)** - Default user role for people joining queues
  - Dashboard: `/patient/dashboard`
  - Pages: Browse Queue, My Queues, Profile, Help

- **Clinic (`clinic`)** - Healthcare facility managing queues and doctors
  - Dashboard: `/clinic/dashboard`
  - Pages: Queues, Doctors, Reports, Settings
  - Note: Clinics can view queues created by their doctors but cannot create queues directly

- **Doctor (`doctor`)** - Individual provider working within a clinic
  - Dashboard: `/doctor/dashboard`
  - Pages: Queue Monitor, Settings
  - Note: Doctors create and manage their own queues

- **Admin (`admin`)** - System-wide administrator
  - Dashboard: `/admin/dashboard`
  - Pages: Clinics, Manage Users, Patients

---

## Troubleshooting

### Common Issues

**Backend Issues:**

- **MySQL connection fails**: 
  - **Most common issue**: MySQL server is not running. Start MySQL before starting the backend.
  - Verify MySQL is running: Check services (Windows) or use `sudo systemctl status mysql` (Linux)
  - Check `DB_HOST`, `DB_USER`, `DB_PASS` in `backend/.env` match your MySQL configuration
  - Ensure the database `healthcare_queue` exists (create it if it doesn't)
  - Test connection: Try connecting with `mysql -u root -p` using the same credentials
- **Gmail sending blocked**: Ensure you use a Gmail App Password (not your regular password) and that the account allows SMTP access
- **JWT errors**: Verify `JWT_SECRET` is set in `backend/.env`
- **Port already in use**: Change `PORT` in `backend/.env` if port 3000 is occupied

**Frontend Issues:**

- **Cannot connect to backend**: 
  - Ensure the backend is running on `http://localhost:3000`
  - Check that `VITE_API_BASE_URL` in `frontend/.env` matches your backend URL
  - Verify CORS is enabled in the backend
- **Port already in use**: Vite will automatically try the next available port if 5173 is occupied

**General:**

- **Module not found errors**: Run `npm install` in both `backend/` and `frontend/` directories
- **Database tables not created**: Start the backend server once; Sequelize will create tables automatically

---

## Available Scripts

### Backend Scripts (`backend/package.json`)

- `npm run dev` - Start development server with nodemon (auto-reload)
- `npm run build:DB` - Seed database with demo data
- `npm run test:email` - Test email configuration

### Frontend Scripts (`frontend/package.json`)

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

---

## Production Considerations

- **Environment Variables**: Never commit `.env` files. Use environment variables or secrets management
- **Database**: Use a production-ready MySQL instance with proper backups
- **JWT Secret**: Use a strong, randomly generated `JWT_SECRET` in production
- **Email**: Configure a production email service (consider using a service like SendGrid or AWS SES instead of Gmail)
- **Process Management**: Use PM2 or similar to manage the Node.js process
- **Frontend Build**: Run `npm run build` in `frontend/` and serve the `dist/` folder with a web server
- **CORS**: Configure CORS properly for your production domain
- **APP_URL**: Set `APP_URL` in backend `.env` to your production frontend URL for password reset links

---

## Configuration Files Reference

**Backend:**
- `backend/server.js` - Express app, Swagger setup, Sequelize sync
- `backend/src/models/index.js` - Sequelize initialization and model associations
- `backend/src/controllers/auth.controller.js` - Authentication handlers
- `backend/src/routes/auth.routes.js` - Auth routes and Swagger docs
- `backend/src/utils/email.js` - Nodemailer transporter configuration

**Frontend:**
- `frontend/src/services/api.js` - Axios instance and API configuration
- `frontend/src/context/AuthContext.jsx` - Authentication context and user state
- `frontend/src/routes/RoleBasedRoutes.jsx` - Role-based routing configuration

---

### Authentication & User Roles (Frontend)

The frontend uses JWT-based authentication stored in `localStorage` and managed via `AuthContext` (`frontend/src/context/AuthContext.jsx`). On page reload, the app verifies the token with the backend (`/api/auth/me`) before restoring the session.

#### Available roles

The application supports four main roles:

- **Patient (`patient`)**
  - Default user role for people joining queues.
  - After login: redirected to `/patient/dashboard`.
  - Key pages:
    - `Dashboard` (`/patient/dashboard`)
    - `BrowseQueue` (`/patient/browse`)
    - `JoinQueue` (`/patient/join`)
    - `MyQueues` (`/patient/my-queues`)
    - `Profile` (`/patient/profile`)
    - `Help` (`/patient/help`)

- **Clinic (`clinic`)**
  - Represents a healthcare facility managing doctors and viewing queues.
  - After login: redirected to `/clinic/dashboard`.
  - Key pages:
    - `Dashboard` (`/clinic/dashboard`) - Overview of doctors, queues, and statistics
    - `Queues` (`/clinic/queues`) - View all queues created by doctors in the clinic
    - `Queue View` (`/clinic/queues/:queueId`) - View details of a specific queue
    - `Doctors` (`/clinic/doctors`) - Manage doctors (create, view)
    - `Reports` (`/clinic/reports`)
    - `Settings` (`/clinic/settings`)
  - Note: Clinics cannot create queues directly; doctors create queues

- **Doctor (`doctor`)**
  - Represents an individual provider working within a clinic.
  - Can be created by clinics or via admin tooling.
  - After login: redirected to `/doctor/dashboard`.
  - Key pages:
    - `Dashboard` (`/doctor/dashboard`) - View statistics and queue overview
    - `Queue Monitor` (`/doctor/queues`) - Create and manage queues
    - `Queue Monitor Detail` (`/doctor/queues/:queueId`) - Monitor specific queue, call next patient, pause/resume/close
    - `Settings` (`/doctor/settings`)

- **Admin (`admin`)**
  - System-wide administrator responsible for managing clinics, doctors, and patients.
  - After login: redirected to `/admin/dashboard`.
  - Key pages:
    - `Dashboard` (`/admin/dashboard`)
    - `Clinics` (`/admin/clinics`)
    - `Manage Users` (`/admin/users`)
    - `Patients` (`/admin/patients`)

#### Registration & login flows

- The frontend registration form calls `POST /api/auth/register` and expects a `role` field (`patient`, `clinic`, `doctor`, or `admin`).
  - For `doctor` role, a `clinicId` must be provided in the registration request.
  - For other roles, `clinicId` is not required.
- Login calls `POST /api/auth/login` and stores:
  - `token` – JWT used in the `Authorization` header.
  - `user` – user profile including `role` and `linked_entity_id`.
- On each reload, the app:
  - Reads the token from `localStorage`.
  - Calls `GET /api/auth/me` (via `authService.verifyUser`) to fetch fresh user data.
  - Redirects to the appropriate dashboard based on `user.role` (see `RoleBasedRoutes.jsx`).

If you add new roles or dashboards, update `RoleBasedRoutes.jsx` and the `getDashboardRoute` helper in `AuthContext` to keep routing consistent.


