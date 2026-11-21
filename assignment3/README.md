# Portfolio Backend

This project implements the backend for the COMP229 Portfolio application using Node.js, Express, MongoDB, Mongoose and JWT authentication.

## Features

- CRUD endpoints for contacts, projects, qualifications, and users
- MongoDB connection with Mongoose models
- JWT authentication for protected routes
- Graceful fallback mode when MongoDB is unavailable

## Setup

1. Install dependencies:
   npm install
2. Create a local environment file:
   cp .env.example .env
3. Start the server:
   npm start

## API Routes

- GET /api/contacts
- GET /api/contacts/:id
- POST /api/contacts
- PUT /api/contacts/:id
- DELETE /api/contacts/:id
- DELETE /api/contacts

- GET /api/projects
- GET /api/projects/:id
- POST /api/projects
- PUT /api/projects/:id
- DELETE /api/projects/:id
- DELETE /api/projects

- GET /api/qualifications
- GET /api/qualifications/:id
- POST /api/qualifications
- PUT /api/qualifications/:id
- DELETE /api/qualifications/:id
- DELETE /api/qualifications

- GET /api/users
- GET /api/users/:id
- POST /api/users
- PUT /api/users/:id
- DELETE /api/users/:id
- DELETE /api/users
- POST /api/users/register
- POST /api/users/login
- POST /api/users/logout
- GET /api/users/profile

## Notes

This project is designed to work with the frontend from Assignment 1 and can be run concurrently with the Vite client during development.

## Assignment 3 Frontend

The React client is in `client/`.

1. Copy `.env.example` to `.env` and set `MONGODB_URI`, a private `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`. Use unique values and keep `.env` private.
2. The backend seeds the administrator account using `ADMIN_EMAIL` and `ADMIN_PASSWORD` when they are configured.
3. Run both applications:
   npm run dev:full
4. Open `http://localhost:5173`.

The client proxies API requests to `http://localhost:5000` by default. Set `API_PROXY_TARGET` before starting the client if the backend uses another address.

Users may sign up and view projects and qualifications, and project cards link to their GitHub repositories when a URL is provided. Visitors can submit their name, email, subject, and message content through the contact form. Signed-in users can see their own submissions beneath the form; admins can review all submissions, change their status, or delete them. Contact status defaults to `Unread`; admins can set it to `In progress`, `Solved`, or `Unresolved`. Qualification entries use a title and organization, with optional completion date and description. The administrator may create, update, and delete projects and qualifications, edit user names and emails, delete other user accounts, and view users. The currently signed-in admin account cannot be deleted. Signing out calls the backend sign-out endpoint and clears the local session.
