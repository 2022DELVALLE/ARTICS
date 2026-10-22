import { ArrowRight, BookOpen, ChartNoAxesCombined, CirclePlay, Code2, Megaphone, Palette, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CourseCard } from '../features/courses/CourseCard'
import { useCourses } from '../features/courses/useCourses'
import { isSupabaseConfigured } from '../lib/supabase'

const categories = [
  { label: 'Diseño', icon: Palette, description: 'Ideas que toman forma', className: 'category-card--design' },
  { label: 'Tecnología', icon: Code2, description: 'Crea el futuro digital', className: 'category-card--technology' },
  { label: 'Negocios', icon: ChartNoAxesCombined, description: 'Convierte visión en acción', className: 'category-card--business' },
  { label: 'Marketing', icon: Megaphone, description: 'Historias que conectan', className: 'category-card--marketing' },
] as const

export function HomePage() {
  const { data, isPending, isError, refetch } = useCourses()
  const featured = (data ?? []).slice(0, 3)
  const visibleCategories = isSupabaseConfigured
    ? [...new Set((data ?? []).map((course) => course.category))].map((label) => categories.find((item) => item.label === label) ?? { label, icon: BookOpen, description: 'Explora los cursos', className: 'category-card--design' })
    : categories

  return (
    <>
      <section className="home-hero">
        <div className="container home-hero__inner">
          <div className="home-hero__content">
            <span className="eyebrow"><Sparkles size={15} aria-hidden="true" /> APRENDE PARA DECIDIR</span>
            <h1>¿Qué harás con lo que <em>aprendes?</em></h1>
            <p>Lee la realidad con datos, lleva lo aprendido a la práctica y decide con criterio cuándo actuar.</p>
            <div className="home-hero__actions"><Link className="button button--primary" to="/cursos">Explorar cursos <ArrowRight size={19} /></Link><Link className="button button--ghost" to="/#como-funciona">Cómo funciona</Link></div>
            <div className="home-hero__features"><span><BookOpen size={17} /> Casos reales</span><span><CirclePlay size={17} /> Análisis y práctica</span></div>
          </div>
          <div className="home-hero__visual" aria-hidden="true">
            <div className="hero-orbit hero-orbit--one" /><div className="hero-orbit hero-orbit--two" />
            <div className="hero-visual-card hero-visual-card--main"><span className="hero-visual-card__mini">ARTICS / APRENDIZAJE</span><span className="hero-visual-card__letter">A<span>.</span></span><span className="hero-visual-card__line" /></div>
            <div className="hero-visual-card hero-visual-card--small"><span>01 / 03</span><strong>Aprende.<br />Crea.<br />Avanza.</strong></div>
            <div className="hero-visual-dot hero-visual-dot--one" /><div className="hero-visual-dot hero-visual-dot--two" />
          </div>
        </div>
      </section>

      <section className="section section--categories">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow eyebrow--dark">ENCUENTRA TU CAMINO</span><h2>Un mundo de posibilidades</h2><p>Descubre el área que despierta tu curiosidad.</p></div><Link className="text-link" to="/cursos">Ver todos los cursos <ArrowRight size={18} /></Link></div>
          {visibleCategories.length ? <div className="category-grid">{visibleCategories.map(({ label, icon: Icon, description, className }) => <Link className={`category-card ${className}`} to={`/cursos?categoria=${encodeURIComponent(label)}`} key={label}><Icon size={29} strokeWidth={1.6} aria-hidden="true" /><span><strong>{label}</strong><small>{description}</small></span><ArrowRight className="category-card__arrow" size={18} aria-hidden="true" /></Link>)}</div> : <p>{isPending ? 'Cargando categorías…' : 'Pronto habrá categorías aquí.'}</p>}
        </div>
      </section>

      <section className="section section--featured">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow eyebrow--dark">PARA EMPEZAR</span><h2>Cursos para dar el salto</h2><p>Una selección de experiencias de aprendizaje para explorar.</p></div><Link className="text-link" to="/cursos">Explorar catálogo <ArrowRight size={18} /></Link></div>
          {isPending ? <p role="status">Cargando cursos…</p> : isError ? <div className="empty-state"><h3>No pudimos cargar los cursos</h3><button className="button button--dark" type="button" onClick={() => void refetch()}>Reintentar</button></div> : featured.length ? <div className="course-grid">{featured.map((course) => <CourseCard course={course} key={course.slug} />)}</div> : <div className="empty-state"><h3>Pronto habrá cursos aquí</h3><p>Estamos preparando el catálogo ARTICS.</p></div>}
        </div>
      </section>

      <section className="section section--why" id="como-funciona">
        <div className="container why-grid">
          <div>
            <span className="eyebrow">LA METODOLOGÍA ARTICS</span>
            <h2>¿Cómo conviertes información en decisiones?</h2>
            <p>Aprendemos con situaciones reales. Cada curso te guía para interpretar datos, ponerlos en práctica y elegir el momento de actuar.</p>
            <div className="method-example"><strong>¿Qué pasa con la inflación en mi hogar?</strong><p>En economía familiar analizamos señales de los precios para evaluar qué está cambiando, cómo ajustar el presupuesto y cuándo conviene hacerlo.</p></div>
            <Link className="button button--outline" to="/cursos">Explora los cursos <ArrowRight size={18} /></Link>
          </div>
          <div className="why-cards">
            <article><span>01</span><h3>¿Qué información me da?</h3><p>Reconoce qué revelan los datos y qué dudas todavía quedan por resolver.</p></article>
            <article><span>02</span><h3>¿Cómo la uso?</h3><p>Aplica lo que interpretaste a un problema o una decisión concreta.</p></article>
            <article><span>03</span><h3>¿Cuándo la uso?</h3><p>Compara escenarios y define criterios para actuar en el momento adecuado.</p></article>
          </div>
        </div>
      </section>

      <section className="section section--faq" id="preguntas">
        <div className="container faq-layout"><div><span className="eyebrow eyebrow--dark">TE ACOMPAÑAMOS</span><h2>Preguntas frecuentes</h2><p>Lo esencial para conocer esta primera versión de ARTICS.</p></div><div className="faq-list"><details><summary>¿Puedo estudiar a mi propio ritmo?</summary><p>Sí. La experiencia está pensada para que avances cuando tengas tiempo y retomes donde quedaste.</p></details><details><summary>¿Los cursos incluyen certificado?</summary><p>El plan de ARTICS contempla certificados de finalización. Su emisión real se habilitará cuando esté lista la plataforma de alumnos.</p></details><details><summary>¿Ya puedo comprar un curso?</summary><p>Todavía no. Esta primera versión permite explorar el catálogo y probar un carrito de demostración.</p></details></div></div>
      </section>
    </>
  )
}
