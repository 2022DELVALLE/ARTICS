-- Aplicado después de artics_initial_schema para resolver avisos de índices y políticas.
drop index if exists public.lessons_section_idx;
create index categories_parent_idx on public.categories (parent_id);
create index courses_instructor_idx on public.courses (instructor_id);
create index lessons_section_course_idx on public.lessons (section_id, course_id);
create index orders_coupon_idx on public.orders (coupon_id);
create index enrollments_order_user_idx on public.enrollments (order_id, user_id);
create index certificates_enrollment_user_course_idx on public.certificates (enrollment_id, user_id, course_id);

drop policy instructors_admin_write on public.instructors;
drop policy categories_admin_write on public.categories;
drop policy courses_admin_write on public.courses;
drop policy sections_admin_write on public.sections;
drop policy lessons_admin_write on public.lessons;
drop policy lesson_videos_admin_write on public.lesson_videos;

create policy instructors_admin_insert on public.instructors for insert to authenticated with check ((select private.is_admin()));
create policy instructors_admin_update on public.instructors for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy instructors_admin_delete on public.instructors for delete to authenticated using ((select private.is_admin()));
create policy categories_admin_insert on public.categories for insert to authenticated with check ((select private.is_admin()));
create policy categories_admin_update on public.categories for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy categories_admin_delete on public.categories for delete to authenticated using ((select private.is_admin()));
create policy courses_admin_insert on public.courses for insert to authenticated with check ((select private.is_admin()));
create policy courses_admin_update on public.courses for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy courses_admin_delete on public.courses for delete to authenticated using ((select private.is_admin()));
create policy sections_admin_insert on public.sections for insert to authenticated with check ((select private.is_admin()));
create policy sections_admin_update on public.sections for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy sections_admin_delete on public.sections for delete to authenticated using ((select private.is_admin()));
create policy lessons_admin_insert on public.lessons for insert to authenticated with check ((select private.is_admin()));
create policy lessons_admin_update on public.lessons for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy lessons_admin_delete on public.lessons for delete to authenticated using ((select private.is_admin()));
create policy lesson_videos_admin_insert on public.lesson_videos for insert to authenticated with check ((select private.is_admin()));
create policy lesson_videos_admin_update on public.lesson_videos for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy lesson_videos_admin_delete on public.lesson_videos for delete to authenticated using ((select private.is_admin()));
