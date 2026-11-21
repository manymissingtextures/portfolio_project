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

Netlify builds the React client from `client/` and publishes `client/dist` using `netlify.toml`. The Express/MongoDB API must be hosted separately for registration, contact submissions, and admin features to work on the deployed site. Netlify's `VITE_API_URL` is configured in `netlify.toml`; update it there if the API URL changes. Leave it unset for local development, where Vite proxies requests to the backend.

## Deploying the API on Render

1. In Render, choose **New → Blueprint**, connect this repository on `main`, and let Render read `render.yaml`.
2. Enter `MONGODB_URI`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in Render's private environment settings. Render generates `JWT_SECRET`. Do not put these values in Git or chat.
3. Include the database name in the Atlas URI path (`<cluster>/<database>`). Without it, MongoDB can select the default `test` database. Use the database containing your portfolio records, and ensure Atlas allows the Render service to connect. Check the API root response: `database.connected` should be `true`, and `database.name` should be the intended database. If using a new database, add the project and qualification records there.
4. After the Render service is healthy, copy its public HTTPS origin. Set `VITE_API_URL` in `netlify.toml` to that origin (no trailing slash) and push the change to trigger a Netlify redeploy.

Render's free service may sleep when idle. Its first request after inactivity can take longer while it starts.
