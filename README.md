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

```powershell
npm install
npm run dev
```

Vite prints the local URL, usually `http://localhost:5173/`.

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
