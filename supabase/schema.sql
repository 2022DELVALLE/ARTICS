-- ARTICS: snapshot del esquema final para una base Supabase nueva.
-- En el proyecto ARTICS se aplicaron las migraciones artics_initial_schema,
-- artics_policy_indexes y artics_demo_course_flag.
-- Para una base nueva, usar este archivo completo; no aplicar después
-- advisor_adjustments.sql ni demo_flag.sql.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  avatar_url text,
  bio text,
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now()
);

create table public.instructors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  bio text,
  avatar_url text,
  title text,
  signature_url text,
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories(id),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  instructor_id uuid not null references public.instructors(id),
  category_id uuid not null references public.categories(id),
  title text not null,
  slug text not null unique,
  subtitle text not null default '',
  description text not null default '',
  level text not null default 'Inicial' check (level in ('Inicial', 'Intermedio', 'Avanzado')),
  language text not null default 'es',
  price_cents integer not null default 0 check (price_cents >= 0),
  currency char(3) not null default 'PEN' check (currency = 'PEN'),
  thumbnail_url text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  is_demo boolean not null default false,
  learning_points text[] not null default '{}',
  requirements text[] not null default '{}',
  rating_avg numeric(2,1) not null default 0 check (rating_avg between 0 and 5),
  rating_count integer not null default 0 check (rating_count >= 0),
  students_count integer not null default 0 check (students_count >= 0),
  issues_certificate boolean not null default true,
  certificate_min_progress integer not null default 100 check (certificate_min_progress between 1 and 100),
  created_at timestamptz not null default now()
);

create table public.sections (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  position integer not null check (position >= 0),
  created_at timestamptz not null default now(),
  unique (course_id, position),
  unique (id, course_id)
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null,
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  position integer not null check (position >= 0),
  duration_seconds integer not null default 0 check (duration_seconds >= 0),
  is_free_preview boolean not null default false,
  created_at timestamptz not null default now(),
  unique (section_id, position),
  foreign key (section_id, course_id) references public.sections(id, course_id) on delete cascade
);

create table public.lesson_videos (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null unique references public.lessons(id) on delete cascade,
  video_id text not null,
  created_at timestamptz not null default now()
);

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null check (discount_type in ('percent', 'fixed')),
  value integer not null check (value > 0),
  valid_until timestamptz,
  max_uses integer check (max_uses > 0),
  used_count integer not null default 0 check (used_count >= 0),
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  total_cents integer not null check (total_cents >= 0),
  currency char(3) not null default 'PEN' check (currency = 'PEN'),
  provider text,
  provider_payment_id text unique,
  coupon_id uuid references public.coupons(id),
  created_at timestamptz not null default now(),
  unique (id, user_id)
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  course_id uuid not null references public.courses(id),
  price_cents integer not null check (price_cents >= 0),
  created_at timestamptz not null default now(),
  unique (order_id, course_id)
);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  course_id uuid not null references public.courses(id),
  order_id uuid,
  source text not null check (source in ('purchase', 'free', 'coupon', 'admin')),
  created_at timestamptz not null default now(),
  unique (user_id, course_id),
  unique (id, user_id, course_id),
  foreign key (order_id, user_id) references public.orders(id, user_id),
  check (source <> 'purchase' or order_id is not null)
);

create table public.lesson_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed boolean not null default false,
  last_position_seconds integer not null default 0 check (last_position_seconds >= 0),
  created_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  course_id uuid not null references public.courses(id),
  rating integer not null check (rating between 1 and 5),
  comment text not null default '',
  created_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create table public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, course_id)
);

create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  number text unique,
  user_id uuid not null references public.profiles(id),
  course_id uuid not null references public.courses(id),
  enrollment_id uuid not null unique,
  student_name text not null,
  course_title text not null,
  hours numeric(6,1) not null check (hours > 0),
  instructor_name text not null,
  pdf_path text,
  issued_at timestamptz not null default now(),
  revoked_at timestamptz,
  revoked_reason text,
  created_at timestamptz not null default now(),
  unique (user_id, course_id),
  foreign key (enrollment_id, user_id, course_id) references public.enrollments(id, user_id, course_id)
);

create index courses_category_status_idx on public.courses (category_id, status);
create index categories_parent_idx on public.categories (parent_id);
create index courses_instructor_idx on public.courses (instructor_id);
create index courses_search_idx on public.courses using gin (to_tsvector('spanish', title || ' ' || subtitle || ' ' || description));
create index sections_course_idx on public.sections (course_id);
create index lessons_course_idx on public.lessons (course_id);
create index lessons_section_course_idx on public.lessons (section_id, course_id);
create index orders_user_idx on public.orders (user_id);
create index orders_coupon_idx on public.orders (coupon_id);
create index order_items_course_idx on public.order_items (course_id);
create index enrollments_course_idx on public.enrollments (course_id);
create index enrollments_order_user_idx on public.enrollments (order_id, user_id);
create index lesson_progress_lesson_idx on public.lesson_progress (lesson_id);
create index reviews_course_idx on public.reviews (course_id);
create index favorites_course_idx on public.favorites (course_id);
create index certificates_course_idx on public.certificates (course_id);
create index certificates_enrollment_user_course_idx on public.certificates (enrollment_id, user_id, course_id);

create function private.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin');
$$;
revoke all on function private.is_admin() from public, anon, authenticated;
grant usage on schema private to anon, authenticated;
grant execute on function private.is_admin() to anon, authenticated;

create function private.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, left(coalesce(new.raw_user_meta_data ->> 'full_name', ''), 120));
  return new;
end;
$$;
revoke all on function private.handle_new_user() from public, anon, authenticated;
create trigger on_auth_user_created after insert on auth.users for each row execute function private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.instructors enable row level security;
alter table public.categories enable row level security;
alter table public.courses enable row level security;
alter table public.sections enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_videos enable row level security;
alter table public.coupons enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.reviews enable row level security;
alter table public.favorites enable row level security;
alter table public.certificates enable row level security;

-- Conceder acceso a cada tabla explícitamente: los proyectos nuevos pueden no exponer tablas automáticamente.
revoke all on public.profiles, public.instructors, public.categories, public.courses, public.sections, public.lessons, public.lesson_videos, public.coupons, public.orders, public.order_items, public.enrollments, public.lesson_progress, public.reviews, public.favorites, public.certificates from anon, authenticated;
grant select (id, full_name, avatar_url, bio, role, created_at) on public.profiles to authenticated;
grant update (full_name, avatar_url, bio) on public.profiles to authenticated;
grant select on public.instructors, public.categories, public.courses, public.sections, public.lessons, public.reviews to anon, authenticated;
grant insert, update, delete on public.instructors, public.categories, public.courses, public.sections, public.lessons, public.lesson_videos to authenticated;
grant select on public.lesson_videos to anon, authenticated;
grant select on public.orders, public.order_items, public.lesson_progress, public.favorites, public.certificates to authenticated;
grant select on public.enrollments to anon, authenticated;
grant insert, update on public.lesson_progress to authenticated;
grant insert, update, delete on public.reviews, public.favorites to authenticated;

create policy profiles_read_own on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy profiles_update_own on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy instructors_read on public.instructors for select to anon, authenticated using (
  exists (select 1 from public.courses c where c.instructor_id = instructors.id and c.status = 'published')
  or (select private.is_admin())
);
create policy instructors_admin_insert on public.instructors for insert to authenticated with check ((select private.is_admin()));
create policy instructors_admin_update on public.instructors for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy instructors_admin_delete on public.instructors for delete to authenticated using ((select private.is_admin()));
create policy categories_read on public.categories for select to anon, authenticated using (
  exists (select 1 from public.courses c where c.category_id = categories.id and c.status = 'published')
  or (select private.is_admin())
);
create policy categories_admin_insert on public.categories for insert to authenticated with check ((select private.is_admin()));
create policy categories_admin_update on public.categories for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy categories_admin_delete on public.categories for delete to authenticated using ((select private.is_admin()));
create policy courses_read on public.courses for select to anon, authenticated using (status = 'published' or (select private.is_admin()));
create policy courses_admin_insert on public.courses for insert to authenticated with check ((select private.is_admin()));
create policy courses_admin_update on public.courses for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy courses_admin_delete on public.courses for delete to authenticated using ((select private.is_admin()));
create policy sections_read on public.sections for select to anon, authenticated using (exists (select 1 from public.courses c where c.id = course_id and (c.status = 'published' or (select private.is_admin()))));
create policy sections_admin_insert on public.sections for insert to authenticated with check ((select private.is_admin()));
create policy sections_admin_update on public.sections for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy sections_admin_delete on public.sections for delete to authenticated using ((select private.is_admin()));
create policy lessons_read on public.lessons for select to anon, authenticated using (exists (select 1 from public.courses c where c.id = course_id and (c.status = 'published' or (select private.is_admin()))));
create policy lessons_admin_insert on public.lessons for insert to authenticated with check ((select private.is_admin()));
create policy lessons_admin_update on public.lessons for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy lessons_admin_delete on public.lessons for delete to authenticated using ((select private.is_admin()));
create policy lesson_videos_read on public.lesson_videos for select to anon, authenticated using (exists (
  select 1 from public.lessons l join public.courses c on c.id = l.course_id
  where l.id = lesson_id and c.status = 'published' and
    (l.is_free_preview or exists (select 1 from public.enrollments e where e.course_id = l.course_id and e.user_id = (select auth.uid())))
) or (select private.is_admin()));
create policy lesson_videos_admin_insert on public.lesson_videos for insert to authenticated with check ((select private.is_admin()));
create policy lesson_videos_admin_update on public.lesson_videos for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy lesson_videos_admin_delete on public.lesson_videos for delete to authenticated using ((select private.is_admin()));
create policy orders_read_own on public.orders for select to authenticated using (user_id = (select auth.uid()));
create policy order_items_read_own on public.order_items for select to authenticated using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = (select auth.uid())));
create policy enrollments_read_own on public.enrollments for select to authenticated using (user_id = (select auth.uid()));
create policy progress_read_own on public.lesson_progress for select to authenticated using (user_id = (select auth.uid()));
create policy progress_insert_own on public.lesson_progress for insert to authenticated with check (user_id = (select auth.uid()) and exists (
  select 1 from public.lessons l join public.enrollments e on e.course_id = l.course_id
  where l.id = lesson_id and e.user_id = (select auth.uid())
));
create policy progress_update_own on public.lesson_progress for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()) and exists (
  select 1 from public.lessons l join public.enrollments e on e.course_id = l.course_id
  where l.id = lesson_id and e.user_id = (select auth.uid())
));
create policy reviews_read on public.reviews for select to anon, authenticated using (exists (select 1 from public.courses c where c.id = course_id and c.status = 'published'));
create policy reviews_insert_enrolled on public.reviews for insert to authenticated with check (user_id = (select auth.uid()) and exists (select 1 from public.enrollments e where e.course_id = reviews.course_id and e.user_id = (select auth.uid())));
create policy reviews_update_own on public.reviews for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()) and exists (select 1 from public.enrollments e where e.course_id = reviews.course_id and e.user_id = (select auth.uid())));
create policy reviews_delete_own on public.reviews for delete to authenticated using (user_id = (select auth.uid()));
create policy favorites_own on public.favorites for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy certificates_read_own on public.certificates for select to authenticated using (user_id = (select auth.uid()));

create function private.refresh_course_stats() returns trigger language plpgsql security definer set search_path = '' as $$
declare affected uuid;
begin
  affected := case when tg_op = 'DELETE' then old.course_id else new.course_id end;
  update public.courses c set
    rating_avg = coalesce((select round(avg(r.rating)::numeric, 1) from public.reviews r where r.course_id = affected), 0),
    rating_count = (select count(*) from public.reviews r where r.course_id = affected),
    students_count = (select count(*) from public.enrollments e where e.course_id = affected)
  where c.id = affected;
  if tg_op = 'UPDATE' and old.course_id <> new.course_id then
    update public.courses c set
      rating_avg = coalesce((select round(avg(r.rating)::numeric, 1) from public.reviews r where r.course_id = old.course_id), 0),
      rating_count = (select count(*) from public.reviews r where r.course_id = old.course_id),
      students_count = (select count(*) from public.enrollments e where e.course_id = old.course_id)
    where c.id = old.course_id;
  end if;
  return null;
end;
$$;
revoke all on function private.refresh_course_stats() from public, anon, authenticated;
create trigger reviews_refresh_course_stats after insert or update or delete on public.reviews for each row execute function private.refresh_course_stats();
create trigger enrollments_refresh_course_stats after insert or update or delete on public.enrollments for each row execute function private.refresh_course_stats();

-- Cupones, pedidos, inscripciones y certificados solo se escriben desde servicios de servidor.
-- La verificación pública de certificados necesita un endpoint con límite por IP; no exponer SELECT anónimo.
