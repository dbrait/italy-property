// TypeScript interfaces for the Italy Professionals Directory

export interface Professional {
  id: string
  slug: string
  name: string
  contact_person: string | null
  category: CategoryId
  regions: string[]
  cities: string[]
  languages: string[]
  website: string | null
  email: string | null
  phone: string | null
  description: string | null
  services: string[]
  highlights: string[]
  is_verified: boolean
  is_featured: boolean
  is_premium: boolean
  premium_until: string | null
  view_count: number
  lead_count: number
  avg_rating: number
  review_count: number
  created_at: string
  updated_at: string
}

export type CategoryId =
  | 'lawyer'
  | 'notary'
  | 'geometra'
  | 'architect'
  | 'real_estate_agent'
  | 'accountant'
  | 'property_manager'
  | 'contractor'

export interface Category {
  id: CategoryId
  name_en: string
  name_it: string
  plural_en: string
  description: string | null
  why_needed: string | null
  typical_fees: string | null
  icon: string | null
  display_order: number
}

export interface Lead {
  id: string
  professional_id: string
  name: string
  email: string
  phone: string | null
  country: string | null
  message: string
  property_type: string | null
  budget_range: string | null
  timeline: string | null
  status: LeadStatus
  created_at: string
  professional?: Professional
}

export type LeadStatus = 'new' | 'contacted' | 'converted' | 'archived'

export interface Review {
  id: string
  professional_id: string
  user_id: string | null
  author_name: string
  author_country: string | null
  rating: number
  title: string | null
  content: string
  service_used: string | null
  is_verified_purchase: boolean
  status: ReviewStatus
  admin_notes: string | null
  created_at: string
  professional?: Professional
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected'

export interface AdminUser {
  id: string
  email: string
  role: 'admin' | 'moderator'
  created_at: string
}

// Form types
export interface ContactFormData {
  name: string
  email: string
  phone?: string
  country?: string
  message: string
  property_type?: string
  budget_range?: string
  timeline?: string
}

export interface ReviewFormData {
  rating: number
  title?: string
  content: string
  author_name: string
  author_country?: string
  service_used?: string
}

// Filter types
export interface ProfessionalFilters {
  category?: CategoryId
  regions?: string[]
  languages?: string[]
  verified_only?: boolean
  search?: string
  sort?: 'rating' | 'reviews' | 'name' | 'newest'
  page?: number
  per_page?: number
}

// Italian regions
export const ITALIAN_REGIONS = [
  'abruzzo',
  'basilicata',
  'calabria',
  'campania',
  'emilia-romagna',
  'friuli-venezia-giulia',
  'lazio',
  'liguria',
  'lombardia',
  'marche',
  'molise',
  'piemonte',
  'puglia',
  'sardegna',
  'sicilia',
  'toscana',
  'trentino-alto-adige',
  'umbria',
  'valle-d-aosta',
  'veneto',
] as const

export const REGION_DISPLAY_NAMES: Record<string, string> = {
  'abruzzo': 'Abruzzo',
  'basilicata': 'Basilicata',
  'calabria': 'Calabria',
  'campania': 'Campania',
  'emilia-romagna': 'Emilia-Romagna',
  'friuli-venezia-giulia': 'Friuli-Venezia Giulia',
  'lazio': 'Lazio',
  'liguria': 'Liguria',
  'lombardia': 'Lombardia',
  'marche': 'Marche',
  'molise': 'Molise',
  'piemonte': 'Piemonte',
  'puglia': 'Puglia',
  'sardegna': 'Sardegna',
  'sicilia': 'Sicilia',
  'toscana': 'Toscana',
  'trentino-alto-adige': 'Trentino-Alto Adige',
  'umbria': 'Umbria',
  'valle-d-aosta': "Valle d'Aosta",
  'veneto': 'Veneto',
  'all': 'All Italy',
}

export const LANGUAGES = [
  'English',
  'Italian',
  'French',
  'German',
  'Spanish',
  'Dutch',
  'Portuguese',
  'Russian',
  'Chinese',
  'Japanese',
] as const

export const PROPERTY_TYPES = [
  'Apartment',
  'House/Villa',
  'Farmhouse/Rustico',
  'Land/Plot',
  'Commercial',
  'Other',
] as const

export const BUDGET_RANGES = [
  'Under €100,000',
  '€100,000 - €250,000',
  '€250,000 - €500,000',
  '€500,000 - €1,000,000',
  'Over €1,000,000',
] as const

export const TIMELINES = [
  'Actively searching now',
  'Within 3 months',
  'Within 6 months',
  'Within 1 year',
  'Just exploring',
] as const
