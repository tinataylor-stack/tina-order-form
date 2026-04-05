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
- Internal follow-up table page at `/admin/follow-up`
- API routes under `/app/api`
- Shared helpers under `/lib`
- Shared admin submission type in `/app/admin/types.ts`

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
- When changing course names, tiers, or prices on the first step in [app/form/page.tsx](/Users/tinasomchit-taylor/Desktop/my-form-app/app/form/page.tsx), do not change unrelated form logic.
- Keep secrets server-side only. Never expose the service role key in client code.

## Architecture Rules

- Keep interactive UI in client components only when needed.
- Keep server-only logic in route handlers or `lib/`.
- Use `lib/supabase.ts` only for client-safe usage with public env vars. Do not use it for form submission writes.
- Use `lib/supabase-admin.ts` only for server-side actions that require elevated access.
- Keep admin session logic centralized in `lib/admin-session.ts`.
- Avoid mixing validation, normalization, and rendering concerns in the same helper unless the coupling is intentional.
- Prefer straightforward data mapping over abstractions for this small app.
- Keep `form_submissions` protected by Supabase Row Level Security. Do not add `anon` access unless there is a clear product reason and the scope is narrowly defined.
- Keep the `signatures` bucket private. Admin access to signature files should use short-lived signed URLs generated on the server.

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
- If `outbound_called`, `outbound_call_note`, or `disqualified` change, update all connected layers together:
  - `/app/admin/AdminSubmissionsList.tsx`
  - `/app/admin/follow-up/FollowUpTable.tsx`
  - `/app/api/admin-follow-up/route.ts`
  - Supabase schema or migration files
- Hidden submissions should stay excluded from `/admin/follow-up` unless the product requirement changes.

## Build Notes

- Main scripts are:
  - `npm run dev`
  - `npm run lint`
  - `npm run build`
  - `npm run start`
- Run `npm run lint` after meaningful code changes.
- Run `npm run build` before closing larger changes or routing/data-flow changes.
- When changing submission or storage security behavior, verify both the public form submission flow and admin signature viewing flow.

## Things To Avoid

- do not rewrite working form flow without a clear product reason
- do not silently change the Supabase field mapping
- do not move server secrets into client components
- do not weaken RLS or make the `signatures` bucket public without a clear product requirement
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
- [app/admin/follow-up/page.tsx](/Users/tinasomchit-taylor/Desktop/my-form-app/app/admin/follow-up/page.tsx)
- [app/admin/follow-up/FollowUpTable.tsx](/Users/tinasomchit-taylor/Desktop/my-form-app/app/admin/follow-up/FollowUpTable.tsx)
- [app/admin/types.ts](/Users/tinasomchit-taylor/Desktop/my-form-app/app/admin/types.ts)
- [app/admin-login/page.tsx](/Users/tinasomchit-taylor/Desktop/my-form-app/app/admin-login/page.tsx)
- [app/api/admin-login/route.ts](/Users/tinasomchit-taylor/Desktop/my-form-app/app/api/admin-login/route.ts)
- [app/api/admin-hide/route.ts](/Users/tinasomchit-taylor/Desktop/my-form-app/app/api/admin-hide/route.ts)
- [app/api/admin-follow-up/route.ts](/Users/tinasomchit-taylor/Desktop/my-form-app/app/api/admin-follow-up/route.ts)
- [lib/admin-session.ts](/Users/tinasomchit-taylor/Desktop/my-form-app/lib/admin-session.ts)
- [lib/supabase.ts](/Users/tinasomchit-taylor/Desktop/my-form-app/lib/supabase.ts)
- [lib/supabase-admin.ts](/Users/tinasomchit-taylor/Desktop/my-form-app/lib/supabase-admin.ts)
- [lib/uploadSignature.ts](/Users/tinasomchit-taylor/Desktop/my-form-app/lib/uploadSignature.ts)
- [proxy.ts](/Users/tinasomchit-taylor/Desktop/my-form-app/proxy.ts)
- [supabase/admin_follow_up_columns.sql](/Users/tinasomchit-taylor/Desktop/my-form-app/supabase/admin_follow_up_columns.sql)

## Environment Notes

- `ADMIN_PAGE_PASSWORD` and `ADMIN_SESSION_SECRET` should both be set explicitly.
- Both admin secrets should be long, random, and kept private.
- Do not rely on the fallback from `ADMIN_SESSION_SECRET` to `ADMIN_PAGE_PASSWORD` unless there is a short-term local-only reason.

## Current Incomplete Areas

- project documentation was missing before this file was added
- starter metadata and README still need cleanup
- no automated tests yet
- server-side validation can be stronger
- admin workflow is better than before but still does not support export, search, or richer operations tooling
