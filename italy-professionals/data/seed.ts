/**
 * Seed script for Italy Professionals Directory
 *
 * This script seeds the Neon database with the existing professionals data.
 * Run with: npm run seed
 *
 * Make sure to set up your .env.local with:
 * - DATABASE_URL
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { categories, professionals } from '../lib/db/schema'

// Check for required env vars
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.error('Missing environment variables. Please set:')
  console.error('  DATABASE_URL')
  process.exit(1)
}

const sql = neon(databaseUrl)
const db = drizzle(sql)

// Helper to create URL-friendly slugs
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

// Categories data (matches the SQL migration)
const categoriesData = [
  {
    id: 'lawyer',
    name_en: 'Lawyer',
    name_it: 'Avvocato',
    plural_en: 'Lawyers',
    description:
      'Real estate lawyers help foreign buyers navigate Italian property law, review contracts, conduct due diligence, and can represent you with power of attorney.',
    why_needed:
      'Italian property contracts favor sellers. A lawyer protects your interests and can identify issues before you commit.',
    typical_fees: '€1,500 - €3,000 for a standard purchase, or 1-1.5% of property value',
    icon: 'Scale',
    display_order: 1,
  },
  {
    id: 'notary',
    name_en: 'Notary',
    name_it: 'Notaio',
    plural_en: 'Notaries',
    description:
      'Notaries are public officials required for all property transactions in Italy. They verify legal compliance and register the deed.',
    why_needed:
      'Legally required. The notary ensures the transaction is valid and registers ownership transfer.',
    typical_fees: '1-2.5% of declared property value (paid by buyer)',
    icon: 'Stamp',
    display_order: 2,
  },
  {
    id: 'geometra',
    name_en: 'Surveyor/Geometra',
    name_it: 'Geometra',
    plural_en: 'Surveyors',
    description:
      'Geometri are uniquely Italian professionals combining surveyor, inspector, and permit specialist roles. They verify property compliance and handle bureaucracy.',
    why_needed:
      'Essential for checking building compliance, catasto accuracy, and managing renovation permits.',
    typical_fees: '€300 - €1,500 depending on property complexity',
    icon: 'Ruler',
    display_order: 3,
  },
  {
    id: 'architect',
    name_en: 'Architect',
    name_it: 'Architetto',
    plural_en: 'Architects',
    description:
      'Architects design renovations and new constructions, obtain permits, and oversee building work.',
    why_needed:
      'Required for significant renovations or when design expertise is needed. Can manage the entire project.',
    typical_fees: '8-15% of construction costs, or fixed fee for smaller projects',
    icon: 'Compass',
    display_order: 4,
  },
  {
    id: 'real_estate_agent',
    name_en: 'Real Estate Agent',
    name_it: 'Agente Immobiliare',
    plural_en: 'Real Estate Agents',
    description:
      'Licensed agents help find properties, arrange viewings, and facilitate negotiations between buyers and sellers.',
    why_needed:
      'Access to listings, local market knowledge, and negotiation support. Some specialize in foreign buyers.',
    typical_fees: '3-4% of purchase price + 22% VAT (paid by buyer)',
    icon: 'Home',
    display_order: 5,
  },
  {
    id: 'accountant',
    name_en: 'Accountant',
    name_it: 'Commercialista',
    plural_en: 'Accountants',
    description:
      'Commercialisti handle tax registration, annual declarations, rental income reporting, and tax optimization strategies.',
    why_needed:
      'Italian tax obligations are complex. Essential for rental income, residency tax implications, and ongoing compliance.',
    typical_fees: '€500 - €2,000/year for property tax management',
    icon: 'Calculator',
    display_order: 6,
  },
  {
    id: 'property_manager',
    name_en: 'Property Manager',
    name_it: 'Property Manager',
    plural_en: 'Property Managers',
    description:
      'Property managers handle rentals, maintenance, bill payments, and property oversight for absentee owners.',
    why_needed:
      "Essential if you don't live in Italy full-time. Handles guests, emergencies, and regular maintenance.",
    typical_fees: '15-25% of rental income, or fixed monthly fee',
    icon: 'Key',
    display_order: 7,
  },
  {
    id: 'contractor',
    name_en: 'Contractor/Builder',
    name_it: 'Impresa Edile',
    plural_en: 'Contractors',
    description:
      'Building contractors handle renovation and construction work, from minor repairs to complete restorations.',
    why_needed:
      'Quality contractors who understand foreign client expectations and communicate in English are valuable.',
    typical_fees: 'Varies by project scope. Get multiple quotes.',
    icon: 'Hammer',
    display_order: 8,
  },
]

// Sample professionals data - this is a subset, the full data would be imported from the Python file
const professionalsData = [
  // LAWYERS
  {
    name: 'Italian Real Estate Lawyers (IREL)',
    contact_person: 'Marco',
    category: 'lawyer',
    regions: ['all'],
    cities: [],
    languages: ['English', 'Spanish', 'Italian'],
    website: 'https://italianrealestatelawyers.com/',
    email: null,
    phone: null,
    description:
      'Specializes in Italian real estate, tax, and immigration law for international clients. Marco worked in New York with firms specializing in cross-border real estate transactions before joining.',
    services: [
      'Property purchase assistance',
      'Due diligence',
      'Contract review',
      'Power of attorney representation',
      'Residency and visa support',
      'Tax planning',
    ],
    highlights: [
      'US cross-border experience',
      'Can represent with power of attorney',
      'Full purchase transaction support',
    ],
    is_verified: true,
    is_featured: true,
  },
  {
    name: 'Italian Property Lawyers',
    contact_person: null,
    category: 'lawyer',
    regions: ['all'],
    cities: [],
    languages: ['English', 'Italian'],
    website: 'https://www.italianpropertylawyers.com/',
    email: null,
    phone: null,
    description:
      'Team of lawyers, real estate agents, architects, and property managers with over 100 years combined experience working with international clients purchasing Italian real estate.',
    services: [
      'Full purchase transaction support',
      'Due diligence',
      'Contract negotiation',
      'Property management referrals',
      'Architectural services coordination',
    ],
    highlights: [
      '100+ years combined experience',
      'Multi-disciplinary team',
      'Nationwide coverage',
    ],
    is_verified: true,
    is_featured: true,
  },
  {
    name: 'Giambrone & Partners',
    contact_person: null,
    category: 'lawyer',
    regions: ['all'],
    cities: ['Milan', 'Rome', 'Palermo', 'London'],
    languages: ['English', 'Italian', 'French', 'German'],
    website: 'https://www.giambronelaw.com/',
    email: null,
    phone: null,
    description:
      'International law firm with offices in Italy and UK. Extensive experience helping UK, Irish, US, and Scandinavian buyers purchase residential property in Italy.',
    services: ['Property purchase', 'Due diligence', 'Tax advice', 'Immigration', 'Litigation'],
    highlights: ['UK and Italy offices', 'Large international firm', 'Multi-language support'],
    is_verified: true,
    is_featured: true,
  },
  {
    name: 'My Lawyer in Italy (MLI)',
    contact_person: null,
    category: 'lawyer',
    regions: ['all'],
    cities: [],
    languages: ['English', 'Italian'],
    website: 'https://www.mylawyerinitaly.com/',
    email: null,
    phone: null,
    description:
      'Supports foreign purchasers/sellers and expat communities with strategic legal support. Experienced in both residential and investment properties.',
    services: [
      'Property buying and selling',
      'Residency applications',
      'Contract review',
      'Legal consultations',
    ],
    highlights: ['Expat community focus', 'Clear communication style', 'Residential and investment'],
    is_verified: true,
    is_featured: false,
  },
  {
    name: 'ILF Law Firm',
    contact_person: null,
    category: 'lawyer',
    regions: ['toscana'],
    cities: ['Florence'],
    languages: ['English', 'Spanish', 'Italian'],
    website: 'https://italylawfirms.com/en/',
    email: null,
    phone: null,
    description:
      'Established in 2001 in Florence, recognized as a top firm for international transactions. Includes Italian lawyers fluent in English and English lawyers specialized in Italian affairs.',
    services: [
      'Real estate transactions',
      'Notary coordination',
      'Accounting services',
      'Architectural referrals',
    ],
    highlights: ['Tuscany specialist', 'Established 2001', 'Full-service for foreigners'],
    is_verified: true,
    is_featured: false,
  },
  {
    name: 'Legal Real Estate Italy (Aliant)',
    contact_person: 'Claudia',
    category: 'lawyer',
    regions: ['all'],
    cities: [],
    languages: ['English', 'Italian'],
    website: 'https://www.legalrealestateitaly.it/',
    email: null,
    phone: null,
    description:
      'Founded by Claudia, an experienced real estate lawyer with 25+ years experience and background as an attorney in California. Part of Aliant international law firm network.',
    services: ['Property acquisitions', 'Due diligence', 'International investor support'],
    highlights: ['California bar experience', '25+ years experience', 'International law firm network'],
    is_verified: true,
    is_featured: false,
  },
  // ACCOUNTANTS
  {
    name: 'EXPATH',
    contact_person: null,
    category: 'accountant',
    regions: ['all'],
    cities: [],
    languages: ['English', 'Spanish', 'German', 'Italian'],
    website: 'https://www.expath.it/',
    email: null,
    phone: null,
    description:
      'English-speaking team focused on international clients, providing tax services specifically targeted to expat needs in Italy.',
    services: [
      'Expat tax returns',
      'Codice fiscale assistance',
      'Property tax management',
      'Rental income declarations',
      'Tax residency advice',
    ],
    highlights: ['Expat specialist', 'Multi-language team', 'Online services available'],
    is_verified: true,
    is_featured: true,
  },
  {
    name: 'Accounting Bolla',
    contact_person: null,
    category: 'accountant',
    regions: ['all'],
    cities: [],
    languages: ['English', 'Italian'],
    website: 'https://accountingbolla.com/',
    email: null,
    phone: null,
    description:
      'Provides expat tax and immigration resources with a streamlined 5-step tax return filing process.',
    services: ['Expat tax filing', 'Immigration support', 'Business setup', 'Ongoing compliance'],
    highlights: ['Simple 5-step process', 'Expat resources', 'Immigration support'],
    is_verified: true,
    is_featured: false,
  },
  {
    name: 'My Italian Accountant',
    contact_person: 'Filippo',
    category: 'accountant',
    regions: ['all'],
    cities: [],
    languages: ['English', 'Italian'],
    website: 'https://myitalianaccountant.com/',
    email: null,
    phone: null,
    description:
      'Filippo is an English-speaking Italian chartered accountant (Commercialista) who guides clients through Italian taxation in an easy-to-understand way.',
    services: ['Business accounting', 'Personal tax', 'Property taxation', 'Company formation'],
    highlights: ['Chartered accountant', 'Clear explanations', 'Business and personal'],
    is_verified: true,
    is_featured: true,
  },
  // REAL ESTATE AGENTS
  {
    name: 'Norton Tanzarella',
    contact_person: 'Alex',
    category: 'real_estate_agent',
    regions: ['puglia'],
    cities: [],
    languages: ['English', 'Italian'],
    website: 'https://nortontanzarella.com/',
    email: null,
    phone: null,
    description:
      'Italian real estate agency tailored towards foreigners looking to migrate to Italy. Alex (native English speaker) guides clients through Italian legislation requirements.',
    services: ['Property search', 'Viewing arrangement', 'Purchase guidance', 'Relocation support'],
    highlights: ['Native English speaker', 'Puglia specialist', 'Migration focus'],
    is_verified: true,
    is_featured: true,
  },
  {
    name: 'Abode Italy',
    contact_person: 'Paul & Nick',
    category: 'real_estate_agent',
    regions: ['toscana', 'umbria'],
    cities: [],
    languages: ['English', 'Italian'],
    website: 'https://www.abodeitaly.com/',
    email: null,
    phone: null,
    description:
      'Co-founded by British expats Paul and Nick who relocated to Tuscany & Umbria. First-hand experience of challenges buying property as foreigners. 70+ years combined experience.',
    services: [
      'Property search',
      'Purchase support',
      'Property management',
      'Renovation coordination',
    ],
    highlights: [
      'British expat founders',
      '70+ years experience',
      'Also offer property management',
    ],
    is_verified: true,
    is_featured: true,
  },
  {
    name: 'Italy House Hunting / Alba Toscana',
    contact_person: 'Kris Mahieu',
    category: 'real_estate_agent',
    regions: [
      'toscana',
      'umbria',
      'marche',
      'abruzzo',
      'liguria',
      'puglia',
      'piemonte',
      'lazio',
      'sicilia',
      'sardegna',
    ],
    cities: [],
    languages: ['English', 'Italian', 'Dutch', 'French'],
    website: 'https://www.italyhousehunting.com/',
    email: null,
    phone: null,
    description:
      'Kris Mahieu, originally from Belgium with 15+ years in Italy, has a university degree as English-Italian translator and Italian real estate license. Helps customers worldwide since 2009.',
    services: [
      'Multi-region property search',
      'Translation services',
      'Purchase coordination',
      'Viewing trips',
    ],
    highlights: ['Multi-region coverage', 'Professional translator', 'Licensed real estate agent'],
    is_verified: true,
    is_featured: true,
  },
  // GEOMETRA / SURVEYORS
  {
    name: 'Geometra Services Italy',
    contact_person: null,
    category: 'geometra',
    regions: ['toscana', 'umbria'],
    cities: [],
    languages: ['English', 'Italian'],
    website: 'https://www.geometraservicesitaly.com/',
    email: null,
    phone: null,
    description:
      'English-speaking geometra services specializing in property surveys, building permits, and cadastral services for foreign buyers.',
    services: [
      'Property surveys',
      'Building permits',
      'Cadastral services',
      'Compliance checks',
      'Renovation permits',
    ],
    highlights: ['Tuscany & Umbria specialists', 'English communication', 'Full technical support'],
    is_verified: true,
    is_featured: true,
  },
  // ARCHITECTS
  {
    name: 'Studio Bacciardi',
    contact_person: 'Alessandro Bacciardi',
    category: 'architect',
    regions: ['toscana'],
    cities: ['Arezzo', 'Florence'],
    languages: ['English', 'Italian'],
    website: 'https://www.studiobacciardi.com/',
    email: null,
    phone: null,
    description:
      'Tuscan architecture firm specializing in restoration of historic properties and modern sustainable design. Experience with international clients.',
    services: [
      'Architectural design',
      'Historic restoration',
      'Project management',
      'Building permits',
      'Interior design',
    ],
    highlights: [
      'Historic restoration expertise',
      'Sustainable design',
      'International client experience',
    ],
    is_verified: true,
    is_featured: true,
  },
  // PROPERTY MANAGERS
  {
    name: 'Tuscany Property Management',
    contact_person: null,
    category: 'property_manager',
    regions: ['toscana'],
    cities: [],
    languages: ['English', 'Italian'],
    website: 'https://www.tuscanypropertymanagement.com/',
    email: null,
    phone: null,
    description:
      'Full-service property management for vacation rentals and second homes in Tuscany. Handles everything from guest services to maintenance.',
    services: [
      'Vacation rental management',
      'Guest services',
      'Maintenance coordination',
      'Bill payment',
      'Property inspection',
    ],
    highlights: ['Full-service management', 'Vacation rental specialists', 'Bilingual team'],
    is_verified: true,
    is_featured: true,
  },
  // CONTRACTORS
  {
    name: 'Tuscan Restoration',
    contact_person: 'Marco',
    category: 'contractor',
    regions: ['toscana'],
    cities: [],
    languages: ['English', 'Italian'],
    website: 'https://www.tuscanrestoration.com/',
    email: null,
    phone: null,
    description:
      'Specialized in restoring Tuscan farmhouses and historic properties. Team includes craftsmen experienced in traditional techniques and modern building standards.',
    services: [
      'Full restoration',
      'Structural work',
      'Traditional techniques',
      'Modern updates',
      'Project management',
    ],
    highlights: ['Farmhouse restoration specialists', 'Traditional craftsmanship', 'English-speaking project manager'],
    is_verified: true,
    is_featured: true,
  },
  // NOTARIES
  {
    name: 'Notaio Rossi Studio',
    contact_person: 'Dr. Rossi',
    category: 'notary',
    regions: ['toscana'],
    cities: ['Florence', 'Siena'],
    languages: ['English', 'Italian'],
    website: null,
    email: null,
    phone: null,
    description:
      'English-speaking notary office in Tuscany with extensive experience handling international property transactions. Clear communication with foreign buyers.',
    services: [
      'Property deed preparation',
      'Contract verification',
      'Registration services',
      'International document handling',
    ],
    highlights: ['English-speaking staff', 'International transaction experience', 'Clear explanations'],
    is_verified: true,
    is_featured: true,
  },
]

async function seedCategories() {
  console.log('Seeding categories...')

  // Check if categories already exist
  const existing = await db.select().from(categories)
  if (existing.length > 0) {
    console.log(`Categories already exist (${existing.length}). Skipping...`)
    return
  }

  await db.insert(categories).values(categoriesData)

  console.log(`Seeded ${categoriesData.length} categories`)
}

async function seedProfessionals() {
  console.log('Seeding professionals...')

  // Check if professionals already exist
  const existing = await db.select().from(professionals)
  if (existing.length > 0) {
    console.log(`Professionals already exist (${existing.length}). Skipping...`)
    return
  }

  // Generate slugs and prepare data
  const professionalsWithSlugs = professionalsData.map((pro, index) => {
    const baseSlug = slugify(pro.name)
    return {
      ...pro,
      slug: `${baseSlug}-${index + 1}`,
      is_premium: pro.is_featured, // Make featured ones premium too for demo
      view_count: Math.floor(Math.random() * 500) + 50,
      lead_count: Math.floor(Math.random() * 30) + 5,
    }
  })

  await db.insert(professionals).values(professionalsWithSlugs)

  console.log(`Seeded ${professionalsWithSlugs.length} professionals`)
}

async function main() {
  console.log('Starting seed...')
  console.log('Database URL:', databaseUrl?.replace(/:[^:@]+@/, ':****@'))

  try {
    await seedCategories()
    await seedProfessionals()
    console.log('Seed completed successfully!')
  } catch (error) {
    console.error('Seed failed:', error)
    process.exit(1)
  }
}

main()
