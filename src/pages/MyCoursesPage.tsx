import { ArrowRight, BookOpen, CirclePlay, GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../features/auth/authContext'
import { useMyCourses } from '../features/courses/useMyCourses'
import { isSupabaseConfigured } from '../lib/supabase'

export function MyCoursesPage() {
  const { user, loading } = useAuth()
  const { data, isPending, isError, refetch } = useMyCourses(user?.id)

  if (!isSupabaseConfigured) return <div className="page-main"><section className="page-intro"><div className="container"><span className="eyebrow eyebrow--dark">TU ESPACIO</span><h1>Mis cursos</h1><p>Este espacio se activará al conectar Supabase.</p></div></section><div className="container auth-state"><Link className="button button--dark" to="/cursos">Explorar catálogo <ArrowRight size={17} /></Link></div></div>
  if (loading) return <div className="container auth-state" role="status">Comprobando sesión…</div>
  if (!user) return <div className="page-main"><section className="page-intro"><div className="container"><span className="eyebrow eyebrow--dark">TU ESPACIO</span><h1>Mis cursos</h1><p>Inicia sesión para ver tus cursos.</p></div></section><div className="container auth-state"><Link className="button button--primary" to="/cuenta">Ingresar o registrarme</Link></div></div>

  return <div className="page-main"><section className="page-intro"><div className="container"><span className="eyebrow eyebrow--dark">TU ESPACIO</span><h1>Mis cursos</h1><p>Tus cursos inscritos en ARTICS.</p></div></section><div className="container dashboard-layout"><section className="dashboard-courses"><div className="section-heading"><div><h2>Continúa aprendiendo</h2><p>Todo tu aprendizaje en un lugar.</p></div></div>{isPending ? <p role="status">Cargando cursos…</p> : isError ? <div className="empty-state"><h2>No pudimos cargar tus cursos</h2><p>Inténtalo de nuevo.</p><button className="button button--dark" type="button" onClick={() => void refetch()}>Reintentar</button></div> : data?.length ? <div className="dashboard-list">{data.map(({ course_id, courses }) => <article className="dashboard-course" key={course_id}><div className="dashboard-course__symbol"><BookOpen size={34} /></div><div><span>CURSO INSCRITO</span><h3>{courses.title}</h3><Link className="text-link" to={`/cursos/${courses.slug}`}>Ver curso <ArrowRight size={17} /></Link></div></article>)}</div> : <div className="empty-state"><BookOpen size={32} /><h2>Aún no tienes cursos</h2><p>Cuando te inscribas, aparecerán aquí.</p><Link className="button button--dark" to="/cursos">Explorar catálogo</Link></div>}</section><aside className="dashboard-side"><div className="dashboard-side__icon"><GraduationCap size={31} /></div><h2>Aprende a tu ritmo</h2><p>Explora tus cursos desde cualquier dispositivo.</p><div><span><BookOpen size={18} /> Cursos organizados</span><span><CirclePlay size={18} /> Clases por explorar</span><span><GraduationCap size={18} /> Certificados al completar</span></div><Link className="button button--secondary button--full" to="/cursos">Explorar catálogo</Link></aside></div></div>
}
