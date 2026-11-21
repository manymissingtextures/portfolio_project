# Portfolio Application

A full-stack portfolio built with React, Vite, Express, and MongoDB.

## Features

- Portfolio projects with GitHub repository links
- Qualifications and education
- Contact submissions with owner-specific history and admin status management
- User registration, sign-in, and protected admin tools
- Admin management for projects, qualifications, contacts, and users

## Setup

1. Copy `.env.example` to `.env` and set `MONGODB_URI`, a private `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`. Keep `.env` private.

   ```powershell
   Copy-Item .env.example .env
   ```

2. Install backend and client dependencies:

   ```powershell
   npm install
   npm --prefix client install
   ```

3. Start the API and frontend:

   ```powershell
   npm run dev:full
   ```

The API runs on port `5000` by default, and the Vite client runs on port `5173`. The client proxies API requests to `http://localhost:5000`; set `API_PROXY_TARGET` if the backend uses another address.

## Thunder Client: account creation and authentication

Account creation is a public request and does not require a token.

1. Send **POST** to `http://localhost:5000/api/users/register` with **Body → JSON**:

   ```json
   {
     "name": "Sample User",
     "email": "sample.user@example.com",
     "password": "ChooseYourOwnPassword123!"
   }
   ```

   Use an email not already registered. A successful response is `201 Created` and includes a token and user profile; it does not include the password.

2. To sign in, send **POST** to `http://localhost:5000/auth/signin` with:

   ```json
   {
     "email": "sample.user@example.com",
     "password": "ChooseYourOwnPassword123!"
   }
   ```

3. To verify the token, send **GET** to `http://localhost:5000/api/users/profile` and set **Auth → Bearer** to the token from the response.

## API overview

- `/api/contacts` — contact submissions; users can view their own, while admins can review and manage all submissions
- `/api/projects` — project records
- `/api/qualifications` — qualification records
- `/api/users/register` — public account registration
- `/api/users/profile` — signed-in user's profile
- `/auth/signin` — account sign-in
- `/auth/signout` — signed-in account sign-out

Protected requests require `Authorization: Bearer <token>`. Admin-only operations require an admin account configured through `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

## Build and tests

```powershell
npm --prefix client run build
npm test
```
