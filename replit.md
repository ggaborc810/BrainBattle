# Brain Battle

## Overview

Brain Battle is a two-player trivia game application where players compete by answering questions to earn points. The app features character selection, a point-based scoring system with streak bonuses/penalties, an in-game store for unlocking premium characters, and celebratory win screens. Built as a full-stack TypeScript application with a React frontend and Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React useState/useEffect for local state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Animations**: Framer Motion for game feedback and transitions
- **Visual Effects**: canvas-confetti for celebration effects on win screens
- **Fonts**: Fredoka (display) and Nunito (body) for a playful, kid-friendly aesthetic

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Pattern**: REST endpoints defined in `server/routes.ts`
- **Build**: Custom esbuild script bundles server for production, Vite handles client build

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts` - defines three tables:
  - `users`: Player profiles with points and unlocked characters
  - `characters`: Available avatars with costs and premium status
  - `questions`: Trivia questions with topics, difficulty levels, and multiple choice options
- **Migrations**: Drizzle Kit with `db:push` command

### API Contract Pattern
- Shared route definitions in `shared/routes.ts` with Zod validation schemas
- Type-safe API contracts shared between frontend and backend
- Input validation using drizzle-zod integration

### Game Flow
1. Landing page with rules and navigation
2. Character selection for two players (stores in sessionStorage)
3. Turn-based trivia gameplay with streak mechanics
4. Winner celebration screen with confetti effects
5. Store page for purchasing premium characters with earned points

## External Dependencies

### Database
- **PostgreSQL**: Primary data store (requires `DATABASE_URL` environment variable)
- **Drizzle ORM**: Type-safe database queries and schema management
- **connect-pg-simple**: Session storage for Express (available but sessions not currently implemented)

### UI Libraries
- **Radix UI**: Comprehensive set of accessible, unstyled primitives
- **shadcn/ui**: Pre-built component library built on Radix
- **Lucide React**: Icon library

### Build & Development
- **Vite**: Frontend dev server and bundler with HMR
- **esbuild**: Server bundling for production
- **Replit plugins**: Development banner and cartographer for Replit environment

### Animation & Effects
- **Framer Motion**: Animation library for React
- **canvas-confetti**: Confetti celebration effects