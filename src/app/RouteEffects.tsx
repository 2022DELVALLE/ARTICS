import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function RouteEffects() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'ARTICS — Aprende a tu manera',
      '/cursos': 'Cursos — ARTICS',
      '/carrito': 'Carrito — ARTICS',
      '/mis-cursos': 'Mis cursos — ARTICS',
      '/cuenta': 'Ingresar o registrarse — ARTICS',
    }
    document.title = pathname.startsWith('/cursos/') ? 'Detalle del curso — ARTICS' : pathname.startsWith('/certificados/verificar/') ? 'Verificar certificado — ARTICS' : titles[pathname] ?? 'Página no encontrada — ARTICS'
    document.querySelector('meta[name="robots"]')?.remove()
    if (pathname.startsWith('/certificados/verificar/')) {
      const robots = document.createElement('meta')
      robots.name = 'robots'
      robots.content = 'noindex, nofollow'
      document.head.appendChild(robots)
    }

    if (hash) {
      const frame = requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView())
      return () => cancelAnimationFrame(frame)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
