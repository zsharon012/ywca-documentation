---
id: project-structure
sidebar_position: 4
---

# YWCA Email Tracker Project Structure

This guide explains the repository layout, the frontend/backend architecture, and where to find the code for each feature.

## Repository layout

The YWCA project is contained in the `ywca` workspace and includes two main applications:

- `ywca/ywca-frontend` — React application for the user-facing dashboard
- `ywca/ywca-backend` — Express API server and scheduled send processor

## Frontend structure

The frontend is built with Vite and React.

### Root files

- `src/App.jsx` — main routing and application shell
- `src/firebase-config.js` — Firebase initialization
- `src/main.jsx` — app bootstrap
- `src/index.css` / `src/App.css` — global styles

### Page directories

- `src/pages/dashboard` — Dashboard summary page
- `src/pages/contacts` — Contacts and group management
- `src/pages/scheduledsends` — Schedule management and send history
- `src/pages/Templates` — Template editing with rich text
- `src/pages/ImageGallery` — image gallery for template assets
- `src/pages/account` — login, signup, password reset, auth callback

### Shared code

- `src/common/components` — shared UI components for routes and layout
- `src/common/layouts` — navigation layout and app shell
- `src/common/contexts` — user and auth context
- `src/components/ui` — UI primitives and custom editor extensions

## Backend structure

The backend is an Express server with route handlers, database access, Firebase verification, and scheduled processing.

### Key files

- `src/server.js` — app bootstrapping, CORS, middleware, Swagger, route mounting, scheduler
- `src/lambda.js` — Lambda adapter for serverless deployment

### Config

- `src/config/database.js` — default PostgreSQL / Supabase connection
- `src/config/firebase.js` — Firebase Admin SDK configuration
- `src/config/swaggerConfig.js` — Swagger/OpenAPI settings

### Routes

- `src/routes/authRoutes.js`
- `src/routes/Contacts.js`
- `src/routes/mailobjectRoutes.js`
- `src/routes/schedulesendsRoutes.js`
- `src/routes/signupLinksRoutes.js`
- `src/routes/templatesRoutes.js`
- `src/routes/sendmailRoutes.js`
- `src/routes/imagebucketRoutes.js`

### Data access

- `src/providers` — low-level database access and query helpers
- `src/repositories` — repository layer exposing feature-specific operations

### Background scripts

- `src/scripts/processScheduledSends.js` — processes scheduled send records and initiates delivery

## Integration points

### Frontend → Backend

The frontend communicates with the backend using authenticated API requests. The main API base URL is configured by `VITE_BACKEND_URL`.

### Authentication

- Frontend: Firebase Auth handles user sign-in and token generation
- Backend: Firebase Admin verifies ID tokens before allowing protected routes

## Important configuration files

- `ywca/ywca-frontend/package.json` — frontend scripts and dependencies
- `ywca/ywca-backend/package.json` — backend scripts and dependencies
- `ywca/ywca-backend/.env` — backend runtime configuration (not committed)
- `ywca/ywca-frontend/.env` — frontend runtime configuration for Firebase and API URL

## How the app is organized by feature

### Contacts

Front-end: `src/pages/contacts/Contacts.jsx`
Back-end: `src/routes/Contacts.js`, provider/repository files

### Templates

Front-end: `src/pages/Templates/DraftTemplates.jsx`
Back-end: `src/routes/templatesRoutes.js`, mailobject providers

### Scheduled Sends

Front-end: `src/pages/scheduledsends/ScheduledSends.jsx`
Back-end: `src/routes/schedulesendsRoutes.js`, `src/scripts/processScheduledSends.js`

### Dashboard

Front-end: `src/pages/dashboard/Dashboard.jsx`
Back-end: summary data is pulled from `scheduledsends` and template records

## Notes on database support

The backend defaults to PostgreSQL/Supabase using `DATABASE_URL` in `src/config/database.js`.

A MySQL/AWS RDS configuration is included as comments in the same file and can be enabled if needed.

## Recommended edit points

- Add UI pages or helper components under `ywca-frontend/src/pages`
- Keep shared layout and auth logic in `ywca-frontend/src/common`
- Add new backend routes in `ywca-backend/src/routes`
- Keep database access logic separate in `ywca-backend/src/providers` and `src/repositories`

## Deployment workflows

- `ywca-frontend/.github/workflows/firebase-hosting-pull-request.yml` — builds the frontend on pull requests and deploys a preview to Firebase Hosting
- `ywca-frontend/.github/workflows/firebase-hosting-merge.yml` — builds and deploys the frontend to the live Firebase project `ywca-disc` on `main`
- `ywca-backend/.github/workflows/deploy.yml` — deploys the backend to AWS Lambda using Serverless on pushes to `main`

These workflows rely on GitHub secrets for Firebase and AWS credentials, so changes to deployment settings should be coordinated with repository administrators.

## Verification and maintenance

- Use `npm run dev` locally for both frontend and backend
- Use `http://localhost:5050/api-docs` to inspect the backend API contract
- Keep environment configuration documented in `installation.md`
