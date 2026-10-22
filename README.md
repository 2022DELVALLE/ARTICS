# ARTICS

Academia de cursos con Vite, React, TypeScript y pnpm. Diseño responsive con la gama `#40E0D0` (50–950), tomando como referencia `GUIA_RESPONSIVE.md`.

## Desarrollo local

```bash
pnpm install
pnpm dev
```

El proyecto Supabase ARTICS ya está conectado en esta instalación mediante `.env.local`, ignorado por Git. En otra instalación, copia `.env.example` a `.env.local` y coloca únicamente la URL y la clave **publishable** pública. Reinicia Vite. `@supabase/ssr` guarda la sesión en cookies del navegador. No coloques `service_role`, claves secretas ni credenciales de pago en variables `VITE_`.

```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=TU_CLAVE_PUBLICA
```

Con esas variables, la página `/cuenta` permite registro, inicio y cierre de sesión; `/cursos` lee exclusivamente cursos publicados; `/mis-cursos` consulta las inscripciones del usuario. El catálogo remoto contiene diez cursos de ejemplo identificados como tales. Sin variables, el catálogo ilustrativo local sigue disponible. El carrito permanece local y **no procesa pagos**.

## Base de datos

El proyecto ARTICS (`zwexzqykpdlyyoaavnym`) recibió las migraciones remotas `artics_initial_schema`, `artics_policy_indexes` y `artics_demo_course_flag`. [`supabase/schema.sql`](supabase/schema.sql) es el **snapshot final** para una base nueva; [`supabase/advisor_adjustments.sql`](supabase/advisor_adjustments.sql) y [`supabase/demo_flag.sql`](supabase/demo_flag.sql) documentan los cambios incrementales ya incluidos en él. **No ejecutes esos archivos incrementales después del snapshot.** El esquema incluye perfiles, catálogo, lecciones, pedidos, inscripciones, progreso, favoritos, reseñas y certificados. Las 15 tablas públicas tienen RLS, 38 políticas, privilegios explícitos y un trigger que crea el perfil al registrarse. Los tipos generados están en [`src/lib/database.types.ts`](src/lib/database.types.ts). Las credenciales de servidor no están en este repositorio.

[`supabase/demo_seed.sql`](supabase/demo_seed.sql) carga datos de ejemplo y puede ejecutarse otra vez sin duplicarlos: 4 categorías, 4 instructores ficticios, 10 cursos publicados y marcados `is_demo`, 30 secciones, 90 lecciones con título y duración, y un cupón caducado de muestra. Las lecciones no incluyen video ni contenido. No se crean perfiles, pedidos, inscripciones, progreso, reseñas ni certificados: esos registros dependen de usuarios y acciones reales.

Antes de ponerlo en producción:

1. Verificar las políticas con sesiones anónima, estudiante y administrador. La comprobación estructural de RLS no sustituye esas pruebas.
2. Configurar las URLs permitidas de Auth y probar confirmación por correo, inicio y cierre de sesión.
3. Promover la primera cuenta administradora desde un canal seguro de servidor; el navegador no puede modificar `role`.
4. Sustituir los cursos de ejemplo por cursos y contenido real antes de venderlos.
5. Incorporar la migración remota al flujo local de Supabase CLI antes de crear más migraciones. La CLI no quedó instalada en esta sesión.

## Estructura

- `src/features/auth`: cliente de Auth y contexto de sesión.
- `src/features/courses`: modelo Zod, datos ilustrativos y consulta de cursos publicados e inscripciones.
- `src/features/cart`: carrito local.
- `src/shared/notices`: catálogo central de avisos y alertas por clave, preparado para traducirse.
- `src/styles`: tokens, estructura y reglas responsive.

## Límites actuales

El checkout, la reproducción de video y la emisión y verificación **real** de certificados necesitan funciones de servidor, proveedor y pruebas antes de habilitarse. El código `ARTICS-DEMO-2026` que muestra la interfaz es solo una vista de muestra; el cupón `ARTICS-DEMO-EXPIRADO` cargado en la base está caducado. Los precios de los cursos de ejemplo son ilustrativos y no se pueden pagar desde la interfaz. La página de verificación lleva datos ficticios y no consulta certificados reales. La estrategia de SEO, textos legales y despliegue de producción también siguen pendientes.

Los servicios deben mantenerse en planes gratuitos. El proyecto se creó con costo confirmado de US$0/mes y sin configurar facturación adicional. Supabase Free tiene cuotas de almacenamiento y puede pausar proyectos inactivos. **Vercel Hobby restringe el uso comercial**, por lo que el plan original de alojar allí una academia que vende cursos no cumple el requisito de gratuidad. Para pruebas se puede usar una plataforma estática gratuita; antes de vender cursos hay que elegir y verificar un alojamiento que permita ese uso en su plan gratuito. No se ha hecho un despliegue.

## Comprobación local

```bash
pnpm lint
pnpm build
```
