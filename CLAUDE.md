# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Carrot Market Reloaded" - a Next.js e-commerce marketplace application built with TypeScript, React 19, and Prisma. The app uses SQLite for local development and features user authentication, product listings, and a mobile-first design with tab navigation.

## Development Commands

- `npm run dev` - Start development server with Turbopack on port 3000
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

## Database Commands

The project uses Prisma with SQLite:
- `npx prisma db push` - Push schema changes to database
- `npx prisma generate` - Generate Prisma client
- `npx prisma migrate dev` - Create and apply new migration
- `npx prisma studio` - Open Prisma Studio database browser

## Architecture

### App Router Structure
- Uses Next.js 15 App Router with TypeScript
- Main app structure in `/app` directory
- Tab-based navigation layout in `/app/(tabs)` with routes: home, chat, lifestyle, live, profile
- Modal intercepting routes using `@modal` slot for product details
- Parallel routes with `@potato` slot for custom layout components

### Authentication & Session Management
- Iron Session for cookie-based authentication (`lib/session.ts`)
- Middleware handles route protection (`middleware.ts`)
- Public routes: `/`, `/login`, `/sms`, `/create-account`, `/github/*`
- GitHub OAuth integration in `/app/github/` routes
- SMS token authentication for phone verification

### Database Schema (Prisma)
- **User**: username, email, password, phone, github_id, avatar
- **Product**: title, price, photo, description (belongs to User)
- **SMSToken**: token for phone verification (belongs to User)
- Uses SQLite for development (`prisma/dev.db`)

### Key Components
- Form components: `form-btn.tsx`, `form-input.tsx` with client/server variants
- `tab-bar.tsx` - Bottom navigation for mobile UI
- `product-list.tsx`, `list-product.tsx` - Product display components
- `social-login.tsx` - GitHub authentication component

### Styling & UI
- Tailwind CSS with custom configuration
- Dark theme: `bg-neutral-900 text-white`
- Mobile-first responsive design (`max-w-screen-sm mx-auto`)
- Geist and Inter fonts
- Heroicons for icons

### Environment Variables Required
- `DATABASE_URL` - SQLite database connection
- `COOKIE_PASSWORD` - Iron Session encryption key
- GitHub OAuth credentials for social login

### Route Protection Pattern
The middleware implements session-based route protection:
- Unauthenticated users are redirected to `/` from protected routes
- Authenticated users are redirected to `/home` from public-only routes

### Server Actions
- Located alongside page components (e.g., `actions.ts` files)
- Handle form submissions for login, account creation, product management
- Use Zod for validation and Prisma for database operations