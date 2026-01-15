# EDIFY Limited - IT Services & Web Development Portfolio

## Overview

EDIFY Limited is a Hawaii-based IT services company website showcasing managed IT support, custom web development, and technology consulting services. The application is a marketing portfolio site with a contact form for lead generation. Built as a full-stack TypeScript application with React frontend and Express backend, it targets local businesses seeking technology solutions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom design tokens in CSS variables for theming
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Animations**: Framer Motion for page transitions and scroll-reveal effects
- **State Management**: TanStack Query (React Query) for server state and API caching
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ESM modules
- **API Pattern**: Simple REST endpoints defined in shared route definitions
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Build**: esbuild for server bundling, Vite for client bundling

### Project Structure
```
├── client/           # React frontend application
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── pages/       # Route page components
│       ├── hooks/       # Custom React hooks
│       └── lib/         # Utilities and query client
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route handlers
│   ├── storage.ts    # Database operations
│   └── db.ts         # Database connection
├── shared/           # Shared code between client/server
│   ├── schema.ts     # Drizzle database schema and Zod types
│   └── routes.ts     # API route definitions with validation
└── migrations/       # Drizzle database migrations
```

### Key Design Decisions

**Shared Schema Pattern**: Database schema in `shared/schema.ts` uses Drizzle ORM and `drizzle-zod` to generate both database types and runtime validation schemas. This ensures type safety across the full stack.

**API Route Definitions**: The `shared/routes.ts` file defines API contracts with paths, methods, input schemas, and response types. Both client and server reference these definitions for consistency.

**Development vs Production**: In development, Vite middleware serves the frontend with HMR. In production, the Express server serves static files from the built `dist/public` directory.

## External Dependencies

### Database
- **PostgreSQL**: Primary database via `DATABASE_URL` environment variable
- **Drizzle ORM**: Schema management and query building
- **drizzle-kit**: Database migrations with `db:push` command

### Third-Party Services
- **Google Fonts**: Outfit and Inter font families for typography
- **Vercel** (referenced in portfolio): Some showcase projects deployed on Vercel

### Key NPM Packages
- **@tanstack/react-query**: Async state management
- **framer-motion**: Animation library
- **wouter**: Client-side routing
- **zod**: Runtime type validation
- **connect-pg-simple**: PostgreSQL session store (available but sessions not currently implemented)