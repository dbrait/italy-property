import Link from 'next/link'
import { MapPin } from 'lucide-react'

const footerLinks = {
  categories: [
    { name: 'Lawyers', href: '/professionals?category=lawyer' },
    { name: 'Notaries', href: '/professionals?category=notary' },
    { name: 'Surveyors', href: '/professionals?category=geometra' },
    { name: 'Architects', href: '/professionals?category=architect' },
    { name: 'Real Estate Agents', href: '/professionals?category=real_estate_agent' },
    { name: 'Accountants', href: '/professionals?category=accountant' },
    { name: 'Property Managers', href: '/professionals?category=property_manager' },
    { name: 'Contractors', href: '/professionals?category=contractor' },
  ],
  regions: [
    { name: 'Tuscany', href: '/professionals?region=toscana' },
    { name: 'Umbria', href: '/professionals?region=umbria' },
    { name: 'Liguria', href: '/professionals?region=liguria' },
    { name: 'Puglia', href: '/professionals?region=puglia' },
    { name: 'Sicily', href: '/professionals?region=sicilia' },
    { name: 'Lombardy', href: '/professionals?region=lombardia' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Request Removal', href: '/removal-request' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary">
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold">Italy Professionals</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Find trusted English-speaking professionals for your Italian property
              journey. Lawyers, notaries, surveyors, and more.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Regions */}
          <div>
            <h3 className="font-semibold mb-4">Popular Regions</h3>
            <ul className="space-y-2">
              {footerLinks.regions.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} Italy Professionals. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
