---
id: project-structure
sidebar_position: 4
---

## Tech Stack

The website is built using modern web technologies:

- **Next.js**: React framework for production
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **MDX**: Markdown for content with JSX
- **Vercel**: Hosting and deployment platform

## Project Structure Overview

The project follows a modular structure:

```
.
├── app/                    # Next.js app directory
├── components/            # Reusable components
├── contents/             # MDX content files
├── lib/                  # Utilities
└── styles/              # Global styles
```

## Quick Links

- 📚 [Getting Started](/installation)
- 🏗️ [Project Overview & Quick Start](/quick-start)
- 📝 [Content Structure](/project-structure)
- 🚀 [Installation Guide](/installation)
- 👥 [Contributing Guidelines](/contributing)


# Project Structure

This guide provides a detailed overview of the DISC Workshop Series Website's architecture and file organization.

## Directory Structure

The project follows a modular structure optimized for Next.js development:

```
.
├── app/                    # Next.js app directory
│   ├── about/             # About page routing
│   ├── content/           # Content page routing
│   ├── schedule/          # Schedule page routing
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── markdown/          # MDX components
│   ├── ui/               # UI components
│   └── contexts/         # React contexts
├── contents/             # MDX content files
│   ├── about/           # About section
│   ├── content/         # Main content
│   └── schedule/        # Schedule content
├── lib/                  # Utilities
├── public/              # Static assets
└── styles/              # Global styles
```

## Key Directories Explained

### App Directory (`/app`)

The app directory contains the core Next.js application logic:

- **about/**: About page routing and components

  - `layout.tsx`: Layout for about pages
  - `page.tsx`: About page implementation

- **content/**: Main content routing

  - `[[...slug]]/page.tsx`: Dynamic routing for content
  - `layout.tsx`: Content pages layout

- **schedule/**: Workshop schedule implementation
  - Similar structure to content directory

### Components Directory (`/components`)

Contains all reusable UI components:

#### Markdown Components (`/components/markdown`)

- `copy.tsx`: Copy button functionality
- `image.tsx`: Image rendering
- `link.tsx`: Link handling
- `note.tsx`: Note blocks
- `pre.tsx`: Code block handling
- `stepper.tsx`: Step-by-step guides

#### UI Components (`/components/ui`)

- `accordion.tsx`: Collapsible sections
- `avatar.tsx`: User avatars
- `breadcrumb.tsx`: Navigation breadcrumbs
- `button.tsx`: Button components
- `dialog.tsx`: Modal dialogs
- `dropdown-menu.tsx`: Dropdown menus
- `sheet.tsx`: Slide-out panels
- `tabs.tsx`: Tab navigation

#### Navigation Components

- `Leftbar.tsx`: Left sidebar navigation
- `navbar.tsx`: Top navigation bar
- `menu-bar.tsx`: Mobile menu
- `pagination.tsx`: Content pagination

#### Utility Components

- `search.tsx`: Search functionality
- `theme-toggle.tsx`: Dark/light mode toggle
- `toc.tsx`: Table of contents

### Contents Directory (`/contents`)

Organized content in MDX format:

```
contents/
├── about/
│   └── index.mdx
├── content/
│   ├── assignments/
│   │   └── [assignment-1...9]/
│   ├── getting-started/
│   │   ├── faq/
│   │   ├── introduction/
│   │   └── quick-start-guide/
│   └── workshops/
│       └── [workshop-1...9]/
└── schedule/
    └── index.mdx
```

### Library Directory (`/lib`)

Utility functions and configurations:

- `markdown.ts`: MDX processing utilities
- `routes-config.ts`: Route configurations
- `utils.ts`: General utilities

## Configuration Files

Key configuration files include:

- `next.config.mjs`: Next.js configuration
- `tailwind.config.ts`: Tailwind CSS configuration
- `tsconfig.json`: TypeScript configuration
- `components.json`: UI component configurations

## Static Assets

The `/public` directory contains:

- `disc-logo.png`: DISC logo
- `public-og.png`: Open Graph image
- Other static assets

## Style System

The project uses a combination of:

1. **Tailwind CSS**: Utility-first styling
2. **Global CSS**: In `styles/globals.css`
3. **Syntax Highlighting**: In `styles/syntax.css`

## Best Practices

When working with this structure:

1. **Component Organization**

   - Keep components focused and single-purpose
   - Use proper naming conventions
   - Group related components together

2. **Content Management**

   - Follow MDX file structure
   - Keep content organized in appropriate directories
   - Use consistent frontmatter

3. **Code Organization**
   - Follow TypeScript best practices
   - Keep utility functions in `/lib`
   - Use proper imports/exports

## Further Reading

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [MDX Documentation](https://mdxjs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Contributing

When adding new components or content:

1. Follow the existing directory structure
2. Use appropriate naming conventions
3. Update relevant documentation
4. Add necessary tests
5. Follow the established coding style
