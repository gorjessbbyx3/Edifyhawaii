# EDIFY Limited - IT Services & Web Development Portfolio + CRM

## Overview

EDIFY Limited is a Hawaii-based IT services company website with an integrated admin CRM system. The public site showcases managed IT support, custom web development, and technology consulting services with AI-powered audit chat. The admin portal at `/admin` provides comprehensive CRM functionality including lead management, client tracking, AI agents, analytics, and business automation tools.

**Public Site Features:**
- Marketing portfolio with services, portfolio projects, and blog
- AI-powered website audit chat
- Contact form for lead generation
- SEO-optimized pages

**Admin CRM Features (at /admin):**
- Secure token-based authentication (webmaster credentials)
- Dashboard with KPIs and analytics
- Lead pipeline management with stages (Discovered, Needs Help, Contacted, Qualified, Closed, Archived)
- Client management and tracking
- 7 AI Agents (Crawler, Verifier, Contact, Caller, Reporter, Form Agent, Nurturer)
- Event stream monitoring
- Nurturing campaigns and sample sites
- Approval queue for AI-generated content
- External CRM sync capabilities

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
│       ├── components/     # Reusable UI components
│       │   └── admin/      # Admin-specific components (AdminLayout, AdminSidebar)
│       ├── pages/          # Route page components
│       │   └── admin/      # Admin CRM pages (dashboard, leads, clients, agents, etc.)
│       ├── hooks/          # Custom React hooks
│       └── lib/            # Utilities and query client
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route handlers
│   ├── storage.ts    # Database operations (public site)
│   ├── db.ts         # Database connection
│   └── admin/        # Admin CRM backend
│       ├── auth.ts   # Admin authentication (token-based)
│       ├── storage.ts # CRM storage operations
│       └── services/ # AI agent services
├── shared/           # Shared code between client/server
│   ├── schema.ts     # Public site database schema
│   ├── crm-schema.ts # CRM database schema (leads, clients, agents, etc.)
│   └── routes.ts     # API route definitions with validation
└── migrations/       # Drizzle database migrations
```

### Admin Credentials
- Username: Stored in `ADMIN_USERNAME` environment variable
- Password: SHA-256 hashed, stored in `ADMIN_PASSWORD_HASH` environment variable
- Access: Navigate to `/admin` to login

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