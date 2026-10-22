import { ArrowUpRight, ChartNoAxesCombined, Code2, Database, Layers3, Megaphone, Palette, Star, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Course } from './course'
import { formatPrice } from '../../shared/format/price'

const visualIcons = {
  design: Palette,
  code: Code2,
  business: ChartNoAxesCombined,
  marketing: Megaphone,
  data: Database,
  product: Layers3,
}

export function CourseArt({ course, large = false }: { course: Course; large?: boolean }) {
  const Icon = visualIcons[course.visual]
  return (
    <div className={`course-art course-art--${course.visual} ${large ? 'course-art--large' : ''}`} aria-hidden="true">
      <span className="course-art__grid" />
      <span className="course-art__shape course-art__shape--one" />
      <span className="course-art__shape course-art__shape--two" />
      <Icon className="course-art__icon" strokeWidth={1.35} />
    </div>
  )
}

export function CourseCard({ course }: { course: Course }) {
  return (
    <article className="course-card">
      <Link className="course-card__art-link" to={`/cursos/${course.slug}`} aria-label={`Ver ${course.title}`}>
        <CourseArt course={course} />
        {(course.isDemo || course.badge) && <span className="course-card__badge">{course.isDemo ? 'Ejemplo' : course.badge}</span>}
      </Link>
      <div className="course-card__body">
        <span className="course-card__category">{course.category} <span aria-hidden="true">·</span> {course.level}</span>
        <h3><Link to={`/cursos/${course.slug}`}>{course.title}</Link></h3>
        <p>{course.subtitle}</p>
        <div className="course-card__meta"><span><Star size={15} fill="currentColor" aria-hidden="true" /> {course.rating > 0 ? course.rating.toFixed(1) : 'Sin reseñas'}</span><span><Clock3 size={15} aria-hidden="true" /> {course.hours} h</span></div>
        <div className="course-card__bottom"><strong>{formatPrice(course.price)}</strong><Link to={`/cursos/${course.slug}`} aria-label={`Ver detalles de ${course.title}`}><ArrowUpRight size={19} /></Link></div>
      </div>
    </article>
  )
}
