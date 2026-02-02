'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StarRatingInput } from '@/components/StarRating'
import { cn } from '@/lib/utils'
import type { Professional } from '@/lib/types'

const reviewFormSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  title: z.string().optional(),
  content: z.string().min(20, 'Review must be at least 20 characters'),
  author_name: z.string().min(2, 'Name must be at least 2 characters'),
  author_country: z.string().optional(),
  service_used: z.string().optional(),
})

type ReviewFormData = z.infer<typeof reviewFormSchema>

interface ReviewFormProps {
  professional: Professional
  onSuccess?: () => void
  className?: string
}

export function ReviewForm({ professional, onSuccess, className }: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 0,
    },
  })

  const rating = watch('rating')

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          professional_id: professional.id,
        }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to submit review')
      }

      setIsSuccess(true)
      reset()
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className={cn('text-center py-8', className)}>
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Review Submitted!</h3>
        <p className="text-muted-foreground mb-4">
          Thank you for your review. It will be visible after moderation.
        </p>
        <Button variant="outline" onClick={() => setIsSuccess(false)}>
          Write Another Review
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-4', className)}>
      {error && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Rating */}
      <div className="space-y-2">
        <Label>Your Rating *</Label>
        <StarRatingInput
          value={rating}
          onChange={(value) => setValue('rating', value)}
        />
        {errors.rating && (
          <p className="text-sm text-destructive">{errors.rating.message}</p>
        )}
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Review Title (optional)</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="Summarize your experience"
          disabled={isSubmitting}
        />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label htmlFor="content">Your Review *</Label>
        <Textarea
          id="content"
          {...register('content')}
          placeholder="Share your experience working with this professional..."
          rows={4}
          disabled={isSubmitting}
        />
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Author Name */}
        <div className="space-y-2">
          <Label htmlFor="author_name">Your Name *</Label>
          <Input
            id="author_name"
            {...register('author_name')}
            placeholder="Your name"
            disabled={isSubmitting}
          />
          {errors.author_name && (
            <p className="text-sm text-destructive">{errors.author_name.message}</p>
          )}
        </div>

        {/* Author Country */}
        <div className="space-y-2">
          <Label htmlFor="author_country">Your Country (optional)</Label>
          <Input
            id="author_country"
            {...register('author_country')}
            placeholder="e.g., United States"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Service Used */}
      <div className="space-y-2">
        <Label>Service Used (optional)</Label>
        <Select onValueChange={(value) => setValue('service_used', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Which service did you use?" />
          </SelectTrigger>
          <SelectContent>
            {professional.services?.map((service) => (
              <SelectItem key={service} value={service}>
                {service}
              </SelectItem>
            ))}
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Review'
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Your review will be published after moderation.
      </p>
    </form>
  )
}
