import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '../features/auth/AuthProvider'
import { CartProvider } from '../features/cart/CartProvider'
import { SiteLayout } from '../shared/layout/SiteLayout'
import { NoticeProvider } from '../shared/notices/NoticeProvider'
import { RouteEffects } from './RouteEffects'

const HomePage = lazy(() => import('../pages/HomePage').then((module) => ({ default: module.HomePage })))
const CatalogPage = lazy(() => import('../pages/CatalogPage').then((module) => ({ default: module.CatalogPage })))
const CourseDetailPage = lazy(() => import('../pages/CourseDetailPage').then((module) => ({ default: module.CourseDetailPage })))
const CartPage = lazy(() => import('../pages/CartPage').then((module) => ({ default: module.CartPage })))
const AuthPage = lazy(() => import('../pages/AuthPage').then((module) => ({ default: module.AuthPage })))
const MyCoursesPage = lazy(() => import('../pages/MyCoursesPage').then((module) => ({ default: module.MyCoursesPage })))
const CertificatePage = lazy(() => import('../pages/CertificatePage').then((module) => ({ default: module.CertificatePage })))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })))

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, retry: 1 } } })

export default function App() {
  return <BrowserRouter><RouteEffects /><QueryClientProvider client={queryClient}><NoticeProvider><AuthProvider><CartProvider><Suspense fallback={<div className="container auth-state" role="status">Cargando página…</div>}><Routes><Route element={<SiteLayout />}><Route index element={<HomePage />} /><Route path="cursos" element={<CatalogPage />} /><Route path="cursos/:slug" element={<CourseDetailPage />} /><Route path="carrito" element={<CartPage />} /><Route path="cuenta" element={<AuthPage />} /><Route path="mis-cursos" element={<MyCoursesPage />} /><Route path="certificados/verificar/:code" element={<CertificatePage />} /><Route path="*" element={<NotFoundPage />} /></Route></Routes></Suspense></CartProvider></AuthProvider></NoticeProvider></QueryClientProvider></BrowserRouter>
}
