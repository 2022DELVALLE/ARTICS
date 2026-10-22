import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return <div className="container not-found"><span>404</span><h1>Esta página no está aquí</h1><p>La dirección puede haber cambiado o todavía no existe.</p><Link className="button button--dark" to="/"><ArrowLeft size={18} /> Volver al inicio</Link></div>
}
