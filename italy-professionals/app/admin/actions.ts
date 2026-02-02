'use server'

import { revalidatePath } from 'next/cache'
import { eq, sql } from 'drizzle-orm'
import { db, reviews, professionals } from '@/lib/db'

export async function updateReviewStatus(id: string, status: 'approved' | 'rejected') {
  try {
    await db
      .update(reviews)
      .set({ status })
      .where(eq(reviews.id, id))

    // Get the review to update professional stats
    const [review] = await db
      .select({ professional_id: reviews.professional_id })
      .from(reviews)
      .where(eq(reviews.id, id))

    if (review?.professional_id) {
      // Update professional's review stats
      const stats = await db
        .select({
          avg_rating: sql<string>`COALESCE(AVG(${reviews.rating}), 0)`,
          review_count: sql<number>`COUNT(*)`,
        })
        .from(reviews)
        .where(eq(reviews.professional_id, review.professional_id))
        .where(eq(reviews.status, 'approved'))

      if (stats[0]) {
        await db
          .update(professionals)
          .set({
            avg_rating: stats[0].avg_rating,
            review_count: stats[0].review_count,
            updated_at: new Date(),
          })
          .where(eq(professionals.id, review.professional_id))
      }
    }

    revalidatePath('/admin/reviews')
    return { success: true }
  } catch (error) {
    console.error('Error updating review status:', error)
    return { success: false, error: 'Failed to update review status' }
  }
}

export async function toggleProfessionalField(
  id: string,
  field: 'is_verified' | 'is_premium' | 'is_featured',
  currentValue: boolean
) {
  try {
    await db
      .update(professionals)
      .set({
        [field]: !currentValue,
        updated_at: new Date(),
      })
      .where(eq(professionals.id, id))

    revalidatePath('/admin/professionals')
    return { success: true }
  } catch (error) {
    console.error(`Error toggling ${field}:`, error)
    return { success: false, error: `Failed to toggle ${field}` }
  }
}
