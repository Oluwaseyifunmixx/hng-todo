# Clearday

**Clear your mind. Own your day.**

A calm, focused full-stack to-do app. Get every task out of your head and into one place, then work through them without the overwhelm.

**Live demo:** https://hng-todo-six.vercel.app

No sign-up needed: open the link and start adding tasks, or click **Load sample data** to see every feature at once.

## Features

- **Instant, private workspace**: no sign-in. Each browser automatically gets its own private list, saved in the database
- **Sample data**: one click fills the app with realistic tasks; another returns it to its empty state
- **Rich tasks**: title, notes, due date and time, priority (high, medium, low) and category (personal, work, study, shopping, health)
- **Smart ordering**: unfinished tasks first, then by priority, then by the soonest due date
- **Due-date awareness**: overdue tasks are flagged, and tasks due today are highlighted
- **Add to calendar**: open any task in Google Calendar, or download an `.ics` file for Apple Calendar or Outlook, with a reminder 30 minutes before
- **Search and filters**: search by title, filter by status and category, all kept in the URL so views survive a refresh and can be shared
- **Trash with restore**: deleted tasks go to the trash, with an instant Undo; permanent deletion asks for confirmation
- **Quick add**: type a title and press Enter, or open the full form for details
- **Light and dark mode**: follows your device by default, with a toggle that remembers your choice
- **Responsive**: designed for phone, tablet and desktop
- **Considered states**: loading skeletons, friendly empty states, error recovery and toast feedback throughout

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Database | MongoDB Atlas, Mongoose |
| Sessions | Signed guest ID (JWT via `jose`) in an httpOnly cookie |
| Validation | Zod, shared between the API and the forms |
| Data fetching | TanStack Query |
| Forms | react-hook-form |
| UI | Tailwind CSS v4, shadcn/ui, lucide-react, sonner, next-themes |
| Hosting | Vercel |

## Getting started

### Prerequisites

- Node.js 20 or newer
- A MongoDB Atlas cluster (the free tier is enough)

### Setup

```bash
git clone https://github.com/Oluwaseyifunmixx/hng-todo.git
cd hng-todo
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | Description |
| --- | --- |
| `MONGODB_URI` | Your MongoDB connection string, with `hng-todo` as the database name |
| `JWT_SECRET` | A long random string used to sign guest session cookies. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

In MongoDB Atlas, allow network access from your IP address (or `0.0.0.0/0` when deploying to Vercel).

Then start the app:

```bash
npm run dev
```

Open http://localhost:3000.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the project |
| `npx tsc --noEmit` | Type-check the project |

## API

Every route works on the current visitor's own tasks only.

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/todos?view=&q=&category=` | List tasks (`view`: all, active, completed, trash) |
| POST | `/api/todos` | Create a task |
| DELETE | `/api/todos` | Clear all tasks, including the trash |
| POST | `/api/todos/sample` | Replace all tasks with sample data |
| PATCH | `/api/todos/:id` | Update a task |
| DELETE | `/api/todos/:id` | Move a task to the trash |
| POST | `/api/todos/:id/restore` | Restore a task from the trash |
| DELETE | `/api/todos/:id/permanent` | Permanently delete a task that is in the trash |

Errors always return `{ "error": "message" }`, with `fieldErrors` added for validation problems.

## Design decisions

- **No sign-in, but still private.** On the first visit, the app issues a signed guest ID in an httpOnly cookie. Every database query is scoped to that ID, so each browser only ever sees its own tasks, and nobody has to create an account to try the app.
- **Sample data replaces rather than adds**, so clicking it twice never creates duplicates, and "Clear all" always returns a clean empty state. Due dates are relative to the moment you load them, so there's always an overdue task, one due soon, and so on.
- **Undo instead of "Are you sure?" for trash**, because moving to the trash is reversible. Permanent deletion and "Clear all", which aren't, ask for confirmation. The friction matches the risk.
- **Calendar export instead of in-app reminders.** Reliable reminders need scheduled server jobs and push notifications. Handing the task to the user's own calendar gives dependable reminders on every device.
- **Server-side filtering and search**, so the database does the work and only the tasks being shown travel to the browser.
- **Filters in the URL**, so refreshing, sharing a link or using the back button all keep the same view.
- **One set of validation rules**, shared by the API and the forms, so the two can never disagree.

## Project structure

See [`AGENTS.md`](./AGENTS.md) for the full structure, architecture rules and coding conventions.

## Author

Built by **Seyi Akinlabi** ([@Oluwaseyifunmixx](https://github.com/Oluwaseyifunmixx)) for the HNG Internship.