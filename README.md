## MediQueue - Healthcare Queue Management

This repository contains a Node.js/Express backend with Sequelize (MySQL) for managing clinics, customers, queues and tickets. It also includes authentication and a complete password reset flow using Nodemailer and Gmail.

### Prerequisites
- Node.js 18+
- MySQL 8+ (or compatible)
- A Gmail account and app password for sending emails

### Project Structure
```
healthcare-queue/
  backend/
    server.js
    package.json
    scripts/
      seed.js
    src/
      controllers/
      middlewares/
      models/
      routes/
      utils/
```

### Environment Variables
Create a `.env` file inside `backend/` with the following variables:
```
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
# e.g. http://localhost:5173 or production URL
APP_URL=http://localhost:5173
```

Notes:
- Use a Gmail App Password (required if 2FA is enabled). Do not use your regular Gmail password.
- `APP_URL` is used to build clickable links in password reset emails.

### Install Dependencies
From the `backend/` directory:
```bash
npm install
```

### Database Setup
1. Create the MySQL database defined in `DB_NAME`:
   ```sql
   CREATE DATABASE healthcare_queue CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Start the server once; Sequelize `sync()` will create the tables automatically.
3. (Optional) Seed data:
   ```bash
   npm run build:DB
   ```

### Running the Backend
From `backend/`:
```bash
npm run dev
```
The server listens on `PORT` (default `3000`).

Health check:
```bash
curl http://localhost:3000/
```

### API Documentation (Swagger)
Swagger UI is available at:
- http://localhost:3000/api-docs

It documents the endpoints in `src/routes/*.js`, including authentication and password reset.

### Core Endpoints
Base URL: `http://localhost:3000`

- Auth
  - POST `/api/auth/register/customer`
  - POST `/api/auth/register/clinic`
  - POST `/api/auth/login/customer`
  - POST `/api/auth/login/clinic`
  - POST `/api/auth/password/forgot`
    - Body: `{ "email": "user@example.com" }`
    - Response: `{ "message": "If that email exists, a reset link was sent" }`
  - POST `/api/auth/password/reset`
    - Body: `{ "token": "<from-email>", "password": "NewStrongPassword123" }`
    - Response: `{ "message": "Password has been reset" }`

- Customers
  - Mounted at `/api/customers`

- Clinics
  - Mounted at `/api/clinics`

- Queues
  - Mounted at `/api/queues`

- Tickets
  - Mounted at `/api/tickets`

Refer to Swagger for the full schemas and examples.

### Password Reset Flow
1. User submits email at `POST /api/auth/password/forgot`.
2. Server generates a one-hour token and emails a link built from `APP_URL`, e.g. `APP_URL/reset-password?token=...`.
3. Frontend captures the `token` and new password, then calls `POST /api/auth/password/reset`.
4. On success, the token is marked as used and the password is updated.

Email transport is configured in `src/utils/email.js` using Nodemailer with Gmail credentials from `.env`.

### Configuration Files to Review
- `backend/server.js`: Express app, Swagger setup, Sequelize `sync()`.
- `backend/src/models/index.js`: Sequelize initialization and associations.
- `backend/src/controllers/auth.controller.js`: Register, login, password reset handlers.
- `backend/src/routes/auth.routes.js`: Auth routes and Swagger docs.
- `backend/src/utils/email.js`: Nodemailer transporter and email helpers.

### Common Issues
- Gmail sending blocked: ensure you use an App Password and the account allows SMTP.
- JWT errors: ensure `JWT_SECRET` is set in `.env`.
- DB connection fails: verify `DB_HOST`, `DB_USER`, `DB_PASS`, and that MySQL is running.

### Scripts
From `backend/package.json`:
```json
{
  "dev": "nodemon server.js",
  "build:DB": "node scripts/seed.js"
}
```

### Production Considerations
- Use environment variables (never commit secrets).
- Set `logging: false` in Sequelize (already done).
- Run behind a process manager (PM2) or containerize.
- Use a production-ready MySQL instance.
- Configure a production `APP_URL` so password reset links are correct.

---

### Frontend (Vite + React)

The frontend is a React application built with Vite and Tailwind CSS. It provides role-based dashboards for patients, clinics, doctors and admins.

#### Frontend prerequisites
- Node.js 18+ (same as backend)

#### Install frontend dependencies
From the repository root:

```bash
cd frontend
npm install
```

#### Running the frontend

```bash
cd frontend
npm run dev
```

- Vite will start the dev server (by default on `http://localhost:5173`).
- The frontend talks to the backend via `VITE_API_BASE_URL`:
  - If `VITE_API_BASE_URL` is **not** set, it defaults to `http://localhost:3000/api` (see `frontend/src/services/api.js`).
  - To point to another backend, create `frontend/.env` with:

    ```bash
    VITE_API_BASE_URL=http://your-backend-host:3000/api
    ```

Make sure the backend is running **before** logging in or registering from the frontend.

#### Frontend scripts (from `frontend/package.json`)

- `npm run dev` – start Vite dev server.

---

### Running the full stack locally

1. **Start the backend**
   ```bash
   cd backend
   npm install         # if you haven't already
   npm run dev
   ```
   The API will be available at `http://localhost:3000`.

2. **Start the frontend**
   ```bash
   cd frontend
   npm install         # if you haven't already
   npm run dev
   ```
   The UI will be available at `http://localhost:5173`.

3. **Optional: seed demo data**
   ```bash
   cd backend
   npm run build:DB
   ```
   This will:
   - Reset and recreate the database schema.
   - Create a system admin:
     - **Email**: `admin@mediqueue.com`
     - **Password**: `admin`
   - Create sample clinics, doctors, patients, queues and tickets.
     - Non-admin demo users use the password `Password123!` with randomly generated emails/phone numbers (check the DB if you need specific accounts).

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
  - Represents a healthcare facility managing its own queues.
  - After login: redirected to `/clinic/dashboard`.
  - Key pages:
    - `Dashboard` (`/clinic/dashboard`)
    - `Queues` (`/clinic/queues`)
    - `Patients` (`/clinic/patients`)
    - `Reports` (`/clinic/reports`)
    - `Settings` (`/clinic/settings`)

- **Doctor (`doctor`)**
  - Represents an individual provider working within a clinic.
  - Typically created by seeding or via admin tooling.
  - After login: redirected to `/doctor/dashboard`.
  - Key pages:
    - `Dashboard` (`/doctor/dashboard`)
    - `Queues` (`/doctor/queues`)
    - `Appointments` (`/doctor/appointments`)
    - `Reports` (`/doctor/reports`)
    - `Settings` (`/doctor/settings`)

- **Admin (`admin`)**
  - System-wide administrator responsible for managing clinics, doctors, and patients.
  - After login: redirected to `/admin/dashboard`.
  - Key pages:
    - `Dashboard` (`/admin/dashboard`)
    - `Clinics` (`/admin/clinics`)
    - `Doctors` (`/admin/doctors`)
    - `Users` (`/admin/users`)
    - `Patients` (`/admin/patients`)
    - `Reports` (`/admin/reports`)
    - `Settings` (`/admin/settings`)

#### Registration & login flows

- The frontend registration form calls `POST /api/auth/register` and expects a `role` field (currently focused on **patient** and **clinic** flows).
- Login calls `POST /api/auth/login` and stores:
  - `token` – JWT used in the `Authorization` header.
  - `user` – user profile including `role` and `linked_entity_id`.
- On each reload, the app:
  - Reads the token from `localStorage`.
  - Calls `GET /api/auth/me` (via `authService.verifyUser`) to fetch fresh user data.
  - Redirects to the appropriate dashboard based on `user.role` (see `RoleBasedRoutes.jsx`).

If you add new roles or dashboards, update `RoleBasedRoutes.jsx` and the `getDashboardRoute` helper in `AuthContext` to keep routing consistent.


