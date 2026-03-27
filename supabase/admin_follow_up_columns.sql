alter table public.form_submissions
add column if not exists outbound_called boolean default false;

alter table public.form_submissions
add column if not exists outbound_call_note text;

alter table public.form_submissions
add column if not exists disqualified boolean default false;

alter table public.form_submissions
add column if not exists no_need_follow_up boolean default false;
