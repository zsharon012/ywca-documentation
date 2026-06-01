---
id: frontend-project-structure
title: Frontend Project Structure
sidebar_position: 5
---

# Frontend Project Structure

This guide explains the frontend codebase organization, key directories, and where to find code for each feature.

## Technology Stack

The frontend is built with:
- **Vite** — fast build tool and development server
- **React** — UI library for building components
- **Firebase** — authentication and hosting

## Directory Structure

```
ywca-frontend/
├── public/                 # Static assets served as-is
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── assets/            # Non-code files (images, icons, etc.)
│   │   └── icons/         # SVG icon files
│   ├── common/            # Shared code across pages
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React context for global state
│   │   ├── hooks/         # Custom React hooks
│   │   ├── layouts/       # Page layout wrappers
│   │   └── utils/         # Helper functions
│   ├── components/        # Feature-specific components
│   │   └── ui/           # UI primitives and extensions
│   ├── pages/            # Page-level components (one folder per page)
│   │   ├── dashboard/    # Dashboard summary page
│   │   ├── contacts/     # Contacts and group management
│   │   ├── scheduledsends/ # Schedule management and send history
│   │   ├── Templates/    # Template editing with rich text
│   │   ├── ImageGallery/ # Image gallery for template assets
│   │   └── account/      # Login, signup, password reset, auth callback
│   ├── styles/           # Global and theme styles
│   ├── utils/            # Utility functions
│   ├── lib/              # Third-party integrations
│   ├── App.jsx           # Main app component with routing
│   ├── App.css           # Global stylesheet
│   ├── firebase-config.js # Firebase initialization
│   ├── index.css         # Base styles
│   └── main.jsx          # App bootstrap entry point
├── .eslintrc.json        # ESLint configuration
├── .prettierrc            # Prettier formatting config
├── eslint.config.js      # ESLint rules (extended config)
├── vite.config.js        # Vite build configuration
├── firebase.json         # Firebase hosting config
├── package.json          # Dependencies and scripts
└── README.md             # Project documentation
```

## Key Root Files

- **`src/App.jsx`** — Main routing and application shell. Define page routes and global navigation here.
- **`src/firebase-config.js`** — Firebase initialization for authentication and hosted app configuration.
- **`src/main.jsx`** — React app bootstrap. Mounts the root component and initializes the app.
- **`src/index.css`** / **`src/App.css`** — Global styles applied to all pages.

## Shared Code (`src/common/`)

Code that doesn't belong to a specific page lives here:

- **`components/`** — Reusable UI components shared across pages (e.g., navigation, modals, headers)
- **`contexts/`** — React context for global state management (e.g., user auth context)
- **`hooks/`** — Custom React hooks for shared logic
- **`layouts/`** — Page wrapper layouts, navigation shell, and routing structure
- **`utils/`** — Helper functions that aren't hooks (e.g., formatters, validators)

## Page Structure (`src/pages/`)

Each page is a folder containing all components and logic for that feature:

### Dashboard
- Path: `src/pages/dashboard/`
- Purpose: Summary view with send status, pending sends, and key metrics
- Main component: `Dashboard.jsx`

### Contacts
- Path: `src/pages/contacts/`
- Purpose: Manage contacts and organize them into groups
- Main component: `Contacts.jsx`

### Scheduled Sends
- Path: `src/pages/scheduledsends/`
- Purpose: Schedule email sends and view send history
- Main component: `ScheduledSends.jsx`

### Templates
- Path: `src/pages/Templates/`
- Purpose: Create and edit email templates with rich text editor
- Main component: `DraftTemplates.jsx`

### Image Gallery
- Path: `src/pages/ImageGallery/`
- Purpose: Upload and manage images for use in templates
- Main component: `ImageGallery.jsx`

### Account
- Path: `src/pages/account/`
- Purpose: User authentication (login, signup, password reset)
- Components: `Login.jsx`, `Signup.jsx`, `PasswordReset.jsx`, `AuthCallback.jsx`

## Feature Integration

Each page component typically uses:
- Custom hooks from `src/common/hooks/` for shared logic
- Components from `src/common/components/` for UI elements
- Utility functions from `src/common/utils/` for helpers
- Context from `src/common/contexts/` for global state (e.g., user)

## Frontend-Backend Communication

The frontend communicates with the backend via authenticated API requests:

- **API Base URL**: Configured via `VITE_BACKEND_URL` environment variable
- **Authentication**: Firebase ID token included in request headers
- **Swagger Docs**: Available at `http://localhost:5050/api-docs` when backend is running

## Build Output

- **Development**: Served by Vite dev server at `http://localhost:5173`
- **Production**: Built into `build/` directory, deployed to Firebase Hosting via GitHub Actions

## Code Style and Formatting

- **ESLint**: Enforces code quality rules (see `eslint.config.js`)
- **Prettier**: Auto-formats code on save (see `.prettierrc`)
- VSCode extension `rvest.vs-code-prettier-eslint` recommended for automatic formatting