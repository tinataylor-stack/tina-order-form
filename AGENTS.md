# AGENTS.md

## Repo Purpose

This repo is a Thai-language course registration and order intake app that:

- collects buyer details
- captures invoice information when needed
- saves submissions in Supabase
- uploads signature images to Supabase Storage
- lets admins review and manage submissions in a simple internal dashboard

## Tech Stack

- Next.js App Router
- React 19
- TypeScript
- TailwindCSS v4
- Supabase JavaScript client
- Supabase Storage

## Current Product Shape

- Public form at `/form`
- Thank-you page at `/thank-you`
- Admin login at `/admin-login`
- Internal admin review page at `/admin`
- API routes under `/app/api`
- Shared helpers under `/lib`

## Working Rules

- Read [PROJECT_CONTEXT.md](/Users/tinasomchit-taylor/Desktop/my-form-app/PROJECT_CONTEXT.md) first at the start of a new session.
- Keep changes small and targeted.
- Follow existing App Router patterns already used in this repo.
- Keep user-facing Thai copy natural and easy to scan.
- Do not introduce new dependencies unless they clearly simplify the product.
- When changing form fields, update all connected layers together:
  - form UI
  - submit route
  - Supabase write shape
  - admin display
- Keep secrets server-side only. Never expose the service role key in client code.

## Architecture Rules

- Keep interactive UI in client components only when needed.
- Keep server-only logic in route handlers or `lib/`.
- Use `lib/supabase.ts` only for client-safe usage with public env vars.
- Use `lib/supabase-admin.ts` only for server-side actions that require elevated access.
- Keep admin session logic centralized in `lib/admin-session.ts`.
- Avoid mixing validation, normalization, and rendering concerns in the same helper unless the coupling is intentional.
- Prefer straightforward data mapping over abstractions for this small app.

## Coding Standards

- Use TypeScript throughout.
- Prefer simple functional React components.
- Keep branching form logic readable and explicit.
- Prefer small helper functions over dense nested conditionals where possible.
- Handle error cases clearly in API routes.
- Preserve existing field names unless the database and admin UI are updated together.

## UI Language Rules

All user-facing Thai should be:

- natural
- clear
- simple
- non-technical where possible

Applies to:

- form questions
- helper text
- validation messages
- admin labels used by Thai-speaking staff

## Data & API Rules

- Validate request input before writing to Supabase.
- Keep client-safe and server-only concerns separated.
- Do not hardcode secrets or private URLs.
- Be careful with invoice-related data because it affects accounting workflows.
- Be careful with signature handling because it affects both storage and admin review.

## Build Notes

- Main scripts are:
  - `npm run dev`
  - `npm run lint`
  - `npm run build`
  - `npm run start`
- Run `npm run lint` after meaningful code changes.
- Run `npm run build` before closing larger changes or routing/data-flow changes.

## Things To Avoid

- do not rewrite working form flow without a clear product reason
- do not silently change the Supabase field mapping
- do not move server secrets into client components
- do not add unnecessary state management libraries
- do not leave form, API, and admin views out of sync
- do not replace simple explicit logic with clever abstractions

## When Unsure

If a task:

- changes the submission schema
- changes invoice behavior
- changes admin auth
- introduces a new dependency
- changes the storage strategy for signatures

pause and propose the smallest safe path before implementing

## Key Files

- [PROJECT_CONTEXT.md](/Users/tinasomchit-taylor/Desktop/my-form-app/PROJECT_CONTEXT.md)
- [app/form/page.tsx](/Users/tinasomchit-taylor/Desktop/my-form-app/app/form/page.tsx)
- [components/BirthDatePicker.tsx](/Users/tinasomchit-taylor/Desktop/my-form-app/components/BirthDatePicker.tsx)
- [app/api/submit-form/route.ts](/Users/tinasomchit-taylor/Desktop/my-form-app/app/api/submit-form/route.ts)
- [app/admin/page.tsx](/Users/tinasomchit-taylor/Desktop/my-form-app/app/admin/page.tsx)
- [app/admin/AdminSubmissionsList.tsx](/Users/tinasomchit-taylor/Desktop/my-form-app/app/admin/AdminSubmissionsList.tsx)
- [app/admin-login/page.tsx](/Users/tinasomchit-taylor/Desktop/my-form-app/app/admin-login/page.tsx)
- [app/api/admin-login/route.ts](/Users/tinasomchit-taylor/Desktop/my-form-app/app/api/admin-login/route.ts)
- [app/api/admin-hide/route.ts](/Users/tinasomchit-taylor/Desktop/my-form-app/app/api/admin-hide/route.ts)
- [lib/admin-session.ts](/Users/tinasomchit-taylor/Desktop/my-form-app/lib/admin-session.ts)
- [lib/supabase.ts](/Users/tinasomchit-taylor/Desktop/my-form-app/lib/supabase.ts)
- [lib/supabase-admin.ts](/Users/tinasomchit-taylor/Desktop/my-form-app/lib/supabase-admin.ts)
- [lib/uploadSignature.ts](/Users/tinasomchit-taylor/Desktop/my-form-app/lib/uploadSignature.ts)
- [proxy.ts](/Users/tinasomchit-taylor/Desktop/my-form-app/proxy.ts)

## Current Incomplete Areas

- project documentation was missing before this file was added
- starter metadata and README still need cleanup
- no automated tests yet
- server-side validation can be stronger
- admin workflow is basic and does not yet support export, search, or richer operations tooling
