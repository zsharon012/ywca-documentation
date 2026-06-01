---
id: backend-project-structure
title: Backend Project Structure
sidebar_position: 6
---

# Backend Project Structure

This guide explains the backend codebase organization, key directories, and the layered architecture for handling requests and database access.

## Technology Stack

The backend is built with:
- **Node.js** — JavaScript runtime
- **Express.js** — web framework for handling HTTP requests
- **Firebase Admin SDK** — authentication and token verification
- **AWS RDS/PostgreSQL** — default database (switchable to Supabase PostgreSQL)
- **Serverless Framework** — deployment to AWS Lambda

## Directory Structure

```
ywca-backend/
├── sql/
│   ├── create_tables.sql          # AWS RDS / PostgreSQL schema (default)
│   └── create_tables_mysql.sql    # MySQL schema (legacy)
├── src/
│   ├── config/
│   │   ├── database.js            # DB connection pool
│   │   ├── firebase.js            # Firebase Admin SDK initialization
│   │   └── swaggerConfig.js       # Swagger/OpenAPI settings
│   ├── controllers/
│   │   ├── authController.js      # Auth endpoint logic
│   │   ├── contactsController.js
│   │   ├── mailobjectController.js
│   │   ├── schedulesendsController.js
│   │   ├── sendmailController.js
│   │   ├── signupLinksController.js
│   │   ├── templatesController.js
│   │   └── ...
│   ├── middleware/
│   │   └── authMiddleware.js      # Firebase token verification
│   ├── providers/
│   │   ├── postgresProvider.js    # AWS RDS / PostgreSQL queries (default)
│   │   ├── mysqlProvider.js       # MySQL queries (legacy)
│   │   ├── contactlistProviders.js
│   │   ├── mailobjectProvider.js
│   │   ├── recipientProvider.js
│   │   ├── schedulesendsProvider.js
│   │   ├── sendmailProvider.js
│   │   ├── signupLinksProvider.js
│   │   ├── templatesProvider.js
│   │   ├── imagebucketProvider.js
│   │   └── ...
│   ├── repositories/
│   │   ├── userRepository.js      # User data operations
│   │   ├── contactlistRepository.js
│   │   ├── mailobjectRepository.js
│   │   ├── recipientRepository.js
│   │   ├── schedulesendsRepository.js
│   │   ├── signupLinksRepository.js
│   │   ├── templatesRepository.js
│   │   ├── imagebucketRepository.js
│   │   └── ...
│   ├── routes/
│   │   ├── authRoutes.js          # Auth endpoints
│   │   ├── Contacts.js            # Contact management endpoints
│   │   ├── mailobjectRoutes.js
│   │   ├── schedulesendsRoutes.js
│   │   ├── signupLinksRoutes.js
│   │   ├── templatesRoutes.js
│   │   ├── sendmailRoutes.js
│   │   ├── imagebucketRoutes.js
│   │   └── ...
│   ├── scripts/
│   │   └── processScheduledSends.js  # Background job for scheduled sends
│   ├── server.js                  # Express app setup and route mounting
│   └── lambda.js                  # AWS Lambda handler wrapper
├── .env.example                   # Environment variables template
├── .eslintrc.json                 # ESLint configuration
├── .prettierrc                    # Prettier formatting config
├── eslint.config.js               # Extended ESLint rules
├── jsconfig.json                  # JavaScript project configuration
├── package.json                   # Dependencies and scripts
├── serverless.yml                 # Serverless Framework deployment config
├── rds-config.ini.example         # AWS RDS config (for migration)
├── deploy.sh                      # Deployment helper script
└── README.md                      # Project documentation
```

## Architecture Layers

The backend follows a layered architecture to keep concerns separated:

### 1. Routes (`src/routes/`)

Entry points for HTTP requests. Define endpoints and map them to controllers.

```javascript
// Example: src/routes/authRoutes.js
router.post('/signup', authController.signup);
router.get('/profile', authMiddleware.verifyToken, authController.getProfile);
```

### 2. Middleware (`src/middleware/`)

Cross-cutting concerns applied before controllers run.

- **`authMiddleware.js`** — Verifies Firebase ID tokens and attaches user info to requests

```javascript
router.get('/protected', authMiddleware.verifyToken, controller.handler);
```

### 3. Controllers (`src/controllers/`)

Business logic for handling requests. Parse input, call repositories, return responses.

```javascript
// Example: src/controllers/contactsController.js
export async function getContacts(req, res) {
  const userId = req.user.uid;
  const contacts = await contactlistRepository.getByUserId(userId);
  res.json(contacts);
}
```

### 4. Repositories (`src/repositories/`)

Adapter layer that abstracts data access. Call providers and format results.

```javascript
// Example: src/repositories/contactlistRepository.js
export async function getByUserId(userId) {
  return await provider.getContactsByUserId(userId);
}
```

### 5. Providers (`src/providers/`)

Low-level database access. Execute raw SQL queries.

```javascript
// Example: src/providers/postgresProvider.js
export async function getContactsByUserId(userId) {
  const result = await pool.query('SELECT * FROM contacts WHERE user_id = $1', [userId]);
  return result.rows;
}
```

## Key Root Files

### Configuration

- **`src/config/database.js`** — Database connection pool initialization
  - Default: PostgreSQL/Supabase
  - Configurable: MySQL/AWS RDS via comments
- **`src/config/firebase.js`** — Firebase Admin SDK initialization with service account
- **`src/config/swaggerConfig.js`** — Swagger/OpenAPI documentation configuration

### Main Application

- **`src/server.js`** — Express app setup
  - CORS configuration
  - Middleware registration
  - Route mounting
  - Scheduled send processor startup
  - Server startup on configured PORT
- **`src/lambda.js`** — AWS Lambda handler wrapper
  - Exposes Express app to Lambda runtime
  - Used for serverless deployment

## Environment Variables

Required `.env` variables (see `.env.example`):

```env
# Firebase
FIREBASE_SERVICE_ACCOUNT_KEY=<service-account-json>

# Database
DATABASE_URL=postgresql://user:pass@host/db

# Server
PORT=5050
NODE_ENV=development

# CORS
FRONTEND_URL_DEV=http://localhost:5173
FRONTEND_URL=https://ywca-disc.web.app

# Optional: AWS RDS (when migrating from Supabase)
# RDS_HOST, RDS_USER, RDS_PASSWORD, RDS_DATABASE
```

## Database Schema

The database schema is version-controlled in SQL files:

- **`sql/create_tables_mysql.sql`** — MySQL/AWS RDS schema (for migration)
- **`sql/create_tables.sql`** — PostgreSQL/Supabase schema

Schema includes tables for:
- Users
- Contacts and groups
- Email templates
- Mail objects (email drafts)
- Scheduled sends
- Send history
- Image uploads
- Signup links

## API Documentation

Swagger API documentation is automatically generated from code comments and available at:

```
http://localhost:5050/api-docs
```

Configuration: `src/config/swaggerConfig.js`

## Scheduled Processing

### Background Job

- **`src/scripts/processScheduledSends.js`** — Runs periodically to process scheduled email sends
  - Fetches sends due to be sent
  - Triggers email delivery
  - Updates send status
  - Can be run manually: `npm run process-scheduled-sends`

### Scheduler Integration

In `src/server.js`, a scheduler starts on app initialization:

```javascript
startScheduler(); // Runs processScheduledSends every N minutes
```

## Database Support

### Default: AWS RDS PostgreSQL

Uses `DATABASE_URL` in `src/config/database.js`:

```javascript
import pg from 'pg';
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
```

### Alternative: Supabase PostgreSQL

Supabase can be used as an alternative managed PostgreSQL database. Same connection string format as AWS RDS.

## File Organization by Feature

### Contacts Feature

- Routes: `src/routes/Contacts.js`
- Controller: `src/controllers/contactsController.js`
- Provider: `src/providers/contactlistProviders.js`
- Repository: `src/repositories/contactlistRepository.js`

### Templates Feature

- Routes: `src/routes/templatesRoutes.js`
- Controller: `src/controllers/templatesController.js`
- Provider: `src/providers/mailobjectProvider.js` (templates stored as mail objects)
- Repository: `src/repositories/mailobjectRepository.js`

### Scheduled Sends Feature

- Routes: `src/routes/schedulesendsRoutes.js`
- Controller: `src/controllers/schedulesendsController.js`
- Provider: `src/providers/schedulesendsProvider.js`
- Repository: `src/repositories/schedulesendsRepository.js`
- Processor: `src/scripts/processScheduledSends.js`

## Deployment Workflows

- **GitHub Actions** — `.github/workflows/deploy.yml` deploys on `main` branch pushes
- **Serverless Framework** — Uses `serverless.yml` configuration
- **AWS Lambda** — Backend runs as Lambda functions behind API Gateway

See [Backend Deployment](backend-deployment.md) for details.

## External Services

The backend integrates with:

- **Firebase Auth** — User authentication and token verification
- **Supabase** — Managed PostgreSQL database
- **AWS S3** — Image storage for gallery
- **SendGrid** (optional) — Email delivery service