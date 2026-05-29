---
id: installation
title: Installation
sidebar_position: 2
---

# Installation and Setup Guide

This guide helps you install and run the YWCA Email Tracker locally, covering both frontend and backend setup.

## Prerequisites

Install the following tools before you begin:

- **Node.js** 18.x or later
- **npm** (included with Node.js)
- **Git**
- **VS Code** or another code editor

## System Requirements

- **OS**: Windows 10+, macOS, or Linux
- **RAM**: 4GB minimum, 8GB recommended
- **Disk**: 2GB free
- **Browser**: Latest Chrome, Firefox, Edge, or Safari

## Repository layout

The YWCA project is split into two applications:

- `ywca/ywca-frontend` — the React frontend
- `ywca/ywca-backend` — the Express backend

## Step 1: Clone the repository

From the workspace root, make sure you have the `ywca` folder available. If you need to clone it, use the repository URL provided by your project owner.

```bash
git clone <your-ywca-repo-url>
cd ywca
```

## Step 2: Install backend dependencies

```bash
cd ywca-backend
npm install
```

## Step 3: Install frontend dependencies

```bash
cd ../ywca-frontend
npm install
```

## Step 4: Configure environment variables

### Backend

Copy the backend environment template if it is available, or create a `.env` file with the following values:

```bash
DATABASE_URL=<your-postgres-or-supabase-connection-string>
FIREBASE_SERVICE_ACCOUNT_KEY=<firebase-service-account-json>
PORT=5050
FRONTEND_URL=http://localhost:5173
FRONTEND_URL_DEV=http://localhost:5173
FRONTEND_URL_PROD=https://ywca-disc.web.app
```

### Frontend

Create a `.env` file under `ywca-frontend` and define these variables:

```bash
VITE_FIREBASE_API_KEY=<firebase-api-key>
VITE_FIREBASE_AUTH_DOMAIN=<firebase-auth-domain>
VITE_FIREBASE_PROJECT_ID=<firebase-project-id>
VITE_FIREBASE_STORAGE_BUCKET=<firebase-storage-bucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<firebase-messaging-sender-id>
VITE_FIREBASE_APP_ID=<firebase-app-id>
VITE_FIREBASE_MEASUREMENT_ID=<firebase-measurement-id>
VITE_BACKEND_URL=http://localhost:5050
```

## Step 5: Run backend server

From `ywca/ywca-backend`:

```bash
npm run dev
```

The backend should start on port `5050` and expose its API and Swagger documentation.

## Step 6: Run frontend app

From `ywca/ywca-frontend`:

```bash
npm run dev
```

The frontend should open at `http://localhost:5173`.

## Verifying the setup

1. Open the frontend at `http://localhost:5173`
2. Confirm the app launches and the login page appears
3. Open the backend at `http://localhost:5050/health` to verify the API is healthy
4. Open the Swagger docs at `http://localhost:5050/api-docs`

## Common issues

### Backend fails to start

- Verify `DATABASE_URL` is correct
- Confirm your database allows external connections
- Confirm `FIREBASE_SERVICE_ACCOUNT_KEY` is valid JSON

### Frontend cannot authenticate

- Confirm Firebase config values are correct
- Confirm `VITE_BACKEND_URL` points to the running backend
- Check browser console for CORS or token errors

### Ports conflict

- Default frontend port: `5173`
- Default backend port: `5050`
- Use another free port if needed and update `VITE_BACKEND_URL`

## Useful commands

### Frontend

```bash
cd ywca-frontend
npm run dev
npm run build
npm run lint
```

### Backend

```bash
cd ywca-backend
npm run dev
npm run process-scheduled-sends
npm run lint
```

## Deployment workflows

The project also includes GitHub Actions workflows for continuous deployment.

- **Frontend**: `ywca-frontend/.github/workflows/firebase-hosting-pull-request.yml` and `ywca-frontend/.github/workflows/firebase-hosting-merge.yml`
  - Pull requests build the app and deploy a preview to Firebase Hosting
  - Merges to `main` deploy the live site to the Firebase project `ywca-disc`
  - These workflows use Firebase service account credentials stored in `FIREBASE_SERVICE_ACCOUNT_YWCA_DISC`

- **Backend**: `ywca-backend/.github/workflows/deploy.yml`
  - Deploys the backend to AWS Lambda using `serverless` on pushes to `main`
  - It uses AWS and Serverless secrets such as `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `SERVERLESS_ACCESS_KEY`, `AWS_S3_BUCKET`, and region variables

These CI workflows are separate from local `npm run dev` usage and are intended for production deployment.
