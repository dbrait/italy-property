import Link from 'next/link'
import {
  Users,
  MessageSquare,
  Star,
  Eye,
  TrendingUp,
  ArrowRight,
  Crown,
  CheckCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { db, professionals, leads, reviews } from '@/lib/db'
import { eq, desc, count } from 'drizzle-orm'

async function getStats() {
  const [
    [{ count: professionalCount }],
    [{ count: verifiedCount }],
    [{ count: premiumCount }],
    [{ count: leadCount }],
    [{ count: newLeadCount }],
    [{ count: reviewCount }],
    [{ count: pendingReviewCount }],
    recentLeads,
    topProfessionals,
  ] = await Promise.all([
    db.select({ count: count() }).from(professionals),
    db.select({ count: count() }).from(professionals).where(eq(professionals.is_verified, true)),
    db.select({ count: count() }).from(professionals).where(eq(professionals.is_premium, true)),
    db.select({ count: count() }).from(leads),
    db.select({ count: count() }).from(leads).where(eq(leads.status, 'new')),
    db.select({ count: count() }).from(reviews),
    db.select({ count: count() }).from(reviews).where(eq(reviews.status, 'pending')),
    db
      .select({
        id: leads.id,
        name: leads.name,
        email: leads.email,
        status: leads.status,
        professional_id: leads.professional_id,
        professional_name: professionals.name,
        professional_slug: professionals.slug,
      })
      .from(leads)
      .leftJoin(professionals, eq(leads.professional_id, professionals.id))
      .orderBy(desc(leads.created_at))
      .limit(5),
    db
      .select({
        id: professionals.id,
        name: professionals.name,
        slug: professionals.slug,
        avg_rating: professionals.avg_rating,
        review_count: professionals.review_count,
        lead_count: professionals.lead_count,
        view_count: professionals.view_count,
      })
      .from(professionals)
      .orderBy(desc(professionals.lead_count))
      .limit(5),
  ])

  return {
    professionals: professionalCount || 0,
    verified: verifiedCount || 0,
    premium: premiumCount || 0,
    leads: leadCount || 0,
    newLeads: newLeadCount || 0,
    reviews: reviewCount || 0,
    pendingReviews: pendingReviewCount || 0,
    recentLeads: recentLeads.map(l => ({
      id: l.id,
      name: l.name,
      email: l.email,
      status: l.status,
      professional: l.professional_name ? {
        name: l.professional_name,
        slug: l.professional_slug,
      } : null,
    })),
    topProfessionals: topProfessionals.map(p => ({
      ...p,
      avg_rating: Number(p.avg_rating),
    })),
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your professional directory
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Professionals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.professionals}</div>
            <p className="text-xs text-muted-foreground">
              {stats.verified} verified, {stats.premium} premium
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.leads}</div>
            <p className="text-xs text-muted-foreground">
              {stats.newLeads > 0 && (
                <span className="text-green-600 font-medium">
                  {stats.newLeads} new
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reviews</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reviews}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingReviews > 0 && (
                <span className="text-yellow-600 font-medium">
                  {stats.pendingReviews} pending moderation
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.pendingReviews > 0 && (
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href="/admin/reviews?status=pending">
                  <Star className="h-4 w-4 mr-2" />
                  Moderate Reviews ({stats.pendingReviews})
                </Link>
              </Button>
            )}
            {stats.newLeads > 0 && (
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href="/admin/leads?status=new">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  View New Leads ({stats.newLeads})
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Leads</CardTitle>
              <CardDescription>Latest inquiries from visitors</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/leads">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {stats.recentLeads.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No leads yet
              </p>
            ) : (
              <div className="space-y-4">
                {stats.recentLeads.map((lead: any) => (
                  <div
                    key={lead.id}
                    className="flex items-start justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{lead.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {lead.email}
                      </p>
                      {lead.professional && (
                        <p className="text-xs text-muted-foreground">
                          For: {lead.professional.name}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={lead.status === 'new' ? 'default' : 'secondary'}
                    >
                      {lead.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Professionals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Professionals</CardTitle>
              <CardDescription>Most contacted professionals</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/professionals">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {stats.topProfessionals.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No professionals yet
              </p>
            ) : (
              <div className="space-y-4">
                {stats.topProfessionals.map((pro: any, index: number) => (
                  <div
                    key={pro.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-muted-foreground w-6">
                        {index + 1}
                      </span>
                      <div>
                        <Link
                          href={`/professionals/${pro.slug}`}
                          className="font-medium hover:underline"
                        >
                          {pro.name}
                        </Link>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {pro.lead_count} leads
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {pro.view_count} views
                          </span>
                        </div>
                      </div>
                    </div>
                    {pro.avg_rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {pro.avg_rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
