import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { supabase } from '../../lib/supabase'

const enrollmentSchema = z.array(z.object({
  course_id: z.uuid(),
  courses: z.object({ title: z.string(), slug: z.string() }),
}))

export function useMyCourses(userId: string | undefined) {
  return useQuery({
    queryKey: ['my-courses', userId],
    enabled: Boolean(supabase && userId),
    queryFn: async () => {
      if (!supabase || !userId) return []
      const { data, error } = await supabase.from('enrollments').select('course_id, courses(title, slug)').eq('user_id', userId)
      if (error) throw error
      return enrollmentSchema.parse(data)
    },
  })
}
