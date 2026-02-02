import Link from 'next/link'
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Star,
  Settings,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Professionals', href: '/admin/professionals', icon: Users },
  { name: 'Leads', href: '/admin/leads', icon: MessageSquare },
  { name: 'Reviews', href: '/admin/reviews', icon: Star },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col border-r bg-muted/30">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="px-4 mb-6">
            <h2 className="text-lg font-semibold">Admin Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              Manage your directory
            </p>
          </div>
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors'
                )}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="px-2 mt-auto">
            <Link
              href="/"
              className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-muted-foreground"
            >
              <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
              Exit Admin
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
        <nav className="flex justify-around py-2">
          {navigation.slice(0, 4).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <item.icon className="h-5 w-5 mb-1" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
