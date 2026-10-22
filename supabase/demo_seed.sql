-- Datos de demostración para ARTICS. Idempotente; no crea usuarios ni ventas ficticias.
-- Todos los cursos se publican con is_demo=true y certificados desactivados.
do $artics_seed$
declare
  item jsonb;
  module_item jsonb;
  lesson_title text;
  category_id_value uuid;
  instructor_id_value uuid;
  course_id_value uuid;
  section_id_value uuid;
  section_position integer;
  lesson_position integer;
begin
  insert into public.categories (name, slug) values
    ('Diseño', 'diseno'), ('Tecnología', 'tecnologia'),
    ('Negocios', 'negocios'), ('Marketing', 'marketing')
  on conflict (slug) do nothing;

  insert into public.instructors (name, title, bio)
  select team.name, 'Equipo académico de ejemplo', 'Perfil ilustrativo de ARTICS; no representa a un docente contratado.'
  from (values ('Equipo de Diseño ARTICS'), ('Equipo de Tecnología ARTICS'),
               ('Equipo de Negocios ARTICS'), ('Equipo de Marketing ARTICS')) as team(name)
  where not exists (select 1 from public.instructors i where i.name = team.name);

  for item in select value from jsonb_array_elements('[{"slug":"diseno-de-experiencias-digitales","title":"Diseño de experiencias digitales","subtitle":"De una necesidad real a una interfaz fácil de usar.","category":"diseno","instructor":"Equipo de Diseño ARTICS","level":"Inicial","price_cents":18900,"minutes":20,"description":"Aprende a ordenar ideas, definir flujos y validar prototipos de productos digitales.","points":["Formular problemas de diseño","Crear flujos y prototipos","Preparar una prueba de usabilidad"],"requirements":["Manejo básico de un navegador"],"modules":[["Entender el problema",["Qué es una experiencia digital","Necesidades y contexto","Definir el problema"]],["Diseñar la solución",["Arquitectura de información","Wireframes","Prototipos interactivos"]],["Validar y mejorar",["Pruebas de usabilidad","Sintetizar hallazgos","Presentar decisiones"]]]},{"slug":"identidad-visual-para-marcas","title":"Identidad visual para marcas","subtitle":"Construye un sistema visual coherente y memorable.","category":"diseno","instructor":"Equipo de Diseño ARTICS","level":"Inicial","price_cents":16900,"minutes":18,"description":"Explora los fundamentos de color, tipografía y composición para definir una identidad de marca.","points":["Traducir una estrategia en decisiones visuales","Crear una paleta y sistema tipográfico","Documentar reglas de uso"],"requirements":["Interés por el diseño visual"],"modules":[["Fundamentos de marca",["Propósito y personalidad","Referencias visuales","Concepto creativo"]],["Sistema visual",["Color y contraste","Tipografía","Composición y recursos"]],["Aplicación",["Piezas de ejemplo","Consistencia entre formatos","Guía de marca"]]]},{"slug":"investigacion-ux-practica","title":"Investigación UX práctica","subtitle":"Escucha a las personas y diseña con evidencia.","category":"diseno","instructor":"Equipo de Diseño ARTICS","level":"Intermedio","price_cents":19900,"minutes":22,"description":"Planifica entrevistas, organiza observaciones y convierte hallazgos en oportunidades de producto.","points":["Preparar un plan de investigación","Conducir entrevistas claras","Priorizar hallazgos accionables"],"requirements":["Conocimientos básicos de producto digital"],"modules":[["Planificar",["Preguntas de investigación","Seleccionar participantes","Guion de entrevista"]],["Investigar",["Escucha activa","Notas y observaciones","Ética y consentimiento"]],["Sintetizar",["Agrupar hallazgos","Oportunidades de diseño","Comunicar resultados"]]]},{"slug":"desarrollo-web-moderno","title":"Desarrollo web moderno","subtitle":"Crea interfaces rápidas, accesibles y adaptables.","category":"tecnologia","instructor":"Equipo de Tecnología ARTICS","level":"Intermedio","price_cents":24900,"minutes":25,"description":"Recorre HTML, CSS, TypeScript y React para construir la base de una aplicación web.","points":["Estructurar interfaces semánticas","Crear diseños responsive","Organizar componentes React"],"requirements":["Conocer JavaScript básico"],"modules":[["Base de la web",["HTML semántico","CSS adaptable","TypeScript esencial"]],["React en práctica",["Componentes","Estado y eventos","Rutas"]],["Calidad y entrega",["Accesibilidad","Pruebas útiles","Compilar y publicar"]]]},{"slug":"datos-para-tomar-decisiones","title":"Datos para tomar decisiones","subtitle":"Transforma tablas en preguntas, hallazgos y acciones.","category":"tecnologia","instructor":"Equipo de Tecnología ARTICS","level":"Inicial","price_cents":19900,"minutes":21,"description":"Un recorrido introductorio para limpiar datos, explorarlos y explicar resultados sin perder contexto.","points":["Revisar la calidad de un conjunto de datos","Elegir gráficos comprensibles","Comunicar conclusiones con límites claros"],"requirements":["Manejo básico de hojas de cálculo"],"modules":[["Preguntar",["Objetivos y métricas","Calidad de datos","Fuentes y sesgos"]],["Analizar",["Limpieza inicial","Patrones y segmentos","Visualización"]],["Comunicar",["Narrativa con datos","Incertidumbre","Recomendaciones"]]]},{"slug":"automatizacion-con-python","title":"Automatización con Python","subtitle":"Reduce tareas repetitivas con pequeños programas.","category":"tecnologia","instructor":"Equipo de Tecnología ARTICS","level":"Intermedio","price_cents":21900,"minutes":24,"description":"Diseña scripts sencillos para transformar archivos y automatizar flujos de trabajo locales.","points":["Leer y escribir archivos con seguridad","Transformar datos con Python","Programar tareas repetibles"],"requirements":["Bases de programación"],"modules":[["Preparación",["Entorno de trabajo","Archivos y rutas","Errores comunes"]],["Transformación",["CSV y JSON","Funciones reutilizables","Validación de datos"]],["Automatización",["Procesos por lotes","Registro de resultados","Mantenimiento"]]]},{"slug":"estrategia-de-negocios-digitales","title":"Estrategia de negocios digitales","subtitle":"Define una propuesta de valor y un rumbo medible.","category":"negocios","instructor":"Equipo de Negocios ARTICS","level":"Inicial","price_cents":16900,"minutes":19,"description":"Ordena un modelo de negocio digital, sus clientes, canales y métricas iniciales.","points":["Describir una propuesta de valor","Elegir canales de adquisición","Definir un plan de experimentos"],"requirements":["Una idea o proyecto para analizar"],"modules":[["La oportunidad",["Problemas y segmentos","Propuesta de valor","Alternativas existentes"]],["El modelo",["Canales","Ingresos y costos","Supuestos críticos"]],["La ejecución",["Métricas esenciales","Experimentos pequeños","Plan de 90 días"]]]},{"slug":"gestion-de-productos-digitales","title":"Gestión de productos digitales","subtitle":"Prioriza, entrega y aprende con cada versión.","category":"negocios","instructor":"Equipo de Negocios ARTICS","level":"Avanzado","price_cents":22900,"minutes":26,"description":"Organiza decisiones de producto desde el descubrimiento hasta la revisión de resultados.","points":["Definir una visión de producto","Priorizar con criterios explícitos","Evaluar resultados después del lanzamiento"],"requirements":["Experiencia básica en equipos digitales"],"modules":[["Descubrimiento",["Señales del mercado","Entrevistas","Problemas prioritarios"]],["Dirección",["Visión de producto","Opciones y apuestas","Hoja de ruta"]],["Entrega",["Trabajo con el equipo","Experimentos","Aprendizaje continuo"]]]},{"slug":"marketing-de-contenidos","title":"Marketing de contenidos","subtitle":"Cuenta historias útiles para una audiencia concreta.","category":"marketing","instructor":"Equipo de Marketing ARTICS","level":"Inicial","price_cents":17900,"minutes":20,"description":"Diseña una estrategia editorial, planifica piezas y mide lo que aporta valor.","points":["Definir audiencia y objetivos","Crear un calendario editorial","Evaluar resultados del contenido"],"requirements":["Interés por la comunicación digital"],"modules":[["Estrategia",["Audiencia","Objetivos","Temas y canales"]],["Producción",["Narrativa de marca","Formatos","Calendario editorial"]],["Optimización",["Distribución","Métricas de contenido","Mejora continua"]]]},{"slug":"analitica-de-marketing","title":"Analítica de marketing","subtitle":"Mide campañas sin perder de vista a las personas.","category":"marketing","instructor":"Equipo de Marketing ARTICS","level":"Intermedio","price_cents":20900,"minutes":23,"description":"Aprende a definir indicadores, leer embudos y explicar resultados de campañas con claridad.","points":["Elegir indicadores para cada objetivo","Interpretar un embudo","Presentar resultados y limitaciones"],"requirements":["Conocimientos básicos de marketing digital"],"modules":[["Medición",["Objetivos y KPI","Plan de medición","Calidad del dato"]],["Análisis",["Embudo de conversión","Segmentación","Comparaciones útiles"]],["Decisiones",["Informes claros","Experimentos","Próximos pasos"]]]}]'::jsonb) loop
    select id into category_id_value from public.categories where slug = item->>'category';
    select id into instructor_id_value from public.instructors where name = item->>'instructor' order by created_at limit 1;
    insert into public.courses (
      instructor_id, category_id, title, slug, subtitle, description, level, language,
      price_cents, currency, status, is_demo, learning_points, requirements, issues_certificate
    ) values (
      instructor_id_value, category_id_value, item->>'title', item->>'slug', item->>'subtitle',
      item->>'description', item->>'level', 'es', (item->>'price_cents')::integer, 'PEN',
      'published', true,
      array(select jsonb_array_elements_text(item->'points')),
      array(select jsonb_array_elements_text(item->'requirements')), false
    ) on conflict (slug) do nothing;
    select id into course_id_value from public.courses
    where slug = item->>'slug' and is_demo = true;
    if course_id_value is null then continue; end if;

    section_position := 0;
    for module_item in select value from jsonb_array_elements(item->'modules') loop
      insert into public.sections (course_id, title, position)
      values (course_id_value, module_item->>0, section_position)
      on conflict (course_id, position) do nothing;
      select id into section_id_value from public.sections
      where course_id = course_id_value and position = section_position and title = module_item->>0;
      if section_id_value is not null then
        lesson_position := 0;
        for lesson_title in select jsonb_array_elements_text(module_item->1) loop
          insert into public.lessons (section_id, course_id, title, position, duration_seconds, is_free_preview)
          values (section_id_value, course_id_value, lesson_title, lesson_position,
                  (item->>'minutes')::integer * 60, false)
          on conflict (section_id, position) do nothing;
          lesson_position := lesson_position + 1;
        end loop;
      end if;
      section_position := section_position + 1;
    end loop;
  end loop;

  insert into public.coupons (code, discount_type, value, valid_until, max_uses)
  values ('ARTICS-DEMO-EXPIRADO', 'percent', 10, timestamp with time zone '2020-01-01 00:00:00+00', 1)
  on conflict (code) do nothing;
end;
$artics_seed$;
