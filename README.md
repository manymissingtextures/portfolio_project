# Personal Portfolio

A responsive six-page personal portfolio built with React, Vite, and React Router.

## Pages

- Home: introduction and mission statement
- About: profile, values, and résumé download
- Projects: three case studies with links to their GitHub repositories
- Education: qualifications timeline
- Services: web services offered
- Contact: contact panel and interactive demo form

## Run locally

This project now includes a Node.js + Express + MongoDB backend alongside the Vite frontend.

1. Copy the environment template and replace `<db_password>` with the password for `immissingatexture_db_user`. Also set a private JWT secret:

```powershell
copy .env.example .env
```

2. Install dependencies and start both the frontend and the API together:

```powershell
npm install
npm run dev
```

The frontend typically runs at `http://localhost:5173/` and the API runs at `http://localhost:5000/`.

To run only the backend:

```powershell
npm run server
```

## Environment variables

Create a local `.env` file based on `.env.example` using the following variables:

- `PORT` — backend port (default `5000`)
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — secret used to sign JWT tokens
- `JWT_EXPIRES_IN` — token lifetime, for example `1h`

Do not commit secrets to Git. The repository already ignores `.env` files.

The provided Atlas cluster is `portfolio.yrygjy2.mongodb.net`; the backend selects the `Portfolio` database on that cluster. If the database user's password contains special characters, URL-encode them in the URI. The API will not start if `MONGODB_URI` is missing or the database connection fails.

## API overview

The backend exposes REST endpoints for portfolio data and authentication:

- `/api/contacts`
- `/api/projects`
- `/api/qualifications`
- `/api/educations`
- `/api/users` with signup/signin routes and protected profile access

The API checks the `Authorization: Bearer <token>` header for protected requests.

## Personalize before publishing

Review the project descriptions, education details, contact information, and `public/resume.pdf` to make sure they are accurate and ready to share publicly.

The contact form uses `sessionStorage` to capture submitted values and show a confirmation after returning home. It does not send or store messages on a server. Connect a form provider or backend before using it to receive real submissions.

## Build and lint

```powershell
npm run build
npm run lint
```

## GitHub and hosting

Create an empty repository on GitHub, then connect and push this local repository:

```powershell
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

For future updates, commit each meaningful change and push it:

```powershell
git add -A
git commit -m "Describe the change"
git push
```

Do not commit credentials or private contact information. The current local repository starts with an initial snapshot; new commits should reflect actual changes as they are made.

To deploy with Netlify, import the GitHub repository as a Vite project, use `npm run build` as the build command and `dist` as the publish directory. The included Netlify configuration provides client-side route fallbacks, and Netlify can deploy future pushes automatically. Vercel is also configured for client-side routing. No backend is configured for the contact form.
