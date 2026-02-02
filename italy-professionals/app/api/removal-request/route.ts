import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { desc } from 'drizzle-orm'
import { db, removal_requests } from '@/lib/db'

const removalSchema = z.object({
  businessName: z.string().min(2),
  contactName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  listingUrl: z.string().optional(),
  reason: z.string().min(10),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = removalSchema.parse(body)

    const [removalRequest] = await db
      .insert(removal_requests)
      .values({
        business_name: data.businessName,
        contact_name: data.contactName,
        email: data.email,
        phone: data.phone || null,
        listing_url: data.listingUrl || null,
        reason: data.reason,
        status: 'pending',
      })
      .returning()

    return NextResponse.json({ success: true, id: removalRequest.id })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Removal request error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const data = await db
      .select()
      .from(removal_requests)
      .orderBy(desc(removal_requests.created_at))
    return NextResponse.json({ count: data.length, data })
  } catch (error) {
    console.error('Error fetching removal requests:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
