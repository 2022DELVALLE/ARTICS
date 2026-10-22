import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { noticeCatalog, noticeUi, type NoticeKey } from './noticeCatalog'
import { NoticeContext } from './noticeContext'

type ActiveNotice = { id: number; key: NoticeKey }

export function NoticeProvider({ children }: { children: ReactNode }) {
  const [notice, setNotice] = useState<ActiveNotice | null>(null)
  const notify = useCallback((key: NoticeKey) => setNotice({ id: Date.now(), key }), [])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(null), 4500)
    return () => window.clearTimeout(timer)
  }, [notice])

  const current = notice ? noticeCatalog.es[notice.key] : null
  const Icon = current?.tone === 'success' ? CheckCircle2 : current?.tone === 'error' ? XCircle : Info

  return (
    <NoticeContext.Provider value={{ notify }}>
      {children}
      {current && (
        <div className={`notice notice--${current.tone}`} role={current.tone === 'error' ? 'alert' : 'status'}>
          <Icon size={20} aria-hidden="true" />
          <span>{current.message}</span>
          <button type="button" aria-label={noticeUi.es.close} onClick={() => setNotice(null)}><X size={18} /></button>
        </div>
      )}
    </NoticeContext.Provider>
  )
}

