import { Suspense } from 'react'
import { Metadata } from 'next'
import { db, categories, professionals } from '@/lib/db'
import { eq, desc, asc, ilike, or, sql, arrayContains, and, count } from 'drizzle-orm'
import { ProfessionalCard } from '@/components/ProfessionalCard'
import { CategoryTabs } from '@/components/CategoryTabs'
import { FilterSidebar } from '@/components/FilterSidebar'
import { SearchBar } from '@/components/SearchBar'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { Category, Professional, CategoryId } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Find Professionals',
  description:
    'Browse our directory of English-speaking professionals for Italian property purchases. Filter by category, region, and language.',
}

interface PageProps {
  searchParams: {
    category?: string
    region?: string | string[]
    language?: string | string[]
    verified?: string
    search?: string
    sort?: string
    page?: string
  }
}

async function getCategories(): Promise<Category[]> {
  const data = await db
    .select()
    .from(categories)
    .orderBy(categories.display_order)
  return data as Category[]
}

async function getProfessionals(
  searchParams: PageProps['searchParams']
): Promise<{ professionals: Professional[]; total: number }> {
  const page = parseInt(searchParams.page || '1', 10)
  const perPage = 12
  const offset = (page - 1) * perPage

  // Build conditions array
  const conditions = []

  // Category filter
  if (searchParams.category) {
    conditions.push(eq(professionals.category, searchParams.category))
  }

  // Verified only filter
  if (searchParams.verified === 'true') {
    conditions.push(eq(professionals.is_verified, true))
  }

  // Region filter - check if regions array contains any of the selected regions
  const regions = Array.isArray(searchParams.region)
    ? searchParams.region
    : searchParams.region
    ? [searchParams.region]
    : []
  if (regions.length > 0) {
    const regionConditions = regions.map(r =>
      sql`${professionals.regions} @> ARRAY[${r}]::text[]`
    )
    // Also check for 'all' regions
    regionConditions.push(sql`${professionals.regions} @> ARRAY['all']::text[]`)
    conditions.push(or(...regionConditions))
  }

  // Language filter
  const languages = Array.isArray(searchParams.language)
    ? searchParams.language
    : searchParams.language
    ? [searchParams.language]
    : []
  if (languages.length > 0) {
    const langConditions = languages.map(l =>
      sql`${professionals.languages} @> ARRAY[${l}]::text[]`
    )
    conditions.push(or(...langConditions))
  }

  // Search filter
  if (searchParams.search) {
    const searchTerm = `%${searchParams.search}%`
    conditions.push(
      or(
        ilike(professionals.name, searchTerm),
        ilike(professionals.description, searchTerm)
      )
    )
  }

  // Get total count
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined
  const [countResult] = await db
    .select({ count: count() })
    .from(professionals)
    .where(whereClause)

  // Build query with sorting
  let query = db
    .select()
    .from(professionals)
    .where(whereClause)

  // Sorting
  switch (searchParams.sort) {
    case 'reviews':
      query = query.orderBy(desc(professionals.review_count))
      break
    case 'name':
      query = query.orderBy(asc(professionals.name))
      break
    case 'newest':
      query = query.orderBy(desc(professionals.created_at))
      break
    case 'rating':
    default:
      // Premium and featured first, then by rating
      query = query.orderBy(
        desc(professionals.is_premium),
        desc(professionals.is_featured),
        desc(professionals.avg_rating)
      )
      break
  }

  // Pagination
  const data = await query.offset(offset).limit(perPage)

  return {
    professionals: data.map(p => ({
      ...p,
      avg_rating: Number(p.avg_rating),
    })) as Professional[],
    total: countResult?.count || 0,
  }
}

export default async function ProfessionalsPage({ searchParams }: PageProps) {
  const [categoriesData, { professionals: professionalsData, total }] = await Promise.all([
    getCategories(),
    getProfessionals(searchParams),
  ])

  const page = parseInt(searchParams.page || '1', 10)
  const perPage = 12
  const totalPages = Math.ceil(total / perPage)

  const selectedCategory = (searchParams.category || 'all') as CategoryId | 'all'
  const categoryName =
    selectedCategory === 'all'
      ? 'All Professionals'
      : categoriesData.find((c) => c.id === selectedCategory)?.plural_en || 'Professionals'

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{categoryName}</h1>
        <p className="text-muted-foreground">
          {total} professional{total !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Search and Category Tabs */}
      <div className="mb-6 space-y-4">
        <SearchBar defaultValue={searchParams.search} />
        <Suspense fallback={<div className="h-10" />}>
          <CategoryTabs
            categories={categoriesData}
            selectedCategory={selectedCategory}
          />
        </Suspense>
      </div>

      {/* Main Content */}
      <div className="flex gap-8">
        {/* Filter Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <Suspense fallback={<div className="h-96 bg-muted rounded-lg animate-pulse" />}>
              <FilterSidebar categories={categoriesData} />
            </Suspense>
          </div>
        </aside>

        {/* Professionals Grid */}
        <div className="flex-1">
          {professionalsData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No professionals found matching your criteria.
              </p>
              <Button asChild variant="outline">
                <Link href="/professionals">Clear Filters</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {professionalsData.map((professional) => (
                  <ProfessionalCard
                    key={professional.id}
                    professional={professional}
                    category={categoriesData.find((c) => c.id === professional.category)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    asChild={page > 1}
                  >
                    {page > 1 ? (
                      <Link
                        href={{
                          pathname: '/professionals',
                          query: { ...searchParams, page: page - 1 },
                        }}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Link>
                    ) : (
                      <span>
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </span>
                    )}
                  </Button>

                  <span className="text-sm text-muted-foreground px-4">
                    Page {page} of {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    asChild={page < totalPages}
                  >
                    {page < totalPages ? (
                      <Link
                        href={{
                          pathname: '/professionals',
                          query: { ...searchParams, page: page + 1 },
                        }}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    ) : (
                      <span>
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </span>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
