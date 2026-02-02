import { Crown, CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface PremiumBadgeProps {
  className?: string
}

export function PremiumBadge({ className }: PremiumBadgeProps) {
  return (
    <Badge
      variant="gold"
      className={cn('flex items-center gap-1', className)}
    >
      <Crown className="h-3 w-3" />
      <span>Premium</span>
    </Badge>
  )
}

interface VerifiedBadgeProps {
  className?: string
}

export function VerifiedBadge({ className }: VerifiedBadgeProps) {
  return (
    <Badge
      variant="success"
      className={cn('flex items-center gap-1', className)}
    >
      <CheckCircle className="h-3 w-3" />
      <span>Verified</span>
    </Badge>
  )
}

interface FeaturedBadgeProps {
  className?: string
}

export function FeaturedBadge({ className }: FeaturedBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn('flex items-center gap-1', className)}
    >
      <span>Featured</span>
    </Badge>
  )
}
