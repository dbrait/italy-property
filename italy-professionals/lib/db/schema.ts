import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  uuid,
  numeric,
} from 'drizzle-orm/pg-core'

// ============================================================================
// CATEGORIES TABLE
// ============================================================================
export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name_en: text('name_en').notNull(),
  name_it: text('name_it').notNull(),
  plural_en: text('plural_en').notNull(),
  description: text('description'),
  why_needed: text('why_needed'),
  typical_fees: text('typical_fees'),
  icon: text('icon'),
  display_order: integer('display_order').default(0),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

// ============================================================================
// PROFESSIONALS TABLE
// ============================================================================
export const professionals = pgTable('professionals', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').unique().notNull(),
  name: text('name').notNull(),
  contact_person: text('contact_person'),
  category: text('category').notNull().references(() => categories.id),
  regions: text('regions').array().notNull().default([]),
  cities: text('cities').array().default([]),
  languages: text('languages').array().notNull().default([]),
  website: text('website'),
  email: text('email'),
  phone: text('phone'),
  description: text('description'),
  services: text('services').array().default([]),
  highlights: text('highlights').array().default([]),

  // Commercial fields
  is_verified: boolean('is_verified').default(false),
  is_featured: boolean('is_featured').default(false),
  is_premium: boolean('is_premium').default(false),
  premium_until: timestamp('premium_until', { withTimezone: true }),

  // Stats
  view_count: integer('view_count').default(0),
  lead_count: integer('lead_count').default(0),
  avg_rating: numeric('avg_rating', { precision: 2, scale: 1 }).default('0'),
  review_count: integer('review_count').default(0),

  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

// ============================================================================
// LEADS TABLE
// ============================================================================
export const leads = pgTable('leads', {
  id: uuid('id').primaryKey().defaultRandom(),
  professional_id: uuid('professional_id').references(() => professionals.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  country: text('country'),
  message: text('message').notNull(),
  property_type: text('property_type'),
  budget_range: text('budget_range'),
  timeline: text('timeline'),
  status: text('status').default('new'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

// ============================================================================
// REVIEWS TABLE
// ============================================================================
export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  professional_id: uuid('professional_id').references(() => professionals.id, { onDelete: 'cascade' }),
  user_id: uuid('user_id'),
  author_name: text('author_name').notNull(),
  author_country: text('author_country'),
  rating: integer('rating').notNull(),
  title: text('title'),
  content: text('content').notNull(),
  service_used: text('service_used'),
  is_verified_purchase: boolean('is_verified_purchase').default(false),
  status: text('status').default('pending'),
  admin_notes: text('admin_notes'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

// ============================================================================
// ADMIN USERS TABLE
// ============================================================================
export const admin_users = pgTable('admin_users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull(),
  role: text('role').default('admin'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

// ============================================================================
// REMOVAL REQUESTS TABLE
// ============================================================================
export const removal_requests = pgTable('removal_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  business_name: text('business_name').notNull(),
  contact_name: text('contact_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  listing_url: text('listing_url'),
  reason: text('reason').notNull(),
  status: text('status').default('pending'),
  admin_notes: text('admin_notes'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

// Type exports for use in the application
export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert

export type Professional = typeof professionals.$inferSelect
export type NewProfessional = typeof professionals.$inferInsert

export type Lead = typeof leads.$inferSelect
export type NewLead = typeof leads.$inferInsert

export type Review = typeof reviews.$inferSelect
export type NewReview = typeof reviews.$inferInsert

export type AdminUser = typeof admin_users.$inferSelect
export type NewAdminUser = typeof admin_users.$inferInsert

export type RemovalRequest = typeof removal_requests.$inferSelect
export type NewRemovalRequest = typeof removal_requests.$inferInsert
