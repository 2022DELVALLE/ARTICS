import { useState, type FormEvent } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { ArrowRight, LogOut, Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react'
import { useCart } from '../../features/cart/cartContext'
import { useAuth } from '../../features/auth/authContext'
import { useNotice } from '../notices/noticeContext'
import { isSupabaseConfigured } from '../../lib/supabase'

export function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const { slugs } = useCart()
  const { user, signOut } = useAuth()
  const notify = useNotice()

  async function leave() {
    try { await signOut(); notify('auth.signedOut'); navigate('/') }
    catch { notify('auth.signOutFailed') }
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate(search.trim() ? `/cursos?q=${encodeURIComponent(search.trim())}` : '/cursos')
    setMenuOpen(false)
  }

  return (
    <div className="site-shell">
      <div className="site-announcement">Aprende a tu ritmo. Crece a tu manera. <ArrowRight size={14} aria-hidden="true" /></div>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link className="site-brand" to="/" onClick={() => setMenuOpen(false)} aria-label="ARTICS, ir al inicio">
            <span className="site-brand__mark" aria-hidden="true">A<span>.</span></span>
            <span>ARTICS</span>
          </Link>

          <nav className={`site-nav ${menuOpen ? 'site-nav--open' : ''}`} aria-label="Navegación principal" id="site-navigation">
            <NavLink to="/" end onClick={() => setMenuOpen(false)}>Inicio</NavLink>
            <NavLink to="/cursos" onClick={() => setMenuOpen(false)}>Explorar cursos</NavLink>
            <NavLink to="/mis-cursos" onClick={() => setMenuOpen(false)}>Mis cursos</NavLink>
          </nav>

          <form className="site-search" role="search" onSubmit={submitSearch}>
            <label className="sr-only" htmlFor="site-search">Buscar cursos</label>
            <Search size={18} aria-hidden="true" />
            <input id="site-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="¿Qué quieres aprender?" />
            <button type="submit" aria-label="Buscar cursos"><ArrowRight size={18} /></button>
          </form>

          <div className="site-header__actions">
            {user ? <button className="account-link" type="button" onClick={() => void leave()} aria-label="Cerrar sesión" title="Cerrar sesión"><LogOut size={20} /></button> : <Link className="account-link" to="/cuenta" aria-label="Ingresar o registrarse" title="Ingresar o registrarse"><UserRound size={20} /></Link>}
            <Link className="cart-link" to="/carrito" aria-label={`Carrito, ${slugs.length} ${slugs.length === 1 ? 'curso' : 'cursos'}`} onClick={() => setMenuOpen(false)}>
              <ShoppingBag size={21} aria-hidden="true" />
              {slugs.length > 0 && <span className="cart-link__count">{slugs.length}</span>}
            </Link>
            <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} aria-controls="site-navigation" onClick={() => setMenuOpen((open) => !open)}>
              {menuOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>
      </header>

      <main className="site-main"><Outlet /></main>

      <footer className="site-footer">
        <div className="container site-footer__top">
          <div>
            <Link className="site-brand site-brand--footer" to="/"><span className="site-brand__mark" aria-hidden="true">A<span>.</span></span><span>ARTICS</span></Link>
            <p>Un espacio para aprender habilidades que abren posibilidades.</p>
          </div>
          <div className="site-footer__links">
            <div><strong>Explora</strong><Link to="/cursos">Todos los cursos</Link><Link to="/mis-cursos">Mis cursos</Link></div>
            <div><strong>ARTICS</strong><Link to="/certificados/verificar/ARTICS-DEMO-2026">Verificación de muestra</Link><Link to="/#preguntas">Preguntas frecuentes</Link></div>
          </div>
        </div>
        <div className="container site-footer__bottom"><span>© ARTICS</span><span>{isSupabaseConfigured ? 'Plataforma en preparación · Sin pagos activos' : 'Versión de demostración · Contenido ilustrativo'}</span></div>
      </footer>
    </div>
  )
}
