---
id: frontend-deployment
title: Frontend Deployment
sidebar_position: 5.2
---

# Frontend Deployment

The frontend is automatically deployed to Firebase Hosting via GitHub Actions workflows. This guide explains the deployment process and how to troubleshoot deployment issues.

## Deployment Overview

The frontend uses two GitHub Actions workflows to handle deployment:

1. **Pull Request Preview Deployment** — Builds and deploys a preview for each PR
2. **Production Deployment** — Builds and deploys to live Firebase Hosting on `main` branch merges

Both workflows are located in `.github/workflows/`.

## Automatic Deployment Workflow

### Pull Request Deployment

**Trigger:** When a pull request is created or updated

**File:** `firebase-hosting-pull-request.yml`

**Process:**
1. GitHub Actions builds the frontend (`npm run build`)
2. Creates a preview URL for testing
3. Posts the preview URL as a comment on the PR
4. Preview is live until the PR is closed

**Preview URL Format:** `https://<project>--<pr-number>-<hash>.web.app/`

### Production Deployment

**Trigger:** When a pull request is merged to `main`

**File:** `firebase-hosting-merge.yml`

**Process:**
1. GitHub Actions builds the frontend (`npm run build`)
2. Deploys the build to the live Firebase Hosting project (`ywca-disc`)
3. Changes are immediately live at the production URL
4. Deployment status is visible in the Actions tab

**Production URL:** `https://ywca-disc.web.app/`

## Build Process

The build process performs the following steps:

```bash
npm install              # Install dependencies
npm run build            # Create optimized production build
```

Build output is placed in the `build/` directory:
- `build/index.html` — Main HTML file
- `build/assets/` — Minified JavaScript, CSS, and assets
- Static files are served with cache headers

## Required Configuration

### GitHub Secrets

The workflows require the following secrets to be configured in the repository:

- **`FIREBASE_SERVICE_ACCOUNT_KEY`** — Firebase service account JSON (base64 encoded)
  - Used to authenticate Firebase CLI
  - Generated in Firebase Console: Project Settings → Service Accounts

### Firebase Project Configuration

Ensure these files are configured in the repository:

- **`firebase.json`** — Firebase hosting configuration
- **`.firebaserc`** — Firebase project alias mapping

Typical `firebase.json`:
```json
{
  "hosting": {
    "public": "build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## Environment Configuration

The frontend uses different environment variables for development and production.

### Development (Local)

Create `.env.local`:
```env
VITE_BACKEND_URL=http://localhost:5050
VITE_FIREBASE_API_KEY=<dev-key>
VITE_FIREBASE_AUTH_DOMAIN=<dev-domain>
VITE_FIREBASE_PROJECT_ID=<dev-project>
# ... other dev Firebase config
```

### Production (Deployment)

Create `.env.production`:
```env
VITE_BACKEND_URL=https://api.ywca-disc.com
VITE_FIREBASE_API_KEY=<prod-key>
VITE_FIREBASE_AUTH_DOMAIN=<prod-domain>
VITE_FIREBASE_PROJECT_ID=<prod-project>
# ... other prod Firebase config
```

Vite automatically uses `.env.production` when building for production.

## Deployment Checklist

Before merging to `main`, ensure:

- [ ] All tests pass locally (`npm run lint`)
- [ ] Code is formatted correctly (`npm run build` succeeds locally)
- [ ] `.env.production` values are correct for production
- [ ] No sensitive data in code or environment variables
- [ ] PR has been reviewed and approved
- [ ] Backend is also deployed if API changes were made

## Manual Deployment

In rare cases where GitHub Actions deployment fails, you can deploy manually:

### Prerequisites

- Firebase CLI: `npm install -g firebase-tools`
- Logged in to Firebase: `firebase login`

### Deploy Steps

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

3. Verify the deployment:
   ```bash
   firebase open hosting:site
   ```

## Troubleshooting Deployment Issues

### Build Fails in GitHub Actions

**Check:** Review the workflow logs in the GitHub Actions tab

**Common causes:**
- Missing environment variables in `.env.production`
- Dependency installation failed
- ESLint errors in the code

**Fix:**
1. Run `npm run build` locally to identify issues
2. Fix the issues and commit
3. Create a new PR to retry the workflow

### Preview URL Not Working

**Cause:** Workflow may have failed silently

**Fix:**
1. Check the Actions tab for workflow errors
2. Review the workflow logs
3. Ensure all GitHub secrets are configured

### Production Site Shows Old Version

**Cause:** Browser cache may be serving old content

**Fix:**
1. Hard refresh the browser: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. Clear CloudFlare cache if using CDN
3. Check Firebase Hosting console for deployment status

### Cannot Deploy: Permission Denied

**Cause:** Missing Firebase credentials in GitHub secrets

**Fix:**
1. In Firebase Console, generate a new service account key
2. Encode it as base64: `cat key.json | base64`
3. Add to GitHub repository secrets as `FIREBASE_SERVICE_ACCOUNT_KEY`

## Rollback

To rollback to a previous version:

1. Go to Firebase Console → Hosting → Releases
2. Find the previous successful deployment
3. Click "Rollback" next to the deployment you want to restore

## Production Monitoring

Monitor your production deployment:

- **Firebase Console** → Hosting → Deployments tab shows deployment history
- **GitHub Actions** tab shows workflow execution status
- **Analytics** tab shows traffic and performance metrics

## Performance Optimization

The production build is optimized for performance:

- JavaScript and CSS are minified
- Assets are versioned with content hashes for long-term caching
- HTML is configured to rewrite all routes to `index.html` (SPA routing)

## HTTPS and Security

- Firebase Hosting automatically provides HTTPS with free SSL certificates
- All traffic is encrypted
- CDN caches content globally for low latency

## Domain Configuration

To use a custom domain:

1. Firebase Console → Hosting → Custom Domain
2. Add your domain (e.g., `ywca.discnu.org`)
3. Follow the instructions to update DNS records
4. SSL certificate is automatically provisioned

## Support

For deployment issues:

- Check [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- Review GitHub Actions workflow logs
- Contact repository administrators for access or permissions issues
