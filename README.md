# Personal Portfolio

A responsive six-page personal portfolio built with React, Vite, and React Router.

## Pages

- Home: introduction and mission statement
- About: profile, values, and résumé download
- Projects: three clearly marked sample case studies
- Education: qualifications timeline
- Services: web services offered
- Contact: contact panel and interactive demo form

## Run locally

```powershell
npm install
npm run dev
```

Vite prints the local URL, usually `http://localhost:5173/`.

## Personalize before publishing

Replace `Your Name`, `Your City`, and all sample qualifications/contact details with accurate information. Add your own portrait, replace each sample project with a real class or personal project and its outcome, and replace `public/resume.pdf` with your résumé. Project samples are labeled to avoid presenting fictional work as completed work.

The contact form uses `sessionStorage` to capture submitted values and show a confirmation after returning home. It does not send or store messages on a server. Connect a form provider or backend before using it to receive real submissions.

## Build and lint

```powershell
npm run build
npm run lint
```

## GitHub and hosting

Create a GitHub repository, then add and push it from this folder. Keep meaningful work in separate commits, for example: React/Vite setup, portfolio routes and content, responsive styling and interactions, then deployment configuration. Do not commit credentials or private contact information.

Import the repository into Netlify or Vercel as a Vite project. Use `npm run build` as the build command and `dist` as the publish/output directory. The included Netlify and Vercel configuration files provide client-side route fallbacks. No backend is configured for the contact form.
