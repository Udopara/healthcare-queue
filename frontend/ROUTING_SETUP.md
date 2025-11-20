# Routing Setup Guide

## ✅ What's Been Set Up

### 1. **Authentication Pages**
- ✅ `src/pages/auth/LoginPage.jsx` - Admin login page
- ✅ `src/pages/auth/RegisterPage.jsx` - Admin registration page

### 2. **Route Guards**
- ✅ `src/components/routes/ProtectedRoute.jsx` - Protects routes that require authentication
- ✅ `src/components/routes/PublicRoute.jsx` - Redirects authenticated users away from auth pages

### 3. **Routing Configuration**
- ✅ `src/App.jsx` - Main app with BrowserRouter setup
- ✅ `src/config/routes.js` - Route path constants

### 4. **Utilities**
- ✅ `src/utils/auth.js` - Authentication helper functions

### 5. **Pages**
- ✅ `src/pages/HomePage.jsx` - Landing page
- ✅ `src/pages/NotFoundPage.jsx` - 404 page

## 🚀 How to Use

### Current Routes

1. **`/`** - Home page (public)
2. **`/auth/login`** - Login page (redirects if already logged in)
3. **`/auth/register`** - Register page (redirects if already logged in)
4. **`*`** - 404 page for any unmatched routes

### Adding New Routes

In `src/App.jsx`, add your route like this:

```jsx
// Protected route (requires authentication)
<Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute isAuthenticated={authenticated}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

// Public route
<Route
  path="/booking"
  element={<QueueBookingPage />}
/>
```

### Authentication Check

The app checks authentication using `localStorage`. To authenticate a user:

```javascript
import { setAuth } from '@/utils/auth'

// After successful login
setAuth(token, user)
```

To check if user is authenticated:

```javascript
import { isAuthenticated } from '@/utils/auth'

if (isAuthenticated()) {
  // User is logged in
}
```

## 📝 Next Steps

1. **Create API Service** - Connect LoginPage and RegisterPage to your backend API
2. **Create Dashboard Pages** - Add admin, clinic, and patient dashboard pages
3. **Update App.jsx** - Uncomment and add routes for new pages as you create them
4. **Create Layouts** - Add AdminLayout and PublicLayout components if needed

## 🔗 Using Route Constants

Instead of hardcoding paths, use constants from `config/routes.js`:

```jsx
import { ROUTES } from '@/config/routes'
import { Link } from 'react-router-dom'

<Link to={ROUTES.LOGIN}>Login</Link>
```

