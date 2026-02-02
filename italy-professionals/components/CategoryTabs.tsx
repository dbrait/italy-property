'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CategoryIcon } from '@/components/CategoryIcon'
import { cn } from '@/lib/utils'
import type { Category, CategoryId } from '@/lib/types'

interface CategoryTabsProps {
  categories: Category[]
  selectedCategory?: CategoryId | 'all'
  baseUrl?: string
  className?: string
}

export function CategoryTabs({
  categories,
  selectedCategory = 'all',
  baseUrl = '/professionals',
  className,
}: CategoryTabsProps) {
  const searchParams = useSearchParams()

  const createCategoryUrl = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (categoryId === 'all') {
      params.delete('category')
    } else {
      params.set('category', categoryId)
    }
    params.delete('page') // Reset pagination
    const queryString = params.toString()
    return `${baseUrl}${queryString ? `?${queryString}` : ''}`
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <Tabs value={selectedCategory} className="w-full">
        <TabsList className="h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
          <TabsTrigger
            value="all"
            asChild
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Link href={createCategoryUrl('all')}>All</Link>
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              asChild
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Link
                href={createCategoryUrl(category.id)}
                className="flex items-center gap-1.5"
              >
                <CategoryIcon category={category.id} size="sm" />
                <span className="hidden sm:inline">{category.plural_en}</span>
                <span className="sm:hidden">{category.name_en}</span>
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}

// Simple category buttons for homepage
interface CategoryButtonsProps {
  categories: Category[]
  className?: string
}

export function CategoryButtons({ categories, className }: CategoryButtonsProps) {
  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-4 gap-3', className)}>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/professionals?category=${category.id}`}
          className="flex flex-col items-center gap-2 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors group"
        >
          <div className="p-3 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
            <CategoryIcon
              category={category.id}
              size="lg"
              className="text-muted-foreground group-hover:text-primary transition-colors"
            />
          </div>
          <span className="text-sm font-medium text-center">{category.plural_en}</span>
        </Link>
      ))}
    </div>
  )
}
