import type { CourseRepository } from './course'
import { mockCourseRepository } from './mockCourseRepository'

// Punto de composición: aquí se sustituye la fuente de datos al conectar el backend.
export const courseRepository: CourseRepository = mockCourseRepository
