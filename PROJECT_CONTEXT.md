# PROJECT_CONTEXT.md

## Project Summary

This project is a Thai-language registration and order intake app for digital courses and products.

Users fill out a multi-step form, confirm terms, provide a signature, and submit their details. The backend stores the submission in Supabase and uploads the signature image to a private Supabase Storage bucket. An internal admin page lets the team review submissions, focus on invoice requests, and hide records from the active list.

## What Is Built

- Public registration flow at `/form`
  - 8-step multi-step form
  - course selection, including tiered options for selected products
  - first-step course options currently include:
    - `Claude COWORK - Live Session`
    - `Make It Sell In 30 Days | เริ่มมีลูกค้าและขายได้จริงใน 30 วัน`
    - `คอร์ส Quick Content`
    - `Ebook Ai สำหรับเด็ก`
    - `อื่น ๆ โปรดระบุ`
  - `Make It Sell In 30 Days | เริ่มมีลูกค้าและขายได้จริงใน 30 วัน` currently has these tier options:
    - `แบบวางแผนให้ 499 บาท`
    - `แบบเอาจริง 2,990 บาท`
    - `แบบใกล้ชิด 29,990 บาท`
  - buyer contact details
  - payment method
  - birth date picker
  - occupation capture
  - conditional business-description step for business owners
  - conditional tax invoice flow for personal and company invoice details
  - terms acceptance checkbox
  - signature capture before final submit
- Submission pipeline
  - client validates each step before advancing
  - final submit posts JSON to `/api/submit-form`
  - backend uploads signature PNG to private Supabase Storage bucket `signatures`
  - backend inserts a row into `form_submissions` using the server-side service-role client
- Thank-you flow
  - redirects to `/thank-you`
  - shows the user's nickname when available
- Admin flow
  - password-protected login at `/admin-login`
  - cookie-based admin session
  - protected admin page at `/admin`
  - collapsible submission list
  - filters for all, invoice-only, and hidden records
  - hide/unhide action for submissions
  - closer follow-up panel inside each expanded admin record
  - follow-up fields for outbound called, outbound call note, disqualified, and no-follow-up
  - separate follow-up table at `/admin/follow-up`
  - follow-up table excludes records hidden from the main admin page
  - signature previews in admin are served through short-lived signed URLs
  - follow-up table supports these status options:
    - followed up
    - disqualified
    - both
    - no follow-up
  - auto-save behavior on the follow-up table:
    - status saves immediately on change
    - note saves automatically after a short pause
  - dark-mode readability protection for editable controls

## Current Architecture

### Frontend

- Next.js 16 App Router
- React 19
- TypeScript
- TailwindCSS v4
- Client components for the interactive form and admin list
- Additional client component for the follow-up operations table

### Backend

- Next.js route handlers under `app/api`
- Supabase JavaScript client
- server-side service-role Supabase client for admin reads, form submission writes, and signature uploads
- private Supabase Storage bucket for signatures
- Custom admin cookie session using HMAC signing via Web Crypto
- signed Storage URLs generated on the server for admin signature access

### Security Posture

- `form_submissions` is expected to have Row Level Security enabled in Supabase
- public browser clients should not write directly to `form_submissions`
- the public form submits to `/api/submit-form`, and the server writes to Supabase
- the `signatures` bucket is expected to be private
- admin signature access is expected to use short-lived signed URLs

### Data Flow

1. User lands on `/` and is redirected to `/form`
2. User completes the step-based form in the browser
3. Frontend validates required fields before moving to the next step
4. On final submit, frontend converts the signature to base64 and posts the full payload to `/api/submit-form`
5. Backend normalizes a few fields such as payment method and occupation
6. Backend uploads the signature image to the private `signatures` bucket and stores the object path
7. Backend inserts the submission into `form_submissions` using the server-side service-role client
8. Frontend redirects the user to `/thank-you?nickname=...`
9. Admin logs in through `/admin-login`
10. Backend sets a signed `admin-session` cookie
11. Middleware-like protection in `proxy.ts` gates access to `/admin`
12. Admin page reads all `form_submissions` rows and converts any stored signature reference into a short-lived signed URL
13. Team can save follow-up status and note from the closer panel in `/admin`
14. Team can use `/admin/follow-up` to review non-hidden leads in a table and update status/note from one place

## Database Shape

### `form_submissions`

This table is expected to store:

- basic buyer info
  - `name`
  - `first_name`
  - `last_name`
  - `nickname`
  - `email`
  - `phone`
- order details
  - `course`
  - `payment_method`
- profile details
  - `birth_date`
  - `occupation`
  - `business_description`
- invoice details
  - `wants_invoice`
  - `invoice_type`
  - `personal_tax_name`
  - `personal_tax_id`
  - `personal_address`
  - `personal_invoice_email`
  - `company_name`
  - `company_tax_id`
  - `company_address`
  - `company_invoice_email`
  - `company_contact_name`
  - `company_contact_phone`
- compliance and admin fields
  - `accepted_terms`
  - `signature_url`
  - `is_hidden_in_admin`
  - `outbound_called`
  - `outbound_call_note`
  - `disqualified`
  - `no_need_follow_up`
  - timestamps such as `created_at`

## Key Files

- [app/form/page.tsx](/Users/tinasomchit-taylor/Desktop/my-form-app/app/form/page.tsx)
  - main client-side multi-step registration flow and validation
- [components/BirthDatePicker.tsx](/Users/tinasomchit-taylor/Desktop/my-form-app/components/BirthDatePicker.tsx)
  - reusable date picker for birth date input with explicit readable text styling
- [app/api/submit-form/route.ts](/Users/tinasomchit-taylor/Desktop/my-form-app/app/api/submit-form/route.ts)
  - receives final form submission, uploads signature, and inserts the row using the server-side service-role client
- [lib/uploadSignature.ts](/Users/tinasomchit-taylor/Desktop/my-form-app/lib/uploadSignature.ts)
  - converts base64 signature input into a stored object in the private `signatures` bucket and returns the object path
- [app/admin-login/page.tsx](/Users/tinasomchit-taylor/Desktop/my-form-app/app/admin-login/page.tsx)
  - password login UI for admins
- [app/api/admin-login/route.ts](/Users/tinasomchit-taylor/Desktop/my-form-app/app/api/admin-login/route.ts)
  - validates admin password and sets session cookie
- [lib/admin-session.ts](/Users/tinasomchit-taylor/Desktop/my-form-app/lib/admin-session.ts)
  - HMAC-based admin session token creation and verification
- [proxy.ts](/Users/tinasomchit-taylor/Desktop/my-form-app/proxy.ts)
  - protects `/admin` and redirects authenticated admins away from `/admin-login`
- [app/admin/page.tsx](/Users/tinasomchit-taylor/Desktop/my-form-app/app/admin/page.tsx)
  - server-rendered admin entry page that fetches submissions and creates signed signature URLs for admin viewing
- [app/admin/AdminSubmissionsList.tsx](/Users/tinasomchit-taylor/Desktop/my-form-app/app/admin/AdminSubmissionsList.tsx)
  - admin filtering, hide/unhide controls, submission detail rendering, and closer follow-up panel
- [app/admin/follow-up/page.tsx](/Users/tinasomchit-taylor/Desktop/my-form-app/app/admin/follow-up/page.tsx)
  - server-rendered follow-up page for table-based review of non-hidden leads
- [app/admin/follow-up/FollowUpTable.tsx](/Users/tinasomchit-taylor/Desktop/my-form-app/app/admin/follow-up/FollowUpTable.tsx)
  - table UI for follow-up status and note editing with auto-save behavior and multiple status options
- [app/admin/types.ts](/Users/tinasomchit-taylor/Desktop/my-form-app/app/admin/types.ts)
  - shared submission type used by admin surfaces
- [app/api/admin-hide/route.ts](/Users/tinasomchit-taylor/Desktop/my-form-app/app/api/admin-hide/route.ts)
  - updates `is_hidden_in_admin` for a submission
- [app/api/admin-follow-up/route.ts](/Users/tinasomchit-taylor/Desktop/my-form-app/app/api/admin-follow-up/route.ts)
  - saves closer follow-up fields for a submission
- [app/globals.css](/Users/tinasomchit-taylor/Desktop/my-form-app/app/globals.css)
  - global styling, including readable light styling for editable controls
- [lib/supabase.ts](/Users/tinasomchit-taylor/Desktop/my-form-app/lib/supabase.ts)
  - client-safe Supabase client for public env usage only
- [lib/supabase-admin.ts](/Users/tinasomchit-taylor/Desktop/my-form-app/lib/supabase-admin.ts)
  - service-role client used for admin reads and storage writes
- [supabase/admin_follow_up_columns.sql](/Users/tinasomchit-taylor/Desktop/my-form-app/supabase/admin_follow_up_columns.sql)
  - SQL for adding closer follow-up columns to `form_submissions`

## Environment Variables

Expected local environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PAGE_PASSWORD=
ADMIN_SESSION_SECRET=
```

Notes:

- `ADMIN_SESSION_SECRET` falls back to `ADMIN_PAGE_PASSWORD` if not set
- do not commit real values

## Current Goal

The current goal is to run this as a practical production intake tool for course purchases and invoice collection, with lightweight internal follow-up workflow support for the closer team and a safer default security posture for customer and signature data.

Current working priorities visible in the codebase are:

- keep the registration flow smooth for Thai-speaking users
- collect complete contact, invoice, and signature data accurately
- let admins review submissions, hide records from active views, and manage follow-up status
- keep submission writes server-side and keep signature files private
- keep editable controls readable when the browser prefers dark mode
- support periodic updates to the course selection text on the first step of the form when offerings or pricing change

## What Is Incomplete

- `README.md` and app metadata still use starter Next.js defaults
- there are no automated tests
- server-side validation is lighter than the client-side form validation
- admin auth is simple password plus signed cookie, not a full user system
- there is no export/reporting workflow yet for operations or accounting

## Important Notes

- User-facing form copy is primarily Thai and should stay natural and easy to understand
- Keep frontend-only env vars separate from server-only secrets
- Do not expose the service role key to the client
- `ADMIN_PAGE_PASSWORD` and `ADMIN_SESSION_SECRET` should both be set explicitly and kept private
- Changes to form fields should be kept in sync with the Supabase table shape and admin UI
- Changes to course options or pricing on the first step should be updated carefully in `app/form/page.tsx`
- Changes to invoice-related fields should be checked across:
  - form step logic
  - submit API mapping
  - admin display
- Changes to follow-up fields should be checked across:
  - admin closer panel
  - `/admin/follow-up`
  - `/api/admin-follow-up`
  - Supabase column definitions
- Editable controls are intentionally protected with explicit light styling for readability in browser dark mode
- Signature handling depends on the Supabase Storage bucket `signatures` existing, being private, and supporting signed URL access from the server
