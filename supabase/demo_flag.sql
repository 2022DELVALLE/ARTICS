-- Marca los cursos ilustrativos para que la interfaz no los presente como oferta real.
alter table public.courses add column is_demo boolean not null default false;
