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


