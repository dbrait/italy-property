import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { eq, and, desc } from 'drizzle-orm'
import { db, reviews } from '@/lib/db'

const reviewSchema = z.object({
  professional_id: z.string().uuid(),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  content: z.string().min(20),
  author_name: z.string().min(2),
  author_country: z.string().optional(),
  service_used: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = reviewSchema.parse(body)

    // Insert review with pending status
    const [review] = await db
      .insert(reviews)
      .values({
        professional_id: data.professional_id,
        rating: data.rating,
        title: data.title || null,
        content: data.content,
        author_name: data.author_name,
        author_country: data.author_country || null,
        service_used: data.service_used || null,
        status: 'pending',
        is_verified_purchase: false,
      })
      .returning()

    // TODO: Send notification to admin about new review for moderation
    // await sendReviewNotification(review)

    return NextResponse.json({
      success: true,
      review_id: review.id,
      message: 'Review submitted successfully. It will be visible after moderation.',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Review submission error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const professionalId = searchParams.get('professional_id')

  if (!professionalId) {
    return NextResponse.json(
      { error: 'Professional ID is required' },
      { status: 400 }
    )
  }

  try {
    const reviewsData = await db
      .select()
      .from(reviews)
      .where(and(
        eq(reviews.professional_id, professionalId),
        eq(reviews.status, 'approved')
      ))
      .orderBy(desc(reviews.created_at))

    return NextResponse.json({ reviews: reviewsData })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}
