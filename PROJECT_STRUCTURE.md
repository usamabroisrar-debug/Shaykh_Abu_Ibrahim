# Project Structure

## Root
- `prisma/`
  Database schema and Prisma models.
- `prisma.config.ts`
  Prisma 7 datasource configuration.
- `src/`
  Full application source.

## `src/app`
- `(public)/`
  Public marketing and discovery routes.
- `(auth)/`
  Login, register, forgot/reset password.
- `(student)/`, `(teacher)/`, `(admin)/`
  Role-based dashboard entry routes.
- `api/`
  App Router API area if needed later.

## `src/pages/api`
- Auth and mutation endpoints used by the current app.
- Keep request validation in route files, but business logic in `src/services`.

## `src/services`
- `auth/`
  Account registration and password reset logic.
- `admission/`
  Admission creation and listing logic.
- `contact/`
  Contact submission persistence.
- `course/`
  Course database access helpers.
- `dashboard/`
  Dashboard aggregation queries for all roles.
- `enrollment/`
  Enrollment creation/update logic.
- `search/`
  Website-wide search aggregation.

## `src/lib`
- Shared technical adapters and app-level helpers.
- `prisma.ts`
  Prisma client singleton.
- `auth.ts`
  NextAuth configuration and session shaping.
- `dashboard.ts`, `search.ts`
  Thin re-export layer for compatibility.

## `src/providers`
- App-level React providers such as `SessionProvider`.

## `src/hooks`
- Reusable client hooks such as live site search.

## `src/middleware`
- Route access rules and middleware support config.

## `src/types`
- Shared TypeScript types for API, auth, and app models.

## `src/utils`
- Pure utility helpers such as formatters.

## Rule of Thumb
- Database query logic: `src/services`
- Framework setup logic: `src/lib`
- Request handlers: `src/pages/api`
- UI state and hooks: `src/hooks`
- Global providers: `src/providers`
