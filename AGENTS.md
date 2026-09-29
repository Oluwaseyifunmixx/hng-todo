# AGENTS.md

Guidance for AI coding agents working in this repository. Read this before making changes.

## Project overview

Clearday is a full-stack to-do app built with Next.js 16 (App Router). Users register, log in, and manage their own tasks with notes, due dates, priority, categories, search, filters, a trash with restore, calendar export, and light/dark mode.

## Commands

| Task | Command |
| --- | --- |
| Install dependencies | `npm install` |
| Start the dev server | `npm run dev` |
| Type-check | `npx tsc --noEmit` |
| Lint | `npm run lint` |
| Production build | `npm run build` |

Run the type-check and lint before every commit. Both must pass with zero errors and zero warnings.

## Environment

Copy `.env.example` to `.env.local` and fill in:

- `MONGODB_URI`: MongoDB connection string, with the database name `hng-todo`
- `JWT_SECRET`: a long random string used to sign session tokens

Never commit `.env.local` or any real secret.

## Tech stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict)
- MongoDB with Mongoose
- Auth: JWT signed with `jose`, stored in an httpOnly cookie; passwords hashed with `bcryptjs`
- Validation: Zod (shared by API routes and forms)
- Data fetching: TanStack Query
- Forms: react-hook-form with `@hookform/resolvers/zod`
- UI: Tailwind CSS v4, shadcn/ui (Radix), lucide-react icons, sonner toasts, next-themes

## Project structure