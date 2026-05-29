---
id: quick-start
sidebar_position: 3
---

# Quick Start

This guide helps you run the YWCA Email Tracker and begin working with the application quickly.

## Run the app locally

### 1. Start the backend

From `ywca/ywca-backend`:

```bash
npm run dev
```

The API will start on port `5050` by default.

### 2. Start the frontend

From `ywca/ywca-frontend`:

```bash
npm run dev
```

Open the app at `http://localhost:5173`.

### 3. Log in

Use the Firebase login flow to sign in. If the app is configured for email/password auth, create a local account or sign in with the available authentication providers.

## Core app pages

### Dashboard

The Dashboard provides a quick summary of pending and sent communications. It includes:

- a summary card for sent and pending scheduled emails
- a calendar view for scheduling context
- quick access to the main email workflows

### Contacts

The Contacts page is the central place for managing recipients and contact groups. It supports:

- viewing all contacts in a sortable table
- creating and editing recipient records
- organizing recipients into named groups
- bulk importing contacts via CSV

### Templates

The Templates page allows YWCA staff to build reusable email content. It includes:

- rich text editing with formatting controls
- image insertion from the image gallery
- template preview and save
- template search

### Scheduled Sends

The Scheduled Sends page lets users:

- schedule email campaigns for later delivery
- choose an email template and contact group
- review send status (Scheduled vs Sent)
- monitor send history

## Backend features to check

- `GET /health` — health check endpoint
- `GET /api-docs` — Swagger API documentation
- secure endpoint access via Firebase ID tokens
- scheduled send processing in the backend

## How to verify the system

1. Start both backend and frontend
2. Log in with Firebase credentials
3. Create a contact group and add recipients
4. Create or edit an email template
5. Schedule a send and confirm it appears in Scheduled Sends
6. Confirm backend processing for scheduled sends by checking the `sent` status and logs

## Useful commands

```bash
# Backend
cd ywca/ywca-backend
npm run dev
npm run process-scheduled-sends
npm run lint

# Frontend
cd ywca/ywca-frontend
npm run dev
npm run build
npm run lint
```

## Notes

If you change `VITE_BACKEND_URL`, make sure the frontend uses the same backend endpoint. The backend also supports a Swagger UI for API exploration at `http://localhost:5050/api-docs`.

> Deployment note: frontend merges to `main` are deployed to Firebase Hosting via GitHub Actions, while backend pushes to `main` are deployed to AWS Lambda via a Serverless workflow.

2. Check out our [Contributing Guidelines](/contributing)
