'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { updateReviewStatus } from '../actions'
import type { Review } from '@/lib/types'

interface ReviewActionsProps {
  review: Review
}

export function ReviewActions({ review }: ReviewActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<'approve' | 'reject' | null>(null)

  const handleUpdateStatus = async (status: 'approved' | 'rejected') => {
    setIsLoading(status === 'approved' ? 'approve' : 'reject')

    try {
      const result = await updateReviewStatus(review.id, status)

      if (!result.success) {
        console.error('Error updating review:', result.error)
        alert('Failed to update review status')
        return
      }

      router.refresh()
    } catch (error) {
      console.error('Error updating review:', error)
      alert('Failed to update review status')
    } finally {
      setIsLoading(null)
    }
  }

  if (review.status !== 'pending') {
    return (
      <div className="flex lg:flex-col gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleUpdateStatus(review.status === 'approved' ? 'rejected' : 'approved')}
          disabled={isLoading !== null}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : review.status === 'approved' ? (
            <>
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve
            </>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex lg:flex-col gap-2">
      <Button
        size="sm"
        variant="default"
        onClick={() => handleUpdateStatus('approved')}
        disabled={isLoading !== null}
      >
        {isLoading === 'approve' ? (
          <Loader2 className="h-4 w-4 animate-spin mr-1" />
        ) : (
          <CheckCircle className="h-4 w-4 mr-1" />
        )}
        Approve
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => handleUpdateStatus('rejected')}
        disabled={isLoading !== null}
      >
        {isLoading === 'reject' ? (
          <Loader2 className="h-4 w-4 animate-spin mr-1" />
        ) : (
          <XCircle className="h-4 w-4 mr-1" />
        )}
        Reject
      </Button>
    </div>
  )
}
