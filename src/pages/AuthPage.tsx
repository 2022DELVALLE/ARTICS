import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/authContext'
import { isSupabaseConfigured } from '../lib/supabase'
import { useNotice } from '../shared/notices/noticeContext'

export function AuthPage() {
  const { user, loading, signIn, signUp } = useAuth()
  const notify = useNotice()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [pending, setPending] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    setPending(true)
    try {
      if (mode === 'login') await signIn(email.trim(), password)
      else if (!await signUp(email.trim(), password, fullName.trim())) {
        notify('auth.confirmEmail')
        return
      }
      navigate('/mis-cursos', { replace: true })
    } catch {
      notify(mode === 'login' ? 'auth.signInFailed' : 'auth.signUpFailed')
    } finally {
      setPending(false)
    }
  }

  if (loading) return <div className="container auth-state" role="status">Comprobando sesión…</div>
  if (user) return <Navigate to="/mis-cursos" replace />

  return <div className="page-main"><section className="page-intro"><div className="container"><span className="eyebrow eyebrow--dark">TU ESPACIO</span><h1>{mode === 'login' ? 'Inicia sesión' : 'Crea tu cuenta'}</h1><p>Accede a tus cursos y sigue tu aprendizaje.</p></div></section><div className="container auth-layout">{isSupabaseConfigured ? <form className="auth-form" onSubmit={submit}><div className="auth-tabs" role="group" aria-label="Tipo de acceso"><button type="button" aria-pressed={mode === 'login'} onClick={() => setMode('login')}>Ingresar</button><button type="button" aria-pressed={mode === 'register'} onClick={() => setMode('register')}>Registrarme</button></div>{mode === 'register' && <label>Nombre completo<input required autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} minLength={2} maxLength={120} /></label>}<label>Correo electrónico<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>Contraseña<input required type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} /></label><button className="button button--primary button--full" disabled={pending} type="submit">{pending ? 'Espera…' : mode === 'login' ? 'Ingresar' : 'Crear cuenta'}</button></form> : <div className="empty-state"><h2>Acceso aún no configurado</h2><p>El proyecto de Supabase todavía no está conectado a esta instalación.</p><Link className="button button--dark" to="/cursos">Explorar cursos</Link></div>}</div></div>
}
