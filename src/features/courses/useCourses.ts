import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { supabase } from '../../lib/supabase'
import { courseSchema, type Course } from './course'
import { mockCourseRepository } from './mockCourseRepository'

const rowSchema = z.object({
  slug: z.string(), title: z.string(), subtitle: z.string(), level: z.enum(['Inicial', 'Intermedio', 'Avanzado']),
  price_cents: z.number(), rating_avg: z.coerce.number(), students_count: z.number(),
  is_demo: z.boolean(), issues_certificate: z.boolean(),
  learning_points: z.array(z.string()),
  categories: z.object({ name: z.string() }),
  instructors: z.object({ name: z.string() }),
  sections: z.array(z.object({ title: z.string(), position: z.number(), lessons: z.array(z.object({ title: z.string(), position: z.number(), duration_seconds: z.number() })) })),
})

const visuals: Course['visual'][] = ['design', 'code', 'business', 'marketing', 'data', 'product']

function toCourse(raw: unknown, index: number): Course {
  const row = rowSchema.parse(raw)
  const sections = [...row.sections].sort((a, b) => a.position - b.position)
  const lessons = sections.flatMap((section) => section.lessons)
  return courseSchema.parse({
    slug: row.slug, title: row.title, subtitle: row.subtitle,
    category: row.categories.name, level: row.level,
    hours: Math.round(lessons.reduce((sum, lesson) => sum + lesson.duration_seconds, 0) / 360) / 10,
    lessons: lessons.length, rating: row.rating_avg, students: row.students_count,
    price: row.price_cents / 100, instructor: row.instructors.name,
    isDemo: row.is_demo, issuesCertificate: row.issues_certificate,
    visual: visuals[index % visuals.length], outcomes: row.learning_points,
    syllabus: sections.map((section) => ({ title: section.title, lessons: [...section.lessons].sort((a, b) => a.position - b.position).map((lesson) => lesson.title) })),
  })
}

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      if (!supabase) return mockCourseRepository.list()
      const { data, error } = await supabase.from('courses').select('slug,title,subtitle,level,price_cents,rating_avg,students_count,is_demo,issues_certificate,learning_points,categories(name),instructors(name),sections(title,position,lessons(title,position,duration_seconds))').eq('status', 'published').order('created_at', { ascending: false })
      if (error) throw error
      return data.map(toCourse)
    },
  })
}
