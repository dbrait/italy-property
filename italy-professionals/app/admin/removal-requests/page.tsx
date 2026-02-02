import { Metadata } from 'next'
import { Mail, Phone, Calendar, AlertTriangle } from 'lucide-react'
import { neon } from '@neondatabase/serverless'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { RemovalRequest } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Removal Requests | Admin',
}

export const dynamic = 'force-dynamic'

async function getRemovalRequests(): Promise<RemovalRequest[]> {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const data = await sql`
      SELECT * FROM removal_requests
      ORDER BY created_at DESC
    `
    return data as RemovalRequest[]
  } catch (error) {
    console.error('Error in getRemovalRequests:', error)
    return []
  }
}

const statusColors: Record<string, 'default' | 'secondary' | 'success' | 'destructive'> = {
  pending: 'default',
  approved: 'success',
  rejected: 'destructive',
  completed: 'secondary',
}

export default async function RemovalRequestsPage() {
  const requests = await getRemovalRequests()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Removal Requests</h1>
          <p className="text-muted-foreground">
            Manage listing removal requests from professionals
          </p>
        </div>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No removal requests yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">{request.business_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Requested by: {request.contact_name}
                        </p>
                      </div>
                      <Badge variant={statusColors[request.status || 'pending']}>
                        {request.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${request.email}`} className="hover:underline">
                          {request.email}
                        </a>
                      </span>
                      {request.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {request.phone}
                        </span>
                      )}
                    </div>

                    {request.listing_url && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Listing: </span>
                        <a
                          href={request.listing_url}
                          className="text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {request.listing_url}
                        </a>
                      </div>
                    )}

                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm font-medium mb-1">Reason for removal:</p>
                      <p className="text-sm whitespace-pre-wrap">{request.reason}</p>
                    </div>

                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(request.created_at)}
                    </p>
                  </div>

                  <div className="flex lg:flex-col gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <a href={`mailto:${request.email}`}>
                        <Mail className="h-4 w-4 mr-1" />
                        Reply
                      </a>
                    </Button>
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
