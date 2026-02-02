import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { eq, sql } from 'drizzle-orm'
import { db, leads, professionals } from '@/lib/db'

const contactSchema = z.object({
  professional_id: z.string().uuid(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  country: z.string().optional(),
  message: z.string().min(10),
  property_type: z.string().optional(),
  budget_range: z.string().optional(),
  timeline: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = contactSchema.parse(body)

    // Insert lead
    const [lead] = await db
      .insert(leads)
      .values({
        professional_id: data.professional_id,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        country: data.country || null,
        message: data.message,
        property_type: data.property_type || null,
        budget_range: data.budget_range || null,
        timeline: data.timeline || null,
        status: 'new',
      })
      .returning()

    // Increment lead count for the professional
    await db
      .update(professionals)
      .set({ lead_count: sql`${professionals.lead_count} + 1` })
      .where(eq(professionals.id, data.professional_id))

    // TODO: Send email notification to admin
    // This would use Resend or similar service
    // await sendNotificationEmail(lead, professional)

    return NextResponse.json({ success: true, lead_id: lead.id })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
