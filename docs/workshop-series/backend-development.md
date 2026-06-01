---
id: backend-development
title: Backend Development Guide
sidebar_position: 6.1
---

# Backend Development Guide

This guide covers local backend setup, development workflow, debugging, and best practices for contributing to the backend.

## Prerequisites

- **Node.js** >= 18.0 (check with `node --version`)
- **npm** >= 8.0 (included with Node.js)
- A Firebase project with service account credentials
- An AWS RDS PostgreSQL instance (or Supabase as alternative)
- PostgreSQL client tools (optional, for direct DB access)

## Local Setup

### 1. Install Dependencies

From the backend directory:

```bash
cd ywca-backend
npm install
```

This installs Express, Firebase Admin SDK, database clients, and dev tools.

### 2. Configure Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with:

```env
# Firebase Service Account Key (from Firebase Console → Project Settings → Service Accounts)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}

# AWS RDS PostgreSQL Connection String
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Server Configuration
PORT=5050
NODE_ENV=development

# CORS Configuration (point to your frontend)
FRONTEND_URL_DEV=http://localhost:5173
FRONTEND_URL=https://ywca-disc.web.app
```

### 3. Set Up Database

Set up your AWS RDS PostgreSQL database:

1. Create an AWS RDS PostgreSQL instance or use Supabase
2. Copy the SQL schema from `sql/create_tables.sql`
3. Connect to your database: `psql $DATABASE_URL`
4. Paste the schema and run it
5. Verify tables are created: `\dt` in psql

### 4. Start the Development Server

```bash
npm run dev
```

The backend starts on `http://localhost:5050`. You should see:

```
Server running on port 5050
Connected to database
Swagger docs available at http://localhost:5050/api-docs
```

Verify with:
- Health check: `curl http://localhost:5050/health`
- Swagger UI: `http://localhost:5050/api-docs`

## Development Workflow

### Adding a New Endpoint

Follow the layered architecture pattern:

#### 1. Create a Route

Add to `src/routes/featureRoutes.js`:

```javascript
import express from 'express';
import * as controller from '../controllers/featureController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, controller.getAll);
router.post('/', verifyToken, controller.create);
router.get('/:id', verifyToken, controller.getById);
router.put('/:id', verifyToken, controller.update);
router.delete('/:id', verifyToken, controller.delete);

export default router;
```

#### 2. Create a Controller

Add to `src/controllers/featureController.js`:

```javascript
import * as repository from '../repositories/featureRepository.js';

export async function getAll(req, res) {
  try {
    const userId = req.user.uid;
    const items = await repository.getByUserId(userId);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function create(req, res) {
  try {
    const userId = req.user.uid;
    const item = await repository.create(userId, req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// ... other handlers
```

#### 3. Create a Repository

Add to `src/repositories/featureRepository.js`:

```javascript
import * as provider from '../providers/postgresProvider.js';

export async function getByUserId(userId) {
  return await provider.getFeaturesByUserId(userId);
}

export async function create(userId, data) {
  return await provider.insertFeature(userId, data);
}

// ... other operations
```

#### 4. Create a Provider

Add to `src/providers/postgresProvider.js`:

```javascript
export async function getFeaturesByUserId(userId) {
  const result = await pool.query(
    'SELECT * FROM features WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
}

export async function insertFeature(userId, data) {
  const result = await pool.query(
    'INSERT INTO features (user_id, name, data) VALUES ($1, $2, $3) RETURNING *',
    [userId, data.name, JSON.stringify(data)]
  );
  return result.rows[0];
}

// ... other queries
```

#### 5. Mount the Route

Add to `src/server.js`:

```javascript
import featureRoutes from './routes/featureRoutes.js';

app.use('/features', featureRoutes);
```

### Code Formatting and Linting

All code must follow the project's ESLint and Prettier configuration:

#### Automatic (Recommended)

Install VSCode extensions:
- **Prettier ESLint** (`rvest.vs-code-prettier-eslint`)
- **ESLint** (`dbaeumer.vscode-eslint`)

Format-on-save is automatic after installation.

#### Manual

Format all files:

```bash
npm run format
```

Check for linting issues:

```bash
npm run lint
```

Fix linting issues:

```bash
npm run lint -- --fix
```

### Testing Endpoints Locally

#### Using cURL

```bash
# Health check (no auth required)
curl http://localhost:5050/health

# Protected endpoint (requires Firebase ID token)
TOKEN=$(curl -s "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=YOUR_API_KEY" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' | jq -r '.idToken')

curl -H "Authorization: Bearer $TOKEN" http://localhost:5050/api/me
```

#### Using Swagger UI

Open `http://localhost:5050/api-docs` in your browser to explore and test endpoints interactively.

#### Using Postman

1. Create a Postman collection
2. Set the base URL to `http://localhost:5050`
3. In auth tabs, use Firebase tokens for protected endpoints
4. Save requests for team sharing

### Working with the Database

#### Using Supabase Web UI

- Open Supabase Console
- Navigate to Table Editor to view data
- Use SQL Editor to run queries

#### Using PostgreSQL CLI

```bash
# Connect to Supabase database
psql $DATABASE_URL

# List tables
\dt

# Run a query
SELECT * FROM users WHERE email = 'test@example.com';
```

#### Adding Database Migrations

When modifying the schema:

1. Update `sql/create_tables.sql` (for new setups)
2. Create a migration file with comments explaining changes
3. Test locally: paste migration SQL into Supabase SQL Editor
4. Commit both files to version control

### Environment Variables for Different Scenarios

#### Local Development

```env
NODE_ENV=development
FRONTEND_URL_DEV=http://localhost:5173
```

#### Production-like Testing

```env
NODE_ENV=production
FRONTEND_URL=https://ywca-disc.web.app
```

#### Database Switching (PostgreSQL to MySQL)

Update `src/config/database.js` to use the MySQL config instead of PostgreSQL.

## Debugging

### Logs and Output

View server logs to track execution:

```bash
npm run dev

# Output shows:
# [timestamp] Database connected
# [timestamp] Server running on port 5050
# [timestamp] Scheduled sends processor started
```

### Error Handling

All endpoints should catch and return meaningful errors:

```javascript
try {
  const result = await repository.operation();
  res.json(result);
} catch (error) {
  console.error('Operation failed:', error);
  res.status(500).json({
    error: error.message,
    timestamp: new Date().toISOString(),
  });
}
```

### VSCode Debugger

Add a debug configuration to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Backend",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

Press F5 to start debugging. Set breakpoints in code.

### Database Debugging

To debug database queries:

1. Add `console.log()` before query execution:
   ```javascript
   console.log('Query:', sql, 'Params:', params);
   ```

2. Check database logs in Supabase Console

3. Use Supabase SQL Editor to manually test queries

### Common Issues

**Port 5050 already in use:**
```bash
npm run dev -- --port 3000
```

**Database connection failed:**
- Verify `DATABASE_URL` in `.env`
- Check Supabase/RDS is online and accessible
- Verify firewall/network allows connections

**Firebase token verification failing:**
- Verify `FIREBASE_SERVICE_ACCOUNT_KEY` is valid JSON
- Check Firebase Console has correct project selected
- Ensure service account key hasn't been rotated

**CORS errors from frontend:**
- Verify `FRONTEND_URL_DEV` or `FRONTEND_URL` in `.env`
- Check frontend is running on the configured URL
- Review browser DevTools Network tab for preflight requests

## Running Background Scripts

### Process Scheduled Sends (Manual)

Run the scheduled sends processor once:

```bash
npm run process-scheduled-sends
```

This:
1. Fetches sends due to be sent
2. Triggers email delivery
3. Updates send status in database
4. Logs results

Runs automatically in background if dev server is running.

## Performance Tips

- Use parameterized queries to prevent SQL injection
- Index frequently queried columns (user_id, created_at, etc.)
- Use database connection pooling (already configured)
- Cache non-changing data in application memory
- Monitor query performance in Supabase Console

## Security Best Practices

- Always verify Firebase tokens via `authMiddleware`
- Never log sensitive data (passwords, tokens, keys)
- Use parameterized queries to prevent SQL injection
- Validate and sanitize user input
- Return generic error messages to clients (log detailed errors server-side)
- Keep dependencies up to date: `npm audit`

## Code Review Checklist

Before submitting a pull request:

- [ ] Code is formatted with Prettier (`npm run format`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] New endpoints include authentication checks
- [ ] Database queries use parameterized values
- [ ] Error handling covers failure cases
- [ ] Swagger documentation is updated
- [ ] `.env` variables are documented in `.env.example`
- [ ] Tested locally with frontend running

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Backend API Routes](apiroutes.md)
- [Database Schema](databaseschema.md)
