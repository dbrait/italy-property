import { Metadata } from 'next'
import Link from 'next/link'
import { Mail, Phone, MapPin, Calendar, ExternalLink } from 'lucide-react'
import { db, leads, professionals } from '@/lib/db'
import { eq, desc } from 'drizzle-orm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDate } from '@/lib/utils'
import type { Lead } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Manage Leads | Admin',
}

interface PageProps {
  searchParams: {
    status?: string
    page?: string
  }
}

async function getLeads(status?: string) {
  let query = db
    .select({
      id: leads.id,
      name: leads.name,
      email: leads.email,
      phone: leads.phone,
      country: leads.country,
      message: leads.message,
      property_type: leads.property_type,
      budget_range: leads.budget_range,
      timeline: leads.timeline,
      status: leads.status,
      created_at: leads.created_at,
      professional_id: leads.professional_id,
      professional_name: professionals.name,
      professional_slug: professionals.slug,
      professional_category: professionals.category,
    })
    .from(leads)
    .leftJoin(professionals, eq(leads.professional_id, professionals.id))
    .orderBy(desc(leads.created_at))
    .$dynamic()

  if (status && status !== 'all') {
    query = query.where(eq(leads.status, status))
  }

  const data = await query

  return data.map(l => ({
    ...l,
    professional: l.professional_name ? {
      id: l.professional_id,
      name: l.professional_name,
      slug: l.professional_slug,
      category: l.professional_category,
    } : null,
  }))
}

const statusColors: Record<string, 'default' | 'secondary' | 'success' | 'outline'> = {
  new: 'default',
  contacted: 'secondary',
  converted: 'success',
  archived: 'outline',
}

export default async function LeadsPage({ searchParams }: PageProps) {
  const leadsData = await getLeads(searchParams.status)
  const currentStatus = searchParams.status || 'all'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-muted-foreground">
            Manage contact inquiries from visitors
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select defaultValue={currentStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <Link href="/admin/leads" className="block w-full">
                All Statuses
              </Link>
            </SelectItem>
            <SelectItem value="new">
              <Link href="/admin/leads?status=new" className="block w-full">
                New
              </Link>
            </SelectItem>
            <SelectItem value="contacted">
              <Link href="/admin/leads?status=contacted" className="block w-full">
                Contacted
              </Link>
            </SelectItem>
            <SelectItem value="converted">
              <Link href="/admin/leads?status=converted" className="block w-full">
                Converted
              </Link>
            </SelectItem>
            <SelectItem value="archived">
              <Link href="/admin/leads?status=archived" className="block w-full">
                Archived
              </Link>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Leads List */}
      {leadsData.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No leads found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {leadsData.map((lead: any) => (
            <Card key={lead.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">{lead.name}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            <a href={`mailto:${lead.email}`} className="hover:underline">
                              {lead.email}
                            </a>
                          </span>
                          {lead.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              <a href={`tel:${lead.phone}`} className="hover:underline">
                                {lead.phone}
                              </a>
                            </span>
                          )}
                          {lead.country && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {lead.country}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge variant={statusColors[lead.status] || 'outline'}>
                        {lead.status}
                      </Badge>
                    </div>

                    {/* Professional */}
                    {lead.professional && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">For: </span>
                        <Link
                          href={`/professionals/${lead.professional.slug}`}
                          className="font-medium hover:underline"
                        >
                          {lead.professional.name}
                        </Link>
                        <span className="text-muted-foreground ml-1">
                          ({lead.professional.category})
                        </span>
                      </div>
                    )}

                    {/* Message */}
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm whitespace-pre-wrap">{lead.message}</p>
                    </div>

                    {/* Additional Info */}
                    {(lead.property_type || lead.budget_range || lead.timeline) && (
                      <div className="flex flex-wrap gap-2">
                        {lead.property_type && (
                          <Badge variant="outline">{lead.property_type}</Badge>
                        )}
                        {lead.budget_range && (
                          <Badge variant="outline">{lead.budget_range}</Badge>
                        )}
                        {lead.timeline && (
                          <Badge variant="outline">{lead.timeline}</Badge>
                        )}
                      </div>
                    )}

                    {/* Date */}
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(lead.created_at)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <a href={`mailto:${lead.email}`}>
                        <Mail className="h-4 w-4 mr-1" />
                        Reply
                      </a>
                    </Button>
                    {lead.professional && (
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/professionals/${lead.professional.slug}`}>
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Pro
                        </Link>
                      </Button>
                    )}
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
