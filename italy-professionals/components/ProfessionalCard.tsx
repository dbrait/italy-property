import Link from 'next/link'
import { MapPin, Globe, MessageCircle } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/StarRating'
import { PremiumBadge, VerifiedBadge } from '@/components/PremiumBadge'
import { CategoryIcon } from '@/components/CategoryIcon'
import { cn, truncate, formatRegions, formatLanguages } from '@/lib/utils'
import type { Professional, Category } from '@/lib/types'

interface ProfessionalCardProps {
  professional: Professional
  category?: Category
  className?: string
}

export function ProfessionalCard({
  professional,
  category,
  className,
}: ProfessionalCardProps) {
  const {
    slug,
    name,
    contact_person,
    category: categoryId,
    regions,
    languages,
    description,
    is_verified,
    is_premium,
    is_featured,
    avg_rating,
    review_count,
  } = professional

  return (
    <Card
      className={cn(
        'flex flex-col h-full transition-shadow hover:shadow-md',
        is_premium && 'ring-2 ring-gold/50 bg-gold/5',
        className
      )}
    >
      <CardContent className="flex-1 p-5">
        {/* Header with badges */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-muted">
              <CategoryIcon category={categoryId} size="md" />
            </div>
            <div>
              <Badge variant="outline" className="text-xs">
                {category?.name_en || categoryId}
              </Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 justify-end">
            {is_premium && <PremiumBadge />}
            {is_verified && <VerifiedBadge />}
          </div>
        </div>

        {/* Name and contact person */}
        <Link href={`/professionals/${slug}`} className="group">
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
            {name}
          </h3>
        </Link>
        {contact_person && (
          <p className="text-sm text-muted-foreground mt-0.5">
            Contact: {contact_person}
          </p>
        )}

        {/* Rating */}
        {review_count > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <StarRating rating={avg_rating} size="sm" />
            <span className="text-sm text-muted-foreground">
              ({review_count} review{review_count !== 1 ? 's' : ''})
            </span>
          </div>
        )}

        {/* Location */}
        <div className="flex items-center gap-1.5 mt-3 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{formatRegions(regions)}</span>
        </div>

        {/* Languages */}
        <div className="flex items-center gap-1.5 mt-1.5 text-sm text-muted-foreground">
          <Globe className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{formatLanguages(languages)}</span>
        </div>

        {/* Description */}
        {description && (
          <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
            {truncate(description, 150)}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-5 pt-0 gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/professionals/${slug}`}>View Profile</Link>
        </Button>
        <Button asChild className="flex-1">
          <Link href={`/contact/${slug}`}>
            <MessageCircle className="h-4 w-4 mr-1.5" />
            Contact
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

// Compact version for sidebars and related listings
interface ProfessionalCardCompactProps {
  professional: Professional
  className?: string
}

export function ProfessionalCardCompact({
  professional,
  className,
}: ProfessionalCardCompactProps) {
  const { slug, name, category, regions, avg_rating, review_count, is_verified, is_premium } =
    professional

  return (
    <Link
      href={`/professionals/${slug}`}
      className={cn(
        'block p-3 rounded-lg border hover:bg-accent/50 transition-colors',
        is_premium && 'border-gold/50 bg-gold/5',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded bg-muted">
          <CategoryIcon category={category} size="sm" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{name}</h4>
          <p className="text-xs text-muted-foreground truncate">
            {formatRegions(regions)}
          </p>
          {review_count > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <StarRating rating={avg_rating} size="sm" />
              <span className="text-xs text-muted-foreground">
                ({review_count})
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-0.5">
          {is_premium && <PremiumBadge className="scale-75 origin-right" />}
          {is_verified && <VerifiedBadge className="scale-75 origin-right" />}
        </div>
      </div>
    </Link>
  )
}
