# AGENTS.md

Guidance for AI coding agents working in this repository. Read this before making changes.

## Project overview

Clearday is a full-stack to-do app built with Next.js 16 (App Router). There is no sign-in: each browser automatically gets a private guest workspace. Users manage tasks with notes, due dates, priority, categories, search, filters, a trash with restore, calendar export, sample data, and light/dark mode.

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
- `JWT_SECRET`: a long random string used to sign guest session cookies

Never commit `.env.local` or any real secret.

## Tech stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict)
- MongoDB with Mongoose
- Sessions: a signed guest ID (JWT via `jose`) in an httpOnly cookie, issued automatically by `proxy.ts`
- Validation: Zod (shared by API routes and forms)
- Data fetching: TanStack Query
- Forms: react-hook-form with `@hookform/resolvers/zod`
- UI: Tailwind CSS v4, shadcn/ui (Radix), lucide-react icons, sonner toasts, next-themes

## Project structure

```
src/
├── app/
│   ├── (dashboard)/       The task board at "/"
│   ├── api/todos/         List, create and clear; sample data; [id] update, trash, restore, permanent delete
│   ├── globals.css        Theme tokens (light and dark)
│   ├── icon.svg           Favicon
│   └── layout.tsx         Root layout, fonts, providers
├── components/
│   ├── ui/                shadcn components (generated; edit only when necessary)
│   ├── brand/             Logo
│   ├── dashboard/         App header
│   └── todos/             Board, list, item, form, filters, badges, actions, sample data controls
├── hooks/                 TanStack Query hooks and small client hooks
├── lib/
│   ├── api/               Client-side fetch functions (apiRequest + per-resource files)
│   ├── auth/session.ts    Guest ID creation, session token signing and verification
│   ├── todos/             Constants, labels, sorting, due dates, calendar and sample data helpers
│   ├── validations/       Zod schemas
│   ├── db.ts              Cached Mongoose connection
│   └── api-response.ts    Consistent JSON error responses
├── models/                Mongoose models (Todo)
├── types/                 Shared TypeScript types
└── proxy.ts               Issues a guest session to new visitors (Next.js 16's replacement for middleware.ts)
```

## Architecture rules

1. **Components never call `fetch` directly.** Use a hook from `src/hooks/`, which calls a function in `src/lib/api/`, which calls `apiRequest`.
2. **Single source of truth.** Priorities, categories and views live in `src/lib/todos/constants.ts`. Schemas, types, labels and UI options all derive from them. Add new values there first.
3. **Validate on both sides with the same schema.** API routes use the schemas in `src/lib/validations/`; forms reuse them via `zodResolver`.
4. **Every todo query is scoped to the current guest.** Get the ID with `getCurrentUserId()` and always include `userId` in Mongoose filters. Return 404 (not 403) for todos that belong to someone else.
5. **Soft delete.** "Delete" sets `deletedAt`. Only todos already in the trash may be permanently deleted.
6. **Consistent API errors.** Use `jsonError` and `validationError` from `src/lib/api-response.ts`. Error bodies are `{ error, fieldErrors? }`. Log server errors with a `[area:action]` prefix.
7. **Map before responding.** Convert todos with `toTodo`; never send raw Mongoose documents.
8. **Filters live in the URL** (`view`, `q`, `category`) via `useTodoFilters`.

## Code conventions

- File names: kebab-case (`todo-item.tsx`). Components: PascalCase. Hooks start with `use`.
- API route files must be named exactly `route.ts`.
- Prefer small, single-purpose components and early returns over nested ternaries.
- No magic numbers: name them as constants (`SEARCH_DELAY_MS`, `DEFAULT_DUE_TIME`).
- Comments explain *why*, not *what*.
- Import with the `@/` alias rather than long relative paths.

## Styling

- Use theme tokens only (`bg-primary`, `text-muted-foreground`, `bg-done`, `bg-ochre`). Never hard-code colours in components.
- Every change must look right in light and dark mode, and at phone, tablet and laptop widths.
- Custom tokens: `done` (completed tasks), `ochre` (warm highlight, due today, medium priority). `destructive` is used for overdue and delete.

## Next.js 16 gotchas

- `params` in route handlers and `cookies()` are async: always `await` them.
- Any component using `useSearchParams` must be wrapped in `<Suspense>`.
- Content that depends on the browser (time of day, locale formatting) must wait for `useHydrated()` to avoid hydration mismatches.
- Dropdown menus that open dialogs use `modal={false}` to avoid a stuck-focus bug.

## Git

- Conventional commits: `feat:`, `fix:`, `refactor:`, `style:`, `chore:`, `docs:`.
- Stage files explicitly by path; do not use `git add .`.

## Workflow for making changes

Follow these steps in order for any feature or fix.

1. **Understand the request.** Restate it in one sentence and identify which layers it touches: model, validation, API route, client API function, hook, or UI.
2. **Create a branch.** Use `feature/<short-name>` or `fix/<short-name>`.
3. **Work from the data outwards:**
   1. Constants and types (`src/lib/todos/constants.ts`, `src/types/`)
   2. Mongoose model (`src/models/`)
   3. Zod schemas (`src/lib/validations/`)
   4. API route (`src/app/api/`), tested with curl or Postman before any UI is built
   5. Client API function (`src/lib/api/`) and hook (`src/hooks/`)
   6. UI components (`src/components/`), then the page
4. **Check every state.** Loading, empty, error and success, in light and dark mode, at phone, tablet and laptop widths.
5. **Verify.** Run `npx tsc --noEmit` and `npm run lint`; both must be clean.
6. **Commit in small, focused steps.** One logical change per commit, using conventional commit messages, and staging files by path.
7. **Open a pull request** describing what changed, why, and how it was tested.

### Example: adding a new category

1. Add it to `TODO_CATEGORIES` in `src/lib/todos/constants.ts`.
2. Add its label and icon to `CATEGORY_META` in `src/lib/todos/labels.ts`. TypeScript flags this as an error until you do.
3. Nothing else is needed: the model, validation, filters and form options all read from the constant.