'use client'

import { useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { X, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { ITALIAN_REGIONS, REGION_DISPLAY_NAMES, LANGUAGES } from '@/lib/types'
import type { Category } from '@/lib/types'

interface FilterSidebarProps {
  categories: Category[]
  className?: string
}

export function FilterSidebar({ categories, className }: FilterSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const selectedCategory = searchParams.get('category') || ''
  const selectedRegions = searchParams.getAll('region')
  const selectedLanguages = searchParams.getAll('language')
  const verifiedOnly = searchParams.get('verified') === 'true'
  const sortBy = searchParams.get('sort') || 'rating'

  const updateParams = useCallback(
    (key: string, value: string | string[] | boolean | null) => {
      const params = new URLSearchParams(searchParams.toString())

      // Remove existing values for this key
      params.delete(key)

      // Add new values
      if (value === null || value === false || value === '') {
        // Don't add anything (removes the param)
      } else if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v))
      } else if (typeof value === 'boolean') {
        params.set(key, 'true')
      } else {
        params.set(key, value)
      }

      // Reset pagination
      params.delete('page')

      router.push(`/professionals?${params.toString()}`)
    },
    [router, searchParams]
  )

  const toggleArrayParam = useCallback(
    (key: string, value: string, current: string[]) => {
      const newValues = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      updateParams(key, newValues.length > 0 ? newValues : null)
    },
    [updateParams]
  )

  const clearAllFilters = useCallback(() => {
    router.push('/professionals')
  }, [router])

  const hasFilters =
    selectedCategory ||
    selectedRegions.length > 0 ||
    selectedLanguages.length > 0 ||
    verifiedOnly

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <h3 className="font-semibold">Filters</h3>
        </div>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <Separator />

      {/* Sort */}
      <div className="space-y-3">
        <Label>Sort by</Label>
        <Select value={sortBy} onValueChange={(value) => updateParams('sort', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="reviews">Most Reviews</SelectItem>
            <SelectItem value="name">Alphabetical</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Category */}
      <div className="space-y-3">
        <Label>Category</Label>
        <Select
          value={selectedCategory || 'all'}
          onValueChange={(value) => updateParams('category', value === 'all' ? null : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.plural_en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Regions */}
      <div className="space-y-3">
        <Label>Regions</Label>
        <div className="max-h-48 overflow-y-auto space-y-2">
          {ITALIAN_REGIONS.map((region) => (
            <div key={region} className="flex items-center gap-2">
              <Checkbox
                id={`region-${region}`}
                checked={selectedRegions.includes(region)}
                onCheckedChange={() =>
                  toggleArrayParam('region', region, selectedRegions)
                }
              />
              <Label
                htmlFor={`region-${region}`}
                className="text-sm font-normal cursor-pointer"
              >
                {REGION_DISPLAY_NAMES[region]}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Languages */}
      <div className="space-y-3">
        <Label>Languages</Label>
        <div className="max-h-48 overflow-y-auto space-y-2">
          {LANGUAGES.map((language) => (
            <div key={language} className="flex items-center gap-2">
              <Checkbox
                id={`language-${language}`}
                checked={selectedLanguages.includes(language)}
                onCheckedChange={() =>
                  toggleArrayParam('language', language, selectedLanguages)
                }
              />
              <Label
                htmlFor={`language-${language}`}
                className="text-sm font-normal cursor-pointer"
              >
                {language}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Verified Only */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="verified-only"
          checked={verifiedOnly}
          onCheckedChange={(checked) => updateParams('verified', checked ? true : null)}
        />
        <Label htmlFor="verified-only" className="font-normal cursor-pointer">
          Verified professionals only
        </Label>
      </div>
    </div>
  )
}

// Mobile filter dialog trigger
interface MobileFilterTriggerProps {
  filterCount: number
  onClick: () => void
}

export function MobileFilterTrigger({ filterCount, onClick }: MobileFilterTriggerProps) {
  return (
    <Button variant="outline" onClick={onClick} className="lg:hidden">
      <Filter className="h-4 w-4 mr-2" />
      Filters
      {filterCount > 0 && (
        <span className="ml-2 rounded-full bg-primary text-primary-foreground text-xs px-2 py-0.5">
          {filterCount}
        </span>
      )}
    </Button>
  )
}
