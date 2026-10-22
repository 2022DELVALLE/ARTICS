import { z } from 'zod'

export const courseSchema = z.object({
  slug: z.string(),
  title: z.string(),
  subtitle: z.string(),
  category: z.string().min(1),
  level: z.enum(['Inicial', 'Intermedio', 'Avanzado']),
  hours: z.number().nonnegative(),
  lessons: z.number().nonnegative(),
  rating: z.number().min(0).max(5),
  students: z.number().nonnegative(),
  price: z.number().nonnegative(),
  instructor: z.string(),
  isDemo: z.boolean().default(false),
  issuesCertificate: z.boolean().default(true),
  badge: z.string().optional(),
  visual: z.enum(['design', 'code', 'business', 'marketing', 'data', 'product']),
  outcomes: z.array(z.string()),
  syllabus: z.array(z.object({ title: z.string(), lessons: z.array(z.string()) })),
})

export type Course = z.infer<typeof courseSchema>
export type CourseCategory = Course['category']

export interface CourseRepository {
  list(): Course[]
  findBySlug(slug: string): Course | undefined
}
