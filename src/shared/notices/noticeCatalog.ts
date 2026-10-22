export type NoticeKey =
  | 'cart.added'
  | 'cart.removed'
  | 'checkout.unavailable'
  | 'certificate.copied'
  | 'certificate.copyFailed'
  | 'auth.signInFailed'
  | 'auth.signUpFailed'
  | 'auth.confirmEmail'
  | 'auth.signedOut'
  | 'auth.signOutFailed'

type NoticeDefinition = { message: string; tone: 'success' | 'info' | 'error' }

// Todas las notificaciones de la interfaz viven aquí. Un segundo idioma puede
// añadir otro catálogo con las mismas claves sin modificar los componentes.
export const noticeCatalog: Record<'es', Record<NoticeKey, NoticeDefinition>> = {
  es: {
    'cart.added': { message: 'Curso añadido al carrito.', tone: 'success' },
    'cart.removed': { message: 'Curso retirado del carrito.', tone: 'info' },
    'checkout.unavailable': { message: 'El pago todavía no está disponible en esta demostración.', tone: 'info' },
    'certificate.copied': { message: 'Enlace de verificación copiado.', tone: 'success' },
    'certificate.copyFailed': { message: 'No se pudo copiar el enlace. Cópialo desde la barra del navegador.', tone: 'error' },
    'auth.signInFailed': { message: 'No se pudo iniciar sesión. Revisa tu correo y contraseña.', tone: 'error' },
    'auth.signUpFailed': { message: 'No se pudo crear la cuenta. Revisa los datos e inténtalo de nuevo.', tone: 'error' },
    'auth.confirmEmail': { message: 'Revisa tu correo para confirmar la cuenta.', tone: 'success' },
    'auth.signedOut': { message: 'Sesión cerrada.', tone: 'info' },
    'auth.signOutFailed': { message: 'No se pudo cerrar la sesión. Inténtalo de nuevo.', tone: 'error' },
  },
}

export const noticeUi = { es: { close: 'Cerrar aviso' } }
