'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  placeholder?: string
  className?: string
  defaultValue?: string
}

export function SearchBar({
  placeholder = 'Search professionals by name or service...',
  className,
  defaultValue = '',
}: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(defaultValue || searchParams.get('search') || '')

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const params = new URLSearchParams(searchParams.toString())
      if (value.trim()) {
        params.set('search', value.trim())
      } else {
        params.delete('search')
      }
      params.delete('page')
      router.push(`/professionals?${params.toString()}`)
    },
    [router, searchParams, value]
  )

  const handleClear = useCallback(() => {
    setValue('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('search')
    params.delete('page')
    router.push(`/professionals?${params.toString()}`)
  }, [router, searchParams])

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-20"
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-12 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      <Button
        type="submit"
        size="sm"
        className="absolute right-1.5 top-1/2 -translate-y-1/2"
      >
        Search
      </Button>
    </form>
  )
}

// Hero search bar (larger variant)
interface HeroSearchBarProps {
  className?: string
}

export function HeroSearchBar({ className }: HeroSearchBarProps) {
  const router = useRouter()
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      router.push(`/professionals?search=${encodeURIComponent(value.trim())}`)
    } else {
      router.push('/professionals')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('relative max-w-2xl mx-auto', className)}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search for lawyers, notaries, architects..."
        className="h-14 pl-12 pr-32 text-lg rounded-full border-2"
      />
      <Button
        type="submit"
        size="lg"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
      >
        Find Professionals
      </Button>
    </form>
  )
}
