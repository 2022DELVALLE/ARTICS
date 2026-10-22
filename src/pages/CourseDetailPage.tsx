import { useEffect } from 'react'
import { ArrowLeft, ArrowRight, Award, BookOpen, Check, Clock3, Play, ShieldCheck, ShoppingBag, Star, Users } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../features/cart/cartContext'
import { CourseArt } from '../features/courses/CourseCard'
import { useCourses } from '../features/courses/useCourses'
import { isSupabaseConfigured } from '../lib/supabase'
import { formatPrice } from '../shared/format/price'
import { useNotice } from '../shared/notices/noticeContext'
import { NotFoundPage } from './NotFoundPage'

export function CourseDetailPage() {
  const { slug } = useParams()
  const { data, isPending, isError, refetch } = useCourses()
  const course = data?.find((item) => item.slug === slug)
  const { slugs, add } = useCart()
  const notify = useNotice()

  useEffect(() => { if (course) document.title = `${course.title} — ARTICS` }, [course])

  if (isPending) return <div className="container auth-state" role="status">Cargando curso…</div>
  if (isError) return <div className="container empty-state"><h1>No pudimos cargar el curso</h1><button className="button button--dark" type="button" onClick={() => void refetch()}>Reintentar</button></div>
  if (!course) return <NotFoundPage />
  const inCart = slugs.includes(course.slug)

  return (
    <div className="page-main">
      <section className="detail-hero"><div className="container"><Link className="back-link" to="/cursos"><ArrowLeft size={17} /> Todos los cursos</Link><div className="detail-hero__grid"><div><span className="eyebrow">{course.category.toUpperCase()} · {course.level.toUpperCase()}</span><h1>{course.title}</h1><p>{course.subtitle}</p><div className="detail-hero__meta">{course.rating > 0 ? <span><Star size={17} fill="currentColor" /> {course.rating.toFixed(1)} {isSupabaseConfigured ? 'valoración' : 'valoración de muestra'}</span> : <span><Star size={17} /> Sin reseñas</span>}{course.students > 0 && <span><Users size={17} /> {course.students.toLocaleString('es-PE')} {isSupabaseConfigured ? 'estudiantes' : 'estudiantes de muestra'}</span>}</div>{course.isDemo && <span className="demo-pill">Curso de ejemplo · Sin clases disponibles</span>}<span className="detail-hero__instructor">Por {course.instructor}</span></div><CourseArt course={course} large /></div></div></section>
      <div className="container detail-layout">
        <div className="detail-content">
          <section className="detail-section"><h2>Lo que aprenderás</h2><div className="outcome-grid">{course.outcomes.map((outcome) => <div key={outcome}><Check size={18} aria-hidden="true" /><span>{outcome}</span></div>)}</div></section>
          <section className="detail-section"><h2>Un curso para avanzar</h2><p>{course.isDemo ? 'Este temario es ilustrativo. Las clases y materiales se incorporarán cuando el curso esté listo.' : 'Aprende con lecciones organizadas para llevar cada idea a la práctica. Explora los temas y avanza a tu ritmo desde cualquier dispositivo.'}</p><div className="detail-highlights"><span><BookOpen size={18} /> {course.lessons} lecciones</span><span><Clock3 size={18} /> {course.hours} horas</span>{course.issuesCertificate && <span><Award size={18} /> Certificado previsto</span>}</div></section>
          <section className="detail-section" id="temario"><div className="detail-section__heading"><h2>Contenido del curso</h2><span>{course.syllabus.length} módulos</span></div><div className="syllabus">{course.syllabus.map((module, index) => <details key={module.title} open={index === 0}><summary><span><b>{String(index + 1).padStart(2, '0')}</b>{module.title}</span><small>{module.lessons.length} lecciones</small></summary><ul>{module.lessons.map((lesson) => <li key={lesson}><Play size={14} aria-hidden="true" />{lesson}</li>)}</ul></details>)}</div></section>
          <section className="detail-section certificate-teaser"><Award size={29} aria-hidden="true" /><div><h2>Reconoce tu progreso</h2><p>ARTICS contempla certificados de finalización. Esta función se habilitará cuando esté lista la experiencia de aprendizaje real.</p><Link className="text-link" to="/certificados/verificar/ARTICS-DEMO-2026">Ver ejemplo de verificación <ArrowRight size={17} /></Link></div></section>
        </div>
        <aside className="detail-purchase" aria-label="Resumen del curso"><div className="detail-purchase__preview"><CourseArt course={course} /><span><Play size={16} fill="currentColor" /> {course.isDemo ? 'Vista de ejemplo' : 'Vista del curso'}</span></div><div className="detail-purchase__body">{(course.isDemo || !isSupabaseConfigured) && <span className="demo-pill">Precio de ejemplo</span>}<strong>{formatPrice(course.price)}</strong><button className="button button--primary button--full" type="button" onClick={() => { add(course.slug); notify('cart.added') }}><ShoppingBag size={18} /> {inCart ? 'Ya está en tu carrito' : 'Agregar al carrito'}</button><Link className="button button--secondary button--full" to="/carrito">Ver carrito</Link><div className="detail-purchase__benefits"><span><Clock3 size={17} /> Aprende a tu ritmo</span><span><BookOpen size={17} /> {course.lessons} lecciones</span><span><ShieldCheck size={17} /> Acceso previsto al comprar</span></div><p>Los pagos y el acceso real todavía no están habilitados.</p></div></aside>
      </div>
    </div>
  )
}
