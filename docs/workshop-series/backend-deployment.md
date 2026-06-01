---
id: backend-deployment
title: Backend Deployment
sidebar_position: 6.2
---

# Backend Deployment

The backend is deployed to AWS Lambda using the Serverless Framework via GitHub Actions. This guide explains the deployment process, configuration, and troubleshooting.

## Deployment Overview

The backend uses a fully automated deployment pipeline:

1. **Code Push** — Push to `main` branch triggers GitHub Actions
2. **Build & Test** — GitHub Actions installs dependencies and validates code
3. **Deploy** — Serverless Framework deploys to AWS Lambda
4. **Live** — Changes are immediately available at the API endpoint

## Automatic Deployment Workflow

### Trigger

**File:** `.github/workflows/deploy.yml`

**Trigger:** On any push to `main` branch

### Process

1. GitHub Actions checks out code
2. Installs dependencies: `npm install`
3. Validates code: `npm run lint`
4. Deploys to AWS Lambda using Serverless Framework
5. Confirms deployment succeeded

### Deployment Endpoint

```
https://api.ywca-disc.com/
```

All API requests go to this endpoint in production.

## Required Configuration

### GitHub Secrets

Configure these secrets in the repository settings:

- **`AWS_ACCESS_KEY_ID`** — AWS IAM user access key
- **`AWS_SECRET_ACCESS_KEY`** — AWS IAM user secret key
- **`FIREBASE_SERVICE_ACCOUNT_KEY`** — Firebase service account JSON
- **`DATABASE_URL`** — Production Supabase connection string
- **`FRONTEND_URL`** — Production frontend URL (e.g., `https://ywca-disc.web.app`)

### AWS Configuration

Create an IAM user with permissions:
- Lambda full access
- API Gateway full access
- CloudWatch Logs full access
- S3 full access (for deployment artifacts)

### Serverless Configuration

File: `serverless.yml`

```yaml
service: ywca-backend

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  environment:
    NODE_ENV: production
    FIREBASE_SERVICE_ACCOUNT_KEY: ${env:FIREBASE_SERVICE_ACCOUNT_KEY}
    DATABASE_URL: ${env:DATABASE_URL}
    FRONTEND_URL: ${env:FRONTEND_URL}
    PORT: 3000

functions:
  api:
    handler: src/lambda.handler
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors: true
      - http:
          path: /
          method: ANY
          cors: true

plugins:
  - serverless-plugin-warmup
```

## Local Deployment

For testing or emergency manual deploys:

### Prerequisites

```bash
npm install -g serverless

# Configure AWS credentials
aws configure
# Enter: AWS Access Key ID, Secret Access Key, Region (us-east-1)
```

### Deploy

```bash
# From backend directory
npm run build  # if needed

# Deploy to AWS Lambda
serverless deploy

# Expected output:
# Deploying ywca-backend to AWS Lambda
# Deployment successful
# API endpoint: https://xxxxxxx.execute-api.us-east-1.amazonaws.com/prod/
```

### Rollback

```bash
# List previous deployments
serverless deployment list

# Rollback to specific timestamp
serverless rollback --timestamp <timestamp>
```

## Environment Variables

### Development (Local)

Set in `.env`:

```env
NODE_ENV=development
FRONTEND_URL_DEV=http://localhost:5173
```

### Production (AWS Lambda)

Set in GitHub Secrets and `serverless.yml`:

```env
NODE_ENV=production
FIREBASE_SERVICE_ACCOUNT_KEY=<service-account-json>
DATABASE_URL=<production-supabase-url>
FRONTEND_URL=https://ywca-disc.web.app
```

Variables are injected into Lambda environment via GitHub Actions workflow.

## Build Process

The deployment build:

1. **Installs dependencies:** `npm install --production`
2. **Validates code:** `npm run lint`
3. **Packages code:** Creates a deployment package with src/ and node_modules/
4. **Uploads to S3:** Serverless Framework stores package in S3 bucket
5. **Creates Lambda function:** AWS creates/updates the Lambda function
6. **Configures API Gateway:** Sets up HTTP endpoints
7. **Verifies deployment:** Tests the deployed API

## Monitoring Deployment

### GitHub Actions

1. Go to repository → Actions tab
2. Find the `Deploy` workflow run
3. Click to view logs
4. Check for errors in the "Deploy with Serverless" step

### AWS Console

Monitor deployment in AWS Console:

1. **Lambda** → Functions → find `ywca-backend` function
2. View **Recent invocations** and logs
3. Check **CloudWatch** for detailed logs and errors

### API Health Check

Test the deployed API:

```bash
# Health check endpoint
curl https://api.ywca-disc.com/health

# Should return 200 OK with status data
```

## Troubleshooting Deployment

### Build Fails: "npm install failed"

**Cause:** Dependency installation error

**Fix:**
1. Check `package.json` for syntax errors
2. Run `npm install` locally to verify dependencies
3. Commit the fix and push to `main`
4. GitHub Actions will retry automatically

### Deploy Fails: "AWS credentials invalid"

**Cause:** GitHub secrets not configured or expired

**Fix:**
1. Go to repository Settings → Secrets
2. Update `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
3. Generate new AWS IAM keys if needed
4. Retry deployment

### Deploy Fails: "Firebase credentials invalid"

**Cause:** `FIREBASE_SERVICE_ACCOUNT_KEY` is invalid or outdated

**Fix:**
1. Download fresh service account key from Firebase Console
2. Convert to JSON and base64 encode if needed
3. Update GitHub secret `FIREBASE_SERVICE_ACCOUNT_KEY`
4. Retry deployment

### API Returns 502 Bad Gateway

**Cause:** Lambda function crashed or environment variables missing

**Check:**
1. Verify all GitHub secrets are set
2. Check CloudWatch logs for Lambda errors
3. Test database connectivity: `DATABASE_URL` correct?
4. Review recent code changes for errors

**Fix:**
1. Fix the code issue
2. Push to `main` to trigger redeployment
3. Or manually redeploy: `serverless deploy --force`

### API Gateway CORS Errors

**Cause:** CORS headers not configured

**Fix:**
1. Verify `serverless.yml` has `cors: true` for all endpoints
2. Update `FRONTEND_URL` in GitHub secrets
3. Redeploy: `serverless deploy`

## Performance and Scaling

### Cold Starts

Lambda functions experience "cold start" delays when invoked after inactivity.

**Solution:** Use Serverless Warmup Plugin (already configured):
- Keeps function warm with periodic invocations
- Reduces cold start latency

### Automatic Scaling

AWS Lambda automatically scales based on invocation volume. No configuration needed.

### Monitoring Performance

In AWS Console:

1. **CloudWatch** → Logs → `/aws/lambda/ywca-backend`
2. View duration and errors
3. Set alarms for high error rates

## Costs

AWS Lambda pricing (typical):
- **First 1M requests/month** — Free
- **Beyond 1M requests** — $0.20 per million requests
- **Compute time** — $0.0000166667 per GB-second

Typical YWCA app cost: ~$0-5/month

Monitor spending in AWS Cost Explorer.

## Database for Production

### AWS RDS PostgreSQL (Default)

- Self-managed PostgreSQL on AWS
- High performance and reliability
- Connection string: `postgresql://user:pass@host:5432/db`

### Supabase Alternative

Supabase can be used as a managed PostgreSQL alternative:

1. Create a Supabase project
2. Run `sql/create_tables.sql` in SQL Editor
3. Update `DATABASE_URL` with Supabase connection string in GitHub secrets
4. Redeploy

## Security Considerations

- **Credentials** — All secrets stored in GitHub Secrets, never in code
- **HTTPS** — API Gateway automatically provides HTTPS
- **Token Verification** — Firebase Admin SDK verifies all protected requests
- **Database** — Credentials stored securely in Supabase
- **Monitoring** — CloudWatch logs all API activity

## Deployment Checklist

Before merging to `main`, ensure:

- [ ] Code lints successfully: `npm run lint`
- [ ] All tests pass (if applicable)
- [ ] Environment variables documented in `.env.example`
- [ ] No hardcoded secrets in code
- [ ] GitHub secrets are up to date
- [ ] PR has been reviewed and approved
- [ ] Frontend also deployed if API contract changed

## Rollback Procedure

If deployment causes issues:

### Option 1: Automatic Rollback

1. Push a fix to `main`
2. GitHub Actions redeploys automatically

### Option 2: Manual Rollback

```bash
# List deployments
serverless deployment list

# Rollback to previous version
serverless rollback --timestamp <timestamp>
```

### Option 3: AWS Console

1. Lambda Console → Version → select previous version
2. Update API Gateway to point to previous version

## Post-Deployment Verification

After deployment, verify:

1. **Health Check**
   ```bash
   curl https://api.ywca-disc.com/health
   ```

2. **Swagger Docs**
   ```
   https://api.ywca-disc.com/api-docs
   ```

3. **API Endpoint**
   ```bash
   curl -H "Authorization: Bearer <token>" \
     https://api.ywca-disc.com/api/me
   ```

4. **Frontend Integration**
   - Test login flow
   - Verify API calls succeed
   - Check for errors in browser console

## Support

For deployment issues:

- Check [Serverless Framework Documentation](https://www.serverless.com/framework/docs)
- Review [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- Contact repository administrators for AWS access or credential issues
