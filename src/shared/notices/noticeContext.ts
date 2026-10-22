import { createContext, useContext } from 'react'
import type { NoticeKey } from './noticeCatalog'

export type NoticeContextValue = { notify: (key: NoticeKey) => void }
export const NoticeContext = createContext<NoticeContextValue | null>(null)

export function useNotice() {
  const context = useContext(NoticeContext)
  if (!context) throw new Error('useNotice requiere NoticeProvider')
  return context.notify
}
