import { Metadata } from 'next'
import Link from 'next/link'
import {
  Star,
  Eye,
  MessageSquare,
  ExternalLink,
  Crown,
  CheckCircle,
  Search,
} from 'lucide-react'
import { db, categories, professionals } from '@/lib/db'
import { eq, desc, ilike, and } from 'drizzle-orm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CategoryIcon } from '@/components/CategoryIcon'
import { StarRating } from '@/components/StarRating'
import { ProfessionalActions } from './ProfessionalActions'
import type { Professional, Category } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Manage Professionals | Admin',
}

interface PageProps {
  searchParams: {
    category?: string
    search?: string
    verified?: string
    premium?: string
  }
}

async function getCategories(): Promise<Category[]> {
  const data = await db
    .select()
    .from(categories)
    .orderBy(categories.display_order)
  return data as Category[]
}

async function getProfessionals(searchParams: PageProps['searchParams']) {
  const conditions = []

  if (searchParams.category) {
    conditions.push(eq(professionals.category, searchParams.category))
  }

  if (searchParams.verified === 'true') {
    conditions.push(eq(professionals.is_verified, true))
  }

  if (searchParams.premium === 'true') {
    conditions.push(eq(professionals.is_premium, true))
  }

  if (searchParams.search) {
    conditions.push(ilike(professionals.name, `%${searchParams.search}%`))
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  const data = await db
    .select()
    .from(professionals)
    .where(whereClause)
    .orderBy(desc(professionals.created_at))

  return data.map(p => ({
    ...p,
    avg_rating: Number(p.avg_rating),
  })) as Professional[]
}

export default async function ProfessionalsPage({ searchParams }: PageProps) {
  const [categoriesData, professionalsData] = await Promise.all([
    getCategories(),
    getProfessionals(searchParams),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Professionals</h1>
          <p className="text-muted-foreground">
            Manage directory listings ({professionalsData.length} total)
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <form className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            name="search"
            placeholder="Search by name..."
            defaultValue={searchParams.search}
            className="pl-9"
          />
        </form>

        <Select defaultValue={searchParams.category || 'all'}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categoriesData.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.plural_en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant={searchParams.verified === 'true' ? 'default' : 'outline'}
            size="sm"
            asChild
          >
            <Link
              href={{
                pathname: '/admin/professionals',
                query: {
                  ...searchParams,
                  verified: searchParams.verified === 'true' ? undefined : 'true',
                },
              }}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Verified
            </Link>
          </Button>
          <Button
            variant={searchParams.premium === 'true' ? 'default' : 'outline'}
            size="sm"
            asChild
          >
            <Link
              href={{
                pathname: '/admin/professionals',
                query: {
                  ...searchParams,
                  premium: searchParams.premium === 'true' ? undefined : 'true',
                },
              }}
            >
              <Crown className="h-4 w-4 mr-1" />
              Premium
            </Link>
          </Button>
        </div>
      </div>

      {/* Professionals List */}
      {professionalsData.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No professionals found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {professionalsData.map((pro: Professional) => (
            <Card key={pro.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="p-2 rounded-lg bg-muted flex-shrink-0">
                    <CategoryIcon category={pro.category} size="md" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/professionals/${pro.slug}`}
                        className="font-semibold hover:underline truncate"
                      >
                        {pro.name}
                      </Link>
                      {pro.is_premium && (
                        <Badge variant="gold" className="flex items-center gap-1">
                          <Crown className="h-3 w-3" />
                          Premium
                        </Badge>
                      )}
                      {pro.is_verified && (
                        <Badge variant="success" className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                      {pro.is_featured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>
                        {categoriesData.find((c) => c.id === pro.category)?.name_en || pro.category}
                      </span>
                      {pro.review_count > 0 && (
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {pro.avg_rating.toFixed(1)} ({pro.review_count})
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {pro.view_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {pro.lead_count}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/professionals/${pro.slug}`}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                    <ProfessionalActions professional={pro} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
