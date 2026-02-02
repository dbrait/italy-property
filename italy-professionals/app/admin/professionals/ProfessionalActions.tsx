'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Crown, CheckCircle, Star, Loader2, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toggleProfessionalField } from '../actions'
import type { Professional } from '@/lib/types'

interface ProfessionalActionsProps {
  professional: Professional
}

export function ProfessionalActions({ professional }: ProfessionalActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleField = async (field: 'is_verified' | 'is_premium' | 'is_featured') => {
    setIsLoading(true)

    try {
      const result = await toggleProfessionalField(professional.id, field, professional[field])

      if (!result.success) {
        console.error(`Error updating ${field}:`, result.error)
        alert(`Failed to update ${field}`)
        return
      }

      router.refresh()
    } catch (error) {
      console.error(`Error updating ${field}:`, error)
      alert(`Failed to update ${field}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MoreVertical className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleToggleField('is_verified')}>
          <CheckCircle className="h-4 w-4 mr-2" />
          {professional.is_verified ? 'Remove Verified' : 'Mark as Verified'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleToggleField('is_premium')}>
          <Crown className="h-4 w-4 mr-2" />
          {professional.is_premium ? 'Remove Premium' : 'Set as Premium'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleToggleField('is_featured')}>
          <Star className="h-4 w-4 mr-2" />
          {professional.is_featured ? 'Remove Featured' : 'Set as Featured'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
