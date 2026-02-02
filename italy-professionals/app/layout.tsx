import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Italy Professionals - Find English-Speaking Experts for Property',
    template: '%s | Italy Professionals',
  },
  description:
    'Find trusted English-speaking professionals for your Italian property purchase. Connect with lawyers, notaries, surveyors, architects, and more.',
  keywords: [
    'Italian property lawyer',
    'Italy notary English',
    'geometra Italy',
    'Italian real estate professional',
    'English speaking lawyer Italy',
    'buy property Italy',
    'Italian property purchase',
  ],
  authors: [{ name: 'Italy Professionals' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://italyprofessionals.com',
    siteName: 'Italy Professionals',
    title: 'Italy Professionals - Find English-Speaking Experts',
    description:
      'Find trusted English-speaking professionals for your Italian property purchase.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Italy Professionals',
    description:
      'Find trusted English-speaking professionals for your Italian property purchase.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
