import { Metadata } from 'next'
import Link from 'next/link'
import { Star, MapPin, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react'
import { db, reviews, professionals } from '@/lib/db'
import { eq, desc } from 'drizzle-orm'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StarRating } from '@/components/StarRating'
import { formatDate } from '@/lib/utils'
import { ReviewActions } from './ReviewActions'
import type { Review } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Moderate Reviews | Admin',
}

interface PageProps {
  searchParams: {
    status?: string
  }
}

async function getReviews(status?: string) {
  let query = db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      title: reviews.title,
      content: reviews.content,
      author_name: reviews.author_name,
      author_country: reviews.author_country,
      service_used: reviews.service_used,
      is_verified_purchase: reviews.is_verified_purchase,
      status: reviews.status,
      created_at: reviews.created_at,
      professional_id: reviews.professional_id,
      professional_name: professionals.name,
      professional_slug: professionals.slug,
      professional_category: professionals.category,
    })
    .from(reviews)
    .leftJoin(professionals, eq(reviews.professional_id, professionals.id))
    .orderBy(desc(reviews.created_at))
    .$dynamic()

  if (status && status !== 'all') {
    query = query.where(eq(reviews.status, status))
  }

  const data = await query

  return data.map(r => ({
    ...r,
    professional: r.professional_name ? {
      id: r.professional_id,
      name: r.professional_name,
      slug: r.professional_slug,
      category: r.professional_category,
    } : null,
  }))
}

const statusColors: Record<string, 'default' | 'secondary' | 'success' | 'destructive'> = {
  pending: 'default',
  approved: 'success',
  rejected: 'destructive',
}

const statusIcons: Record<string, any> = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
}

export default async function ReviewsPage({ searchParams }: PageProps) {
  const reviewsData = await getReviews(searchParams.status)
  const currentStatus = searchParams.status || 'all'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reviews</h1>
          <p className="text-muted-foreground">
            Moderate and manage customer reviews
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex gap-2">
          <Button
            variant={currentStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            asChild
          >
            <Link href="/admin/reviews">All</Link>
          </Button>
          <Button
            variant={currentStatus === 'pending' ? 'default' : 'outline'}
            size="sm"
            asChild
          >
            <Link href="/admin/reviews?status=pending">
              <Clock className="h-4 w-4 mr-1" />
              Pending
            </Link>
          </Button>
          <Button
            variant={currentStatus === 'approved' ? 'default' : 'outline'}
            size="sm"
            asChild
          >
            <Link href="/admin/reviews?status=approved">
              <CheckCircle className="h-4 w-4 mr-1" />
              Approved
            </Link>
          </Button>
          <Button
            variant={currentStatus === 'rejected' ? 'default' : 'outline'}
            size="sm"
            asChild
          >
            <Link href="/admin/reviews?status=rejected">
              <XCircle className="h-4 w-4 mr-1" />
              Rejected
            </Link>
          </Button>
        </div>
      </div>

      {/* Reviews List */}
      {reviewsData.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No reviews found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviewsData.map((review: any) => {
            const StatusIcon = statusIcons[review.status] || Clock

            return (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <StarRating rating={review.rating} size="md" />
                            <Badge variant={statusColors[review.status] || 'outline'}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {review.status}
                            </Badge>
                          </div>
                          {review.title && (
                            <h3 className="font-semibold mt-2">{review.title}</h3>
                          )}
                        </div>
                      </div>

                      {/* Author Info */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {review.author_name}
                        </span>
                        {review.author_country && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {review.author_country}
                          </span>
                        )}
                        {review.is_verified_purchase && (
                          <Badge variant="success" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>

                      {/* Content */}
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm whitespace-pre-wrap">{review.content}</p>
                      </div>

                      {/* Professional & Service */}
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        {review.professional && (
                          <span>
                            <span className="text-muted-foreground">For: </span>
                            <Link
                              href={`/professionals/${review.professional.slug}`}
                              className="font-medium hover:underline"
                            >
                              {review.professional.name}
                            </Link>
                          </span>
                        )}
                        {review.service_used && (
                          <Badge variant="outline">{review.service_used}</Badge>
                        )}
                      </div>

                      {/* Date */}
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(review.created_at)}
                      </p>
                    </div>

                    {/* Actions */}
                    <ReviewActions review={review} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
