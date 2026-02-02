import { Star, User, MapPin, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/StarRating'
import { formatDate, cn } from '@/lib/utils'
import type { Review } from '@/lib/types'

interface ReviewListProps {
  reviews: Review[]
  className?: string
}

export function ReviewList({ reviews, className }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className={cn('text-center py-8', className)}>
        <p className="text-muted-foreground">No reviews yet. Be the first to leave a review!</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  )
}

interface ReviewCardProps {
  review: Review
}

function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{review.author_name}</span>
                {review.is_verified_purchase && (
                  <Badge variant="success" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              {review.author_country && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {review.author_country}
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <StarRating rating={review.rating} size="sm" />
            <p className="text-xs text-muted-foreground mt-1">
              {formatDate(review.created_at)}
            </p>
          </div>
        </div>

        {review.title && (
          <h4 className="font-medium mt-4">{review.title}</h4>
        )}

        <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
          {review.content}
        </p>

        {review.service_used && (
          <div className="mt-3">
            <Badge variant="outline" className="text-xs">
              Service: {review.service_used}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Rating breakdown component
interface RatingBreakdownProps {
  avgRating: number
  reviewCount: number
  ratingDistribution?: Record<number, number>
  className?: string
}

export function RatingBreakdown({
  avgRating,
  reviewCount,
  ratingDistribution,
  className,
}: RatingBreakdownProps) {
  const distribution = ratingDistribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  const total = Object.values(distribution).reduce((a, b) => a + b, 0) || 1

  return (
    <div className={cn('', className)}>
      <div className="flex items-center gap-4 mb-4">
        <div className="text-center">
          <div className="text-4xl font-bold">{avgRating.toFixed(1)}</div>
          <StarRating rating={avgRating} size="md" className="mt-1" />
          <p className="text-sm text-muted-foreground mt-1">
            {reviewCount} review{reviewCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((stars) => {
          const count = distribution[stars] || 0
          const percentage = (count / total) * 100

          return (
            <div key={stars} className="flex items-center gap-2">
              <span className="text-sm w-3">{stars}</span>
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-8 text-right">
                {count}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
