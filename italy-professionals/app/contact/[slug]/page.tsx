import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, MessageCircle, Star } from 'lucide-react'
import { db, categories, professionals } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ContactForm } from '@/components/ContactForm'
import { ReviewForm } from '@/components/ReviewForm'
import { StarRating } from '@/components/StarRating'
import { PremiumBadge, VerifiedBadge } from '@/components/PremiumBadge'
import { CategoryIcon } from '@/components/CategoryIcon'
import type { Professional, Category } from '@/lib/types'

interface PageProps {
  params: { slug: string }
  searchParams: { tab?: string }
}

async function getProfessional(slug: string): Promise<Professional | null> {
  const [data] = await db
    .select()
    .from(professionals)
    .where(eq(professionals.slug, slug))
    .limit(1)
  return data ? {
    ...data,
    avg_rating: Number(data.avg_rating),
  } as Professional : null
}

async function getCategory(categoryId: string): Promise<Category | null> {
  const [data] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, categoryId))
    .limit(1)
  return data as Category | null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const professional = await getProfessional(params.slug)

  if (!professional) {
    return { title: 'Professional Not Found' }
  }

  return {
    title: `Contact ${professional.name}`,
    description: `Send an inquiry to ${professional.name}. Get help with your Italian property purchase.`,
  }
}

export default async function ContactPage({ params, searchParams }: PageProps) {
  const professional = await getProfessional(params.slug)

  if (!professional) {
    notFound()
  }

  const category = await getCategory(professional.category)
  const defaultTab = searchParams.tab === 'review' ? 'review' : 'contact'

  return (
    <div className="container py-8 max-w-3xl">
      {/* Back Button */}
      <Button variant="ghost" size="sm" className="mb-6" asChild>
        <Link href={`/professionals/${professional.slug}`}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Profile
        </Link>
      </Button>

      {/* Professional Summary Card */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-muted">
              <CategoryIcon category={professional.category} size="lg" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-xl font-semibold">{professional.name}</h1>
                {professional.is_premium && <PremiumBadge />}
                {professional.is_verified && <VerifiedBadge />}
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {category?.name_en || professional.category}
                {professional.contact_person && ` • Contact: ${professional.contact_person}`}
              </p>
              {professional.review_count > 0 && (
                <div className="flex items-center gap-2">
                  <StarRating rating={professional.avg_rating} size="sm" />
                  <span className="text-sm text-muted-foreground">
                    ({professional.review_count} review
                    {professional.review_count !== 1 ? 's' : ''})
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Contact / Review */}
      <Tabs defaultValue={defaultTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Send Inquiry
          </TabsTrigger>
          <TabsTrigger value="review" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Write Review
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Send an Inquiry</CardTitle>
              <CardDescription>
                Fill out the form below and {professional.contact_person || professional.name} will
                get back to you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm professional={professional} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review">
          <Card>
            <CardHeader>
              <CardTitle>Write a Review</CardTitle>
              <CardDescription>
                Share your experience working with {professional.name}. Your review will be visible
                after moderation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReviewForm professional={professional} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
