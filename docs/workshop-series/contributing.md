---
id: contributing
sidebar_position: 5
---

# Contributing to the YWCA Email Tracker

These guidelines explain how to contribute to the YWCA Email Tracker application and keep the documentation and codebase consistent.

## Recommended workflow

1. Clone the `ywca` repository.
2. Create a feature branch for your work.
3. Make your changes locally.
4. Run the app and verify functionality.
5. Commit and push your branch.
6. Open a pull request for review.

## Branch naming

Use descriptive branch names:

- `feature/<short-description>` for new features
- `fix/<short-description>` for bug fixes
- `docs/<short-description>` for documentation updates

Examples:

- `feature/contact-import`
- `fix/scheduled-send-status`
- `docs/update-installation`

## Commit messages

Follow simple, consistent commit messages:

- Start with a verb: `Add`, `Fix`, `Update`, `Refactor`
- Keep the summary concise
- Add details in the body when needed

Example:

```bash
git commit -m "Add contact import validation" -m "Validate CSV rows before sending them to the contacts API"
```

## Local testing

### Backend

From `ywca/ywca-backend`:

```bash
npm install
npm run dev
```

If you are testing scheduled send processing manually:

```bash
npm run process-scheduled-sends
```

### Frontend

From `ywca/ywca-frontend`:

```bash
npm install
npm run dev
```

### Verify changes

- Confirm the UI loads at `http://localhost:5173`
- Confirm the API responds at `http://localhost:5050/health`
- Use Swagger at `http://localhost:5050/api-docs` to inspect backend routes

## Code quality

### Formatting

Use the existing Prettier and ESLint setup:

- Frontend: `npm run lint` in `ywca/ywca-frontend`
- Backend: `npm run lint` in `ywca/ywca-backend`

### Style and structure

- Keep UI components modular and reusable
- Keep business logic in backend routes, controllers, and providers
- Use environment variables for configuration, not hard-coded values
- Avoid introducing unrelated changes in one pull request

## Pull requests

A good PR should include:

- A clear title and description
- The problem being solved
- The files changed and why
- Any testing performed

### Review checklist

- Does the feature work locally?
- Are changes limited to the relevant scope?
- Are environment and configuration updates documented?
- Are there no obvious lint or formatting issues?

## Documentation updates

When you change code, update documentation if the feature requires it.

Areas to keep current:

- setup instructions in `installation.md`
- quick start or verification steps in `quick-start.md`
- project architecture in `project-structure.md`
- API-related notes in the docs if routes change

## Getting help

If you need assistance:

- Review existing documentation
- Search the codebase for similar features
- Ask a teammate or project maintainer

> Helpful documentation and a consistent repo structure make it easier for the team to maintain the YWCA Email Tracker over time.
