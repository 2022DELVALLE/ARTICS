import { ArrowRight, ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../features/cart/cartContext'
import { CourseArt } from '../features/courses/CourseCard'
import { useCourses } from '../features/courses/useCourses'
import { formatPrice } from '../shared/format/price'
import { useNotice } from '../shared/notices/noticeContext'

export function CartPage() {
  const { slugs, remove } = useCart()
  const notify = useNotice()
  const { data, isPending, isError, refetch } = useCourses()
  const courses = slugs.flatMap((slug) => { const course = data?.find((item) => item.slug === slug); return course ? [course] : [] })
  const total = courses.reduce((sum, course) => sum + course.price, 0)

  return <div className="page-main"><section className="page-intro"><div className="container"><span className="eyebrow eyebrow--dark">TUS PRÓXIMOS PASOS</span><h1>Tu carrito</h1><p>Revisa los cursos que te interesan.</p><span className="demo-pill">Compra todavía no disponible</span></div></section><div className="container cart-layout">{isPending ? <p role="status">Cargando carrito…</p> : isError ? <div className="empty-state"><h2>No pudimos cargar el carrito</h2><button className="button button--dark" type="button" onClick={() => void refetch()}>Reintentar</button></div> : courses.length ? <><section className="cart-items" aria-label="Cursos en el carrito"><h2>{courses.length} {courses.length === 1 ? 'curso' : 'cursos'}</h2>{courses.map((course) => <article className="cart-item" key={course.slug}><Link to={`/cursos/${course.slug}`} aria-label={`Ver ${course.title}`}><CourseArt course={course} /></Link><div className="cart-item__info"><span>{course.category} · {course.level}</span><h3><Link to={`/cursos/${course.slug}`}>{course.title}</Link></h3><p>{course.hours} horas · {course.lessons} lecciones</p><button type="button" onClick={() => { remove(course.slug); notify('cart.removed') }}><Trash2 size={16} /> Quitar</button></div><strong>{formatPrice(course.price)}</strong></article>)}</section><aside className="cart-summary" aria-label="Resumen del carrito"><h2>Resumen</h2><div><span>Subtotal</span><strong>{formatPrice(total)}</strong></div><div><span>Total referencial</span><strong>{formatPrice(total)}</strong></div><button type="button" className="button button--primary button--full" onClick={() => notify('checkout.unavailable')}>Continuar con la compra <ArrowRight size={18} /></button><p>El checkout aún no está habilitado.</p></aside></> : <div className="empty-state empty-state--cart"><ShoppingBag size={34} aria-hidden="true" /><h2>Tu carrito está vacío</h2><p>Explora el catálogo y encuentra algo que te inspire.</p><Link className="button button--dark" to="/cursos">Explorar cursos <ArrowRight size={17} /></Link></div>}</div></div>
}
