import { ArrowLeft, Award, CheckCircle2, Copy, ShieldCheck, XCircle } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useNotice } from '../shared/notices/noticeContext'

const sampleCode = 'ARTICS-DEMO-2026'

export function CertificatePage() {
  const { code } = useParams()
  const isSample = code === sampleCode
  const notify = useNotice()

  async function copyLink() {
    try { await navigator.clipboard.writeText(window.location.href); notify('certificate.copied') }
    catch { notify('certificate.copyFailed') }
  }

  return <div className="page-main"><section className="page-intro"><div className="container"><Link className="back-link back-link--dark" to="/"><ArrowLeft size={17} /> Volver al inicio</Link><span className="eyebrow eyebrow--dark">CERTIFICADOS ARTICS</span><h1>Verificar certificado</h1><p>Consulta de ejemplo para mostrar cómo funcionará la verificación pública.</p></div></section><div className="container certificate-wrap"><div className={`verification-card ${isSample ? 'verification-card--sample' : ''}`}><div className="verification-card__icon">{isSample ? <CheckCircle2 size={36} /> : <XCircle size={36} />}</div><span className="demo-pill">Demostración · sin validez oficial</span><h2>{isSample ? 'Certificado de muestra' : 'Código no encontrado'}</h2><p>{isSample ? 'Este resultado utiliza datos ficticios. La verificación de certificados reales se habilitará al lanzar la plataforma de alumnos.' : 'No existe un certificado de muestra con este código. Aún no hay certificados reales emitidos.'}</p>{isSample && <div className="verification-card__details"><div><span>Código</span><strong>{sampleCode}</strong></div><div><span>Estudiante</span><strong>Estudiante de muestra</strong></div><div><span>Curso</span><strong>Diseño de experiencias digitales</strong></div><div><span>Estado</span><strong>Ejemplo</strong></div></div>}{isSample && <button className="button button--dark" type="button" onClick={copyLink}><Copy size={17} /> Copiar enlace</button>}</div><div className="certificate-note"><ShieldCheck size={22} /><p><strong>La emisión real está pendiente.</strong> El sistema futuro verificará los certificados desde el servidor y mostrará únicamente los datos necesarios.</p></div><div className="certificate-preview" aria-hidden="true"><div><span>ARTICS</span><Award size={50} /><small>CERTIFICADO DE FINALIZACIÓN</small><strong>Nombre del estudiante</strong><span>Curso completado</span><small>VISTA PREVIA</small></div></div></div></div>
}
