# Clearday

**Clear your mind. Own your day.**

A calm, focused full-stack to-do app. Get every task out of your head and into one place, then work through them without the overwhelm.

**Live demo:** https://hng-todo-six.vercel.app

## Features

- **Accounts**: register, log in and log out, with secure httpOnly cookie sessions
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
| Auth | JWT (`jose`) in an httpOnly cookie, `bcryptjs` password hashing |
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
| `JWT_SECRET` | A long random string. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

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

All todo routes require an authenticated session and only ever return the current user's tasks.

| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Create an account and start a session |
| POST | `/api/auth/login` | Log in |
| POST | `/api/auth/logout` | Log out |
| GET | `/api/auth/me` | Get the current user |
| GET | `/api/todos?view=&q=&category=` | List tasks (`view`: all, active, completed, trash) |
| POST | `/api/todos` | Create a task |
| PATCH | `/api/todos/:id` | Update a task |
| DELETE | `/api/todos/:id` | Move a task to the trash |
| POST | `/api/todos/:id/restore` | Restore a task from the trash |
| DELETE | `/api/todos/:id/permanent` | Permanently delete a task that is in the trash |

Errors always return `{ "error": "message" }`, with `fieldErrors` added for validation problems.

## Design decisions

- **Sessions in httpOnly cookies** rather than localStorage, so page scripts can never read the token.
- **Register logs you straight in.** There's no email verification step, so asking users to retype the details they just entered adds friction without adding security.
- **Undo instead of "Are you sure?" for trash**, because moving to the trash is reversible. Permanent deletion, which isn't, does ask for confirmation. The friction matches the risk.
- **Calendar export instead of in-app reminders.** Reliable reminders need scheduled server jobs and push notifications. Handing the task to the user's own calendar gives dependable reminders on every device, using a tool they already trust.
- **Server-side filtering and search**, so the database does the work and only the tasks being shown travel to the browser.
- **Filters in the URL**, so refreshing, sharing a link or using the back button all keep the same view.
- **One set of validation rules**, shared by the API and the forms, so the two can never disagree.
- **Login responses never reveal whether an email exists**: wrong email and wrong password return the same message.

## Project structure

See [`AGENTS.md`](./AGENTS.md) for the full structure, architecture rules and coding conventions.

## Author

Built by **Seyi Akinlabi** ([@Oluwaseyifunmixx](https://github.com/Oluwaseyifunmixx)) for the HNG Internship.