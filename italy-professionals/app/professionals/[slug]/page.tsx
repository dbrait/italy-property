import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  MapPin,
  Globe,
  Mail,
  Phone,
  ExternalLink,
  MessageCircle,
  ChevronLeft,
  CheckCircle,
} from 'lucide-react'
import { db, categories, professionals, reviews } from '@/lib/db'
import { eq, desc, ne, and, sql } from 'drizzle-orm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { StarRating } from '@/components/StarRating'
import { PremiumBadge, VerifiedBadge } from '@/components/PremiumBadge'
import { CategoryIcon } from '@/components/CategoryIcon'
import { ReviewList, RatingBreakdown } from '@/components/ReviewList'
import { ProfessionalCardCompact } from '@/components/ProfessionalCard'
import { formatRegions, cn } from '@/lib/utils'
import type { Professional, Category, Review } from '@/lib/types'

interface PageProps {
  params: { slug: string }
}

async function getProfessional(slug: string): Promise<Professional | null> {
  const [data] = await db
    .select()
    .from(professionals)
    .where(eq(professionals.slug, slug))
    .limit(1)

  if (data) {
    // Increment view count
    await db
      .update(professionals)
      .set({ view_count: sql`${professionals.view_count} + 1` })
      .where(eq(professionals.slug, slug))
  }

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

async function getReviews(professionalId: string): Promise<Review[]> {
  const data = await db
    .select()
    .from(reviews)
    .where(and(
      eq(reviews.professional_id, professionalId),
      eq(reviews.status, 'approved')
    ))
    .orderBy(desc(reviews.created_at))
  return data as Review[]
}

async function getSimilarProfessionals(
  professional: Professional
): Promise<Professional[]> {
  const data = await db
    .select()
    .from(professionals)
    .where(and(
      eq(professionals.category, professional.category),
      ne(professionals.id, professional.id)
    ))
    .orderBy(desc(professionals.avg_rating))
    .limit(3)
  return data.map(p => ({
    ...p,
    avg_rating: Number(p.avg_rating),
  })) as Professional[]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const professional = await getProfessional(params.slug)

  if (!professional) {
    return { title: 'Professional Not Found' }
  }

  return {
    title: professional.name,
    description: professional.description || `${professional.name} - ${professional.category} serving ${formatRegions(professional.regions)}`,
  }
}

export default async function ProfessionalDetailPage({ params }: PageProps) {
  const professional = await getProfessional(params.slug)

  if (!professional) {
    notFound()
  }

  const [category, reviewsData, similarProfessionals] = await Promise.all([
    getCategory(professional.category),
    getReviews(professional.id),
    getSimilarProfessionals(professional),
  ])

  return (
    <div className="container py-8">
      {/* Back Button */}
      <Button variant="ghost" size="sm" className="mb-6" asChild>
        <Link href="/professionals">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Directory
        </Link>
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Card */}
          <Card className={cn(professional.is_premium && 'ring-2 ring-gold/50')}>
            <CardContent className="p-6">
              {/* Badges and Category */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-muted">
                    <CategoryIcon category={professional.category} size="md" />
                  </div>
                  <Badge variant="outline">
                    {category?.name_en || professional.category}
                  </Badge>
                </div>
                <div className="flex gap-2 ml-auto">
                  {professional.is_premium && <PremiumBadge />}
                  {professional.is_verified && <VerifiedBadge />}
                </div>
              </div>

              {/* Name and Contact Person */}
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {professional.name}
              </h1>
              {professional.contact_person && (
                <p className="text-muted-foreground">
                  Contact: {professional.contact_person}
                </p>
              )}

              {/* Rating */}
              {professional.review_count > 0 && (
                <div className="flex items-center gap-3 mt-4">
                  <StarRating rating={professional.avg_rating} size="lg" />
                  <span className="text-lg font-medium">
                    {professional.avg_rating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">
                    ({professional.review_count} review
                    {professional.review_count !== 1 ? 's' : ''})
                  </span>
                </div>
              )}

              {/* Quick Info */}
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Regions</p>
                    <p className="text-sm text-muted-foreground">
                      {professional.regions.includes('all')
                        ? 'All Italy'
                        : professional.regions
                            .map(
                              (r) =>
                                r.charAt(0).toUpperCase() +
                                r.slice(1).replace(/-/g, ' ')
                            )
                            .join(', ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Globe className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Languages</p>
                    <p className="text-sm text-muted-foreground">
                      {professional.languages.join(', ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {professional.description && (
                <div className="mt-6">
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {professional.description}
                  </p>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                <Button size="lg" asChild>
                  <Link href={`/contact/${professional.slug}`}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact {professional.contact_person || professional.name}
                  </Link>
                </Button>
                {professional.website && (
                  <Button size="lg" variant="outline" asChild>
                    <a
                      href={professional.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          {professional.services && professional.services.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Services</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {professional.services.map((service, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{service}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Highlights */}
          {professional.highlights && professional.highlights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {professional.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Reviews Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Reviews</CardTitle>
              <Button variant="outline" asChild>
                <Link href={`/contact/${professional.slug}?tab=review`}>
                  Write a Review
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {professional.review_count > 0 && (
                <>
                  <RatingBreakdown
                    avgRating={professional.avg_rating}
                    reviewCount={professional.review_count}
                    className="mb-6"
                  />
                  <Separator className="my-6" />
                </>
              )}
              <ReviewList reviews={reviewsData} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {professional.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <a
                    href={`mailto:${professional.email}`}
                    className="text-sm hover:underline"
                  >
                    {professional.email}
                  </a>
                </div>
              )}
              {professional.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <a
                    href={`tel:${professional.phone}`}
                    className="text-sm hover:underline"
                  >
                    {professional.phone}
                  </a>
                </div>
              )}
              {professional.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <a
                    href={professional.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline truncate"
                  >
                    {professional.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              <Separator />
              <Button className="w-full" asChild>
                <Link href={`/contact/${professional.slug}`}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Inquiry
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Category Info */}
          {category && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  About {category.plural_en}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.description && (
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                )}
                {category.why_needed && (
                  <div>
                    <p className="text-sm font-medium mb-1">Why you need one:</p>
                    <p className="text-sm text-muted-foreground">
                      {category.why_needed}
                    </p>
                  </div>
                )}
                {category.typical_fees && (
                  <div>
                    <p className="text-sm font-medium mb-1">Typical fees:</p>
                    <p className="text-sm text-muted-foreground">
                      {category.typical_fees}
                    </p>
                  </div>
                )}
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/professionals?category=${category.id}`}>
                    View All {category.plural_en}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Similar Professionals */}
          {similarProfessionals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Similar Professionals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {similarProfessionals.map((prof) => (
                  <ProfessionalCardCompact key={prof.id} professional={prof} />
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
