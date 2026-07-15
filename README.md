# Shaykh Abu Ibrahim

Shaykh Abu Ibrahim is a multilingual Islamic academy platform built with Next.js, Prisma, NextAuth, and PostgreSQL/Neon.

It currently includes:

- public academy website
- admin management panel
- student dashboard
- teacher dashboard
- admissions and contact workflows
- course, blog, and book management
- enrollment flow
- certificate issuing and verification

## Stack

- Next.js 16 App Router
- React 19
- Prisma 7
- NextAuth credentials authentication
- PostgreSQL / Neon
- CSS Modules

## Local Setup

1. Install dependencies

```bash
npm install
```

2. Add environment variables in `.env`

Typical values:

```bash
DATABASE_URL=
POSTGRES_PRISMA_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
NEXT_PUBLIC_APP_URL=
SUPER_ADMIN_EMAIL=
SUPER_ADMIN_PASSWORD=
SUPER_ADMIN_NAME=
```

3. Generate Prisma client

```bash
npm run db:generate
```

4. Push schema

```bash
npm run db:push
```

5. Seed data if required

```bash
npm run db:seed-admin
npm run db:seed-academy
```

6. Start local server

```bash
npm run dev
```

## Main Routes

- `/` homepage
- `/courses` public course listing
- `/books` public book listing
- `/blog` public articles
- `/teachers` teacher listing
- `/admission` admission form
- `/contact` contact form
- `/login` role-based login
- `/admin` admin panel
- `/student` student dashboard
- `/teacher` teacher dashboard
- `/certificates/[verificationId]` certificate verification

## Current Product State

Implemented:

- multilingual public UI
- DB-backed admissions, contact submissions, certificates
- admin CRUD for blogs, books, and courses
- public search
- enrollment flow
- certificate issue + verification flow

Still evolving:

- richer teacher workflows
- teacher management workspace
- media upload pipeline
- lesson / quiz / assignment management UI
- full database-only content with no fallback/static merge
