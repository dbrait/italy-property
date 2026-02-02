'use client'

import { Star, StarHalf } from 'lucide-react'
import { cn } from '@/lib/utils'
import { generateStarArray } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  interactive?: boolean
  onRatingChange?: (rating: number) => void
  className?: string
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  interactive = false,
  onRatingChange,
  className,
}: StarRatingProps) {
  const stars = generateStarArray(rating)

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  const handleClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1)
    }
  }

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {stars.map((type, index) => (
        <button
          key={index}
          type="button"
          disabled={!interactive}
          onClick={() => handleClick(index)}
          className={cn(
            'focus:outline-none',
            interactive && 'cursor-pointer hover:scale-110 transition-transform'
          )}
        >
          {type === 'full' ? (
            <Star
              className={cn(sizeClasses[size], 'fill-yellow-400 text-yellow-400')}
            />
          ) : type === 'half' ? (
            <StarHalf
              className={cn(sizeClasses[size], 'fill-yellow-400 text-yellow-400')}
            />
          ) : (
            <Star className={cn(sizeClasses[size], 'text-gray-300')} />
          )}
        </button>
      ))}
      {showValue && (
        <span className="ml-1 text-sm text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

interface StarRatingInputProps {
  value: number
  onChange: (rating: number) => void
  className?: string
}

export function StarRatingInput({
  value,
  onChange,
  className,
}: StarRatingInputProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus:outline-none hover:scale-110 transition-transform"
        >
          <Star
            className={cn(
              'h-6 w-6',
              star <= value
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 hover:text-yellow-300'
            )}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-muted-foreground">
        {value > 0 ? `${value} star${value !== 1 ? 's' : ''}` : 'Select rating'}
      </span>
    </div>
  )
}
