'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'

const removalSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  contactName: z.string().min(2, 'Your name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  listingUrl: z.string().optional(),
  reason: z.string().min(10, 'Please provide a reason for removal'),
})

type RemovalFormData = z.infer<typeof removalSchema>

export function RemovalRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RemovalFormData>({
    resolver: zodResolver(removalSchema),
  })

  const onSubmit = async (data: RemovalFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/removal-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to submit request')
      }

      setIsSubmitted(true)
    } catch (err) {
      setError('Failed to submit your request. Please try again or contact us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Request Submitted</h2>
          <p className="text-muted-foreground">
            Thank you for your request. We will review it and contact you within 5 business
            days to verify your identity and process the removal.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business/Listing Name *</Label>
            <Input
              id="businessName"
              placeholder="Name as it appears in our directory"
              {...register('businessName')}
            />
            {errors.businessName && (
              <p className="text-sm text-destructive">{errors.businessName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactName">Your Name *</Label>
            <Input
              id="contactName"
              placeholder="Your full name"
              {...register('contactName')}
            />
            {errors.contactName && (
              <p className="text-sm text-destructive">{errors.contactName.message}</p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+39 ..."
                {...register('phone')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="listingUrl">Listing URL (if known)</Label>
            <Input
              id="listingUrl"
              placeholder="https://italyprofessionals.com/professionals/..."
              {...register('listingUrl')}
            />
            <p className="text-xs text-muted-foreground">
              Copy the URL of your listing page to help us find it faster
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Removal *</Label>
            <Textarea
              id="reason"
              placeholder="Please explain why you would like to be removed from our directory..."
              rows={4}
              {...register('reason')}
            />
            {errors.reason && (
              <p className="text-sm text-destructive">{errors.reason.message}</p>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Removal Request'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
