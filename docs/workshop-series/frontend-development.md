---
id: frontend-development
title: Frontend Development Guide
sidebar_position: 5.1
---

# Frontend Development Guide

This guide covers local development setup, running the frontend, debugging, and best practices for contributing to the frontend codebase.

## Prerequisites

- **Node.js** >= 18.0 (check with `node --version`)
- **npm** >= 8.0 (included with Node.js)
- A Firebase project with credentials configured in the backend

## Local Setup

### 1. Install Dependencies

From the frontend directory:

```bash
cd ywca-frontend
npm install
```

This installs all dependencies listed in `package.json`, including Vite, React, and Firebase libraries.

### 2. Configure Environment Variables

Create a `.env.local` file in the frontend root with:

```env
VITE_BACKEND_URL=http://localhost:5050
VITE_FIREBASE_API_KEY=<your-firebase-api-key>
VITE_FIREBASE_AUTH_DOMAIN=<your-firebase-auth-domain>
VITE_FIREBASE_PROJECT_ID=<your-firebase-project-id>
VITE_FIREBASE_STORAGE_BUCKET=<your-firebase-storage-bucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<your-firebase-messaging-sender-id>
VITE_FIREBASE_APP_ID=<your-firebase-app-id>
```

These values come from your Firebase console project settings. See the [Installation Guide](installation.md) for details.

### 3. Start the Development Server

```bash
npm run dev
```

Vite will start a development server, typically at `http://localhost:5173`. The app will automatically reload when you save changes.

## Development Workflow

### Code Formatting and Linting

All code should follow the project's ESLint and Prettier configuration. To format and lint your code:

#### Automatic (Recommended)
Install VSCode extensions:
- **Prettier ESLint** (`rvest.vs-code-prettier-eslint`)
- **ESLint** (`dbaeumer.vscode-eslint`)

Once installed, format-on-save is automatic when you save files.

#### Manual
Format all files at once:

```bash
npx prettier . --write
```

### Adding a New Page

1. Create a new folder under `src/pages/<PageName>/`
2. Add components and styles specific to that page
3. Create a main component `<PageName>.jsx`
4. Import and add a route in `src/App.jsx`
5. Add navigation links in the navigation component (`src/common/layouts/`)

Example structure:
```
src/pages/NewPage/
├── NewPage.jsx          # Main page component
├── components/
│   └── Feature.jsx
├── styles/
│   └── NewPage.css
└── utils/
    └── helpers.js
```

### Adding a Shared Component

1. Create a component file in `src/common/components/`
2. Export the component and add documentation
3. Import and use it in any page

```javascript
// src/common/components/MyComponent.jsx
export default function MyComponent({ prop1, prop2 }) {
  return <div>{prop1} {prop2}</div>;
}
```

### Using Context for Global State

Global state (like user info) is managed via React Context in `src/common/contexts/`.

Access context in any component:

```javascript
import { useAuth } from '../common/contexts/AuthContext';

export default function MyComponent() {
  const { user, isLoggedIn } = useAuth();
  return <div>{user?.email}</div>;
}
```

### Adding Custom Hooks

Shared logic should be extracted into custom hooks and placed in `src/common/hooks/`.

```javascript
// src/common/hooks/useFetch.js
import { useState, useEffect } from 'react';

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => setData(data))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading };
}
```

## Building for Production

Create an optimized production build:

```bash
npm run build
```

The build output is placed in the `build/` directory. This directory is deployed to Firebase Hosting.

## Running Tests and Checks

### Linting

Check for code quality issues:

```bash
npm run lint
```

Fix issues automatically:

```bash
npm run lint -- --fix
```

## API Integration

The frontend calls backend endpoints using the configured `VITE_BACKEND_URL`. All requests to protected endpoints require a Firebase ID token.

### Making API Calls

Example authenticated request:

```javascript
import { useAuth } from '../common/contexts/AuthContext';

export function useApiCall() {
  const { user } = useAuth();

  const fetchData = async (endpoint) => {
    const token = await user.getIdToken();
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  };

  return { fetchData };
}
```

### Debugging API Issues

- Check the browser DevTools Network tab for requests/responses
- Verify `VITE_BACKEND_URL` is correct in `.env.local`
- Ensure the backend is running (`npm run dev` in `ywca-backend/`)
- Check backend logs for errors with your requests
- Use `http://localhost:5050/api-docs` to explore available endpoints

## Debugging

### Browser DevTools

Open browser DevTools to:
- Inspect elements and styles
- View console for errors and logs
- Use the Network tab to debug API calls
- Step through code with the Debugger

### VSCode Debugger

Add a debug configuration to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

### Common Issues

**Port 5173 already in use:**
```bash
npm run dev -- --port 3000
```

**Module not found errors:**
- Check import paths are correct
- Verify the file exists in the expected location
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

**Firebase authentication issues:**
- Verify environment variables in `.env.local`
- Check Firebase project settings match your `.env` config
- Ensure backend is running and accessible

## Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Firebase JavaScript SDK](https://firebase.google.com/docs/web/setup)
- [Backend API Documentation](apiroutes.md)
