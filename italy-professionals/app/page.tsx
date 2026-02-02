import Link from 'next/link'
import {
  MapPin,
  Users,
  Shield,
  Globe,
  ArrowRight,
  CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { HeroSearchBar } from '@/components/SearchBar'
import { CategoryButtons } from '@/components/CategoryTabs'
import { CategoryIcon } from '@/components/CategoryIcon'
import { ProfessionalCard } from '@/components/ProfessionalCard'
import { db, categories, professionals } from '@/lib/db'
import { eq, desc, count } from 'drizzle-orm'
import type { Category, Professional } from '@/lib/types'

async function getCategories(): Promise<Category[]> {
  const data = await db
    .select()
    .from(categories)
    .orderBy(categories.display_order)
  return data as Category[]
}

async function getFeaturedProfessionals(): Promise<Professional[]> {
  const data = await db
    .select()
    .from(professionals)
    .where(eq(professionals.is_featured, true))
    .orderBy(desc(professionals.avg_rating))
    .limit(6)
  return data.map(p => ({
    ...p,
    avg_rating: Number(p.avg_rating),
  })) as Professional[]
}

async function getStats() {
  const [result] = await db
    .select({ count: count() })
    .from(professionals)

  return {
    professionals: result?.count || 0,
    regions: 20,
    languages: 10,
  }
}

export default async function HomePage() {
  const [categoriesData, featuredProfessionals, stats] = await Promise.all([
    getCategories(),
    getFeaturedProfessionals(),
    getStats(),
  ])

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Find Trusted Professionals
            <br />
            <span className="text-primary">for Your Italian Property</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Connect with English-speaking lawyers, notaries, surveyors, and more.
            Trusted experts to guide your property purchase in Italy.
          </p>
          <HeroSearchBar className="mb-8" />
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/professionals">
                Browse All Professionals
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/professionals?category=lawyer">Find a Lawyer</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">
                {stats.professionals}+
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Professionals
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">
                {stats.regions}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Italian Regions
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">
                {stats.languages}+
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Languages Spoken
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find the right professional for every step of your Italian property journey
            </p>
          </div>
          <CategoryButtons categories={categoriesData} />
        </div>
      </section>

      {/* Featured Professionals */}
      {featuredProfessionals.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold mb-2">Featured Professionals</h2>
                <p className="text-muted-foreground">
                  Top-rated experts recommended by property buyers
                </p>
              </div>
              <Button variant="outline" asChild className="hidden sm:flex">
                <Link href="/professionals">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProfessionals.map((professional) => (
                <ProfessionalCard
                  key={professional.id}
                  professional={professional}
                  category={categoriesData.find((c) => c.id === professional.category)}
                />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Button variant="outline" asChild>
                <Link href="/professionals">
                  View All Professionals
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Why Italy Professionals?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We make it easy to find qualified experts who understand foreign buyers
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">English Speaking</h3>
                <p className="text-sm text-muted-foreground">
                  All professionals communicate fluently in English
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Verified Experts</h3>
                <p className="text-sm text-muted-foreground">
                  Licensed and experienced with foreign clients
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Nationwide Coverage</h3>
                <p className="text-sm text-muted-foreground">
                  Professionals across all 20 Italian regions
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Real Reviews</h3>
                <p className="text-sm text-muted-foreground">
                  Read experiences from other property buyers
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Finding the right professional is simple
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Search & Filter</h3>
              <p className="text-sm text-muted-foreground">
                Browse professionals by category, region, or language. Use filters to
                find the perfect match.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Review Profiles</h3>
              <p className="text-sm text-muted-foreground">
                Read detailed profiles, services offered, and reviews from other
                property buyers.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Get in Touch</h3>
              <p className="text-sm text-muted-foreground">
                Send an inquiry directly through our platform. The professional will
                respond to your message.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container">
          <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Find Your Professional?
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Whether you&apos;re buying your first Italian property or expanding your
              portfolio, we&apos;ll help you find the right experts.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/professionals">Browse Directory</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                asChild
              >
                <Link href="/professionals?category=lawyer">Find a Lawyer</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
