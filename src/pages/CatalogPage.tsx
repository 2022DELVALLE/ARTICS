import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { CourseCard } from '../features/courses/CourseCard'
import { useCourses } from '../features/courses/useCourses'
import { isSupabaseConfigured } from '../lib/supabase'

const levels = ['Todos', 'Inicial', 'Intermedio', 'Avanzado'] as const

export function CatalogPage() {
  const { data, isPending, isError, refetch } = useCourses()
  const categories = ['Todos', ...new Set((data ?? []).map((course) => course.category))]
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const category = params.get('categoria') ?? 'Todos'
  const level = params.get('nivel') ?? 'Todos'
  const sort = params.get('orden') ?? 'destacados'

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value === 'Todos' || value === '' || value === 'destacados') next.delete(key)
    else next.set(key, value)
    setParams(next)
  }

  const normalized = query.trim().toLocaleLowerCase('es')
  const filtered = (data ?? []).filter((course) =>
    (category === 'Todos' || course.category === category) &&
    (level === 'Todos' || course.level === level) &&
    (!normalized || `${course.title} ${course.subtitle} ${course.category}`.toLocaleLowerCase('es').includes(normalized)),
  )
  const courses = [...filtered].sort((a, b) => sort === 'precio-asc' ? a.price - b.price : sort === 'precio-desc' ? b.price - a.price : b.rating - a.rating)

  return (
    <div className="page-main">
      <section className="page-intro"><div className="container"><span className="eyebrow eyebrow--dark">EXPLORA Y DESCUBRE</span><h1>Encuentra tu próximo curso</h1><p>Nuevas habilidades, nuevos caminos. Elige por dónde quieres empezar.</p>{(!isSupabaseConfigured || data?.some((course) => course.isDemo)) && <span className="demo-pill">Incluye cursos de ejemplo · Sin compra disponible</span>}</div></section>
      <div className="container catalog-layout">
        <aside className="catalog-filters" aria-label="Filtros de cursos">
          <div className="catalog-filters__heading"><SlidersHorizontal size={19} /><h2>Filtrar cursos</h2></div>
          <fieldset><legend>Categoría</legend>{categories.map((item) => <label className="filter-choice" key={item}><input type="radio" name="category" checked={category === item} onChange={() => updateParam('categoria', item)} /><span>{item}</span></label>)}</fieldset>
          <fieldset><legend>Nivel</legend>{levels.map((item) => <label className="filter-choice" key={item}><input type="radio" name="level" checked={level === item} onChange={() => updateParam('nivel', item)} /><span>{item}</span></label>)}</fieldset>
        </aside>
        <section className="catalog-results" aria-label="Resultados de cursos">
          <div className="catalog-toolbar"><div><strong>{courses.length} {courses.length === 1 ? 'curso' : 'cursos'}</strong><span> para explorar</span></div><label>Ordenar por <select value={sort} onChange={(event) => updateParam('orden', event.target.value)}><option value="destacados">Mejor valorados</option><option value="precio-asc">Menor precio</option><option value="precio-desc">Mayor precio</option></select></label></div>
          <label className="catalog-search"><Search size={18} aria-hidden="true" /><span className="sr-only">Buscar en el catálogo</span><input value={query} onChange={(event) => updateParam('q', event.target.value)} placeholder="Buscar cursos..." />{query && <button type="button" aria-label="Borrar búsqueda" onClick={() => updateParam('q', '')}><X size={17} /></button>}</label>
          {isPending ? <p role="status">Cargando cursos…</p> : isError ? <div className="empty-state"><h2>No pudimos cargar el catálogo</h2><p>Inténtalo de nuevo.</p><button className="button button--dark" type="button" onClick={() => void refetch()}>Reintentar</button></div> : courses.length > 0 ? <div className="course-grid course-grid--catalog">{courses.map((course) => <CourseCard course={course} key={course.slug} />)}</div> : <div className="empty-state"><Search size={30} aria-hidden="true" /><h2>No encontramos cursos</h2><p>{data?.length ? 'Prueba otra búsqueda o cambia los filtros.' : 'Pronto publicaremos nuevos cursos.'}</p>{data?.length ? <button className="button button--dark" type="button" onClick={() => setParams(new URLSearchParams())}>Limpiar filtros</button> : null}</div>}
        </section>
      </div>
    </div>
  )
}
