import { courseSchema, type CourseRepository } from './course'

const courses = courseSchema.array().parse([
  {
    slug: 'diseno-de-experiencias-digitales',
    title: 'Diseño de experiencias digitales',
    subtitle: 'Convierte ideas complejas en productos claros, útiles y memorables.',
    category: 'Diseño', level: 'Inicial', hours: 18, lessons: 24, rating: 4.9,
    students: 1240, price: 189, instructor: 'Equipo ARTICS', badge: 'Más elegido', visual: 'design',
    outcomes: ['Investigar necesidades reales de las personas', 'Diseñar flujos y prototipos de alta fidelidad', 'Presentar decisiones de diseño con confianza'],
    syllabus: [
      { title: 'Fundamentos', lessons: ['Qué hace valiosa una experiencia', 'Investigar antes de diseñar', 'Definir el problema'] },
      { title: 'Del flujo al prototipo', lessons: ['Arquitectura de información', 'Wireframes', 'Prototipos interactivos'] },
      { title: 'Validación', lessons: ['Pruebas de usabilidad', 'Iteración y presentación'] },
    ],
  },
  {
    slug: 'desarrollo-web-moderno',
    title: 'Desarrollo web moderno',
    subtitle: 'Construye interfaces rápidas, accesibles y listas para crecer.',
    category: 'Tecnología', level: 'Intermedio', hours: 32, lessons: 42, rating: 4.8,
    students: 980, price: 249, instructor: 'Equipo ARTICS', badge: 'Nuevo', visual: 'code',
    outcomes: ['Organizar una aplicación React por funcionalidades', 'Crear interfaces adaptables y accesibles', 'Publicar una aplicación con un flujo de trabajo sólido'],
    syllabus: [
      { title: 'Base web', lessons: ['HTML semántico', 'CSS adaptable', 'JavaScript moderno'] },
      { title: 'React en práctica', lessons: ['Componentes y composición', 'Estado y efectos', 'Navegación'] },
      { title: 'Entrega', lessons: ['Calidad y pruebas', 'Compilación y publicación'] },
    ],
  },
  {
    slug: 'estrategia-de-negocios-digitales',
    title: 'Estrategia de negocios digitales',
    subtitle: 'Diseña un modelo de negocio con foco, métricas y dirección.',
    category: 'Negocios', level: 'Inicial', hours: 14, lessons: 19, rating: 4.7,
    students: 760, price: 169, instructor: 'Equipo ARTICS', visual: 'business',
    outcomes: ['Definir una propuesta de valor', 'Identificar clientes y canales', 'Priorizar oportunidades con datos'],
    syllabus: [
      { title: 'La oportunidad', lessons: ['Problemas y segmentos', 'Propuesta de valor'] },
      { title: 'El modelo', lessons: ['Canales y adquisición', 'Ingresos y costos'] },
      { title: 'La ejecución', lessons: ['Métricas esenciales', 'Plan de 90 días'] },
    ],
  },
  {
    slug: 'marketing-de-contenidos',
    title: 'Marketing de contenidos',
    subtitle: 'Crea historias que conectan con las personas adecuadas.',
    category: 'Marketing', level: 'Inicial', hours: 16, lessons: 22, rating: 4.8,
    students: 1100, price: 179, instructor: 'Equipo ARTICS', visual: 'marketing',
    outcomes: ['Construir una estrategia editorial', 'Crear contenido para cada etapa del recorrido', 'Medir resultados y mejorar'],
    syllabus: [
      { title: 'Estrategia', lessons: ['Audiencia y objetivos', 'Temas y canales'] },
      { title: 'Producción', lessons: ['Narrativa de marca', 'Calendario editorial'] },
      { title: 'Optimización', lessons: ['Distribución', 'Métricas de contenido'] },
    ],
  },
  {
    slug: 'datos-para-tomar-decisiones',
    title: 'Datos para tomar decisiones',
    subtitle: 'Encuentra patrones, formula preguntas y comunica hallazgos.',
    category: 'Tecnología', level: 'Inicial', hours: 20, lessons: 28, rating: 4.9,
    students: 650, price: 199, instructor: 'Equipo ARTICS', visual: 'data',
    outcomes: ['Preparar datos para el análisis', 'Crear visualizaciones fáciles de leer', 'Convertir hallazgos en decisiones'],
    syllabus: [
      { title: 'Pensar con datos', lessons: ['Preguntas útiles', 'Calidad de datos'] },
      { title: 'Análisis', lessons: ['Explorar patrones', 'Visualización'] },
      { title: 'Comunicar', lessons: ['Narrativa con datos', 'Recomendaciones'] },
    ],
  },
  {
    slug: 'gestion-de-productos-digitales',
    title: 'Gestión de productos digitales',
    subtitle: 'Lleva un producto de la oportunidad al aprendizaje continuo.',
    category: 'Negocios', level: 'Avanzado', hours: 26, lessons: 34, rating: 4.9,
    students: 540, price: 229, instructor: 'Equipo ARTICS', visual: 'product',
    outcomes: ['Definir una visión y una hoja de ruta', 'Priorizar trabajo con criterios explícitos', 'Aprender de cada lanzamiento'],
    syllabus: [
      { title: 'Descubrimiento', lessons: ['Identificar oportunidades', 'Entrevistas y señales'] },
      { title: 'Dirección', lessons: ['Visión de producto', 'Priorización'] },
      { title: 'Entrega y aprendizaje', lessons: ['Experimentos', 'Métricas de producto'] },
    ],
  },
])

export const mockCourseRepository: CourseRepository = {
  list: () => courses,
  findBySlug: (slug) => courses.find((course) => course.slug === slug),
}
