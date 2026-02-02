-- Italy Professionals Directory Schema
-- Run this in the Supabase SQL editor to create the database schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CATEGORIES TABLE
-- ============================================================================
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_it TEXT NOT NULL,
  plural_en TEXT NOT NULL,
  description TEXT,
  why_needed TEXT,
  typical_fees TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed categories
INSERT INTO categories (id, name_en, name_it, plural_en, description, why_needed, typical_fees, icon, display_order) VALUES
  ('lawyer', 'Lawyer', 'Avvocato', 'Lawyers', 'Real estate lawyers help foreign buyers navigate Italian property law, review contracts, conduct due diligence, and can represent you with power of attorney.', 'Italian property contracts favor sellers. A lawyer protects your interests and can identify issues before you commit.', '€1,500 - €3,000 for a standard purchase, or 1-1.5% of property value', 'Scale', 1),
  ('notary', 'Notary', 'Notaio', 'Notaries', 'Notaries are public officials required for all property transactions in Italy. They verify legal compliance and register the deed.', 'Legally required. The notary ensures the transaction is valid and registers ownership transfer.', '1-2.5% of declared property value (paid by buyer)', 'Stamp', 2),
  ('geometra', 'Surveyor/Geometra', 'Geometra', 'Surveyors', 'Geometri are uniquely Italian professionals combining surveyor, inspector, and permit specialist roles. They verify property compliance and handle bureaucracy.', 'Essential for checking building compliance, catasto accuracy, and managing renovation permits.', '€300 - €1,500 depending on property complexity', 'Ruler', 3),
  ('architect', 'Architect', 'Architetto', 'Architects', 'Architects design renovations and new constructions, obtain permits, and oversee building work.', 'Required for significant renovations or when design expertise is needed. Can manage the entire project.', '8-15% of construction costs, or fixed fee for smaller projects', 'Compass', 4),
  ('real_estate_agent', 'Real Estate Agent', 'Agente Immobiliare', 'Real Estate Agents', 'Licensed agents help find properties, arrange viewings, and facilitate negotiations between buyers and sellers.', 'Access to listings, local market knowledge, and negotiation support. Some specialize in foreign buyers.', '3-4% of purchase price + 22% VAT (paid by buyer)', 'Home', 5),
  ('accountant', 'Accountant', 'Commercialista', 'Accountants', 'Commercialisti handle tax registration, annual declarations, rental income reporting, and tax optimization strategies.', 'Italian tax obligations are complex. Essential for rental income, residency tax implications, and ongoing compliance.', '€500 - €2,000/year for property tax management', 'Calculator', 6),
  ('property_manager', 'Property Manager', 'Property Manager', 'Property Managers', 'Property managers handle rentals, maintenance, bill payments, and property oversight for absentee owners.', 'Essential if you don''t live in Italy full-time. Handles guests, emergencies, and regular maintenance.', '15-25% of rental income, or fixed monthly fee', 'Key', 7),
  ('contractor', 'Contractor/Builder', 'Impresa Edile', 'Contractors', 'Building contractors handle renovation and construction work, from minor repairs to complete restorations.', 'Quality contractors who understand foreign client expectations and communicate in English are valuable.', 'Varies by project scope. Get multiple quotes.', 'Hammer', 8);

-- ============================================================================
-- PROFESSIONALS TABLE
-- ============================================================================
CREATE TABLE professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  contact_person TEXT,
  category TEXT NOT NULL REFERENCES categories(id),
  regions TEXT[] NOT NULL DEFAULT '{}',
  cities TEXT[] DEFAULT '{}',
  languages TEXT[] NOT NULL DEFAULT '{}',
  website TEXT,
  email TEXT,
  phone TEXT,
  description TEXT,
  services TEXT[] DEFAULT '{}',
  highlights TEXT[] DEFAULT '{}',

  -- Commercial fields
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  premium_until TIMESTAMPTZ,

  -- Stats
  view_count INTEGER DEFAULT 0,
  lead_count INTEGER DEFAULT 0,
  avg_rating NUMERIC(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for common queries
CREATE INDEX idx_professionals_category ON professionals(category);
CREATE INDEX idx_professionals_regions ON professionals USING GIN(regions);
CREATE INDEX idx_professionals_is_featured ON professionals(is_featured) WHERE is_featured = true;
CREATE INDEX idx_professionals_is_premium ON professionals(is_premium) WHERE is_premium = true;
CREATE INDEX idx_professionals_slug ON professionals(slug);

-- ============================================================================
-- LEADS TABLE
-- ============================================================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  message TEXT NOT NULL,
  property_type TEXT,
  budget_range TEXT,
  timeline TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for admin queries
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_professional_id ON leads(professional_id);

-- ============================================================================
-- REVIEWS TABLE
-- ============================================================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_country TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT NOT NULL,
  service_used TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for queries
CREATE INDEX idx_reviews_professional_id ON reviews(professional_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- ============================================================================
-- ADMIN USERS TABLE
-- ============================================================================
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'moderator')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Categories: Public read access
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

-- Professionals: Public read access
CREATE POLICY "Professionals are viewable by everyone" ON professionals
  FOR SELECT USING (true);

-- Professionals: Admin can manage
CREATE POLICY "Admins can manage professionals" ON professionals
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- Leads: Anyone can create (for contact form)
CREATE POLICY "Anyone can create leads" ON leads
  FOR INSERT WITH CHECK (true);

-- Leads: Admin can view and manage
CREATE POLICY "Admins can view leads" ON leads
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

CREATE POLICY "Admins can update leads" ON leads
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- Reviews: Anyone can create (moderated)
CREATE POLICY "Anyone can create reviews" ON reviews
  FOR INSERT WITH CHECK (true);

-- Reviews: Public can view approved reviews
CREATE POLICY "Approved reviews are viewable by everyone" ON reviews
  FOR SELECT USING (status = 'approved');

-- Reviews: Admin can view all and manage
CREATE POLICY "Admins can view all reviews" ON reviews
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

CREATE POLICY "Admins can update reviews" ON reviews
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- Admin users: Only admins can view
CREATE POLICY "Admins can view admin users" ON admin_users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to update professional stats when a review is approved
CREATE OR REPLACE FUNCTION update_professional_review_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE professionals
    SET
      avg_rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM reviews
        WHERE professional_id = NEW.professional_id AND status = 'approved'
      ),
      review_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE professional_id = NEW.professional_id AND status = 'approved'
      ),
      updated_at = now()
    WHERE id = NEW.professional_id;
  END IF;

  IF TG_OP = 'DELETE' THEN
    UPDATE professionals
    SET
      avg_rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM reviews
        WHERE professional_id = OLD.professional_id AND status = 'approved'
      ),
      review_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE professional_id = OLD.professional_id AND status = 'approved'
      ),
      updated_at = now()
    WHERE id = OLD.professional_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger for review stats
CREATE TRIGGER update_review_stats
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_professional_review_stats();

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(professional_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE professionals
  SET view_count = view_count + 1
  WHERE slug = professional_slug;
END;
$$ LANGUAGE plpgsql;

-- Function to increment lead count
CREATE OR REPLACE FUNCTION increment_lead_count(prof_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE professionals
  SET lead_count = lead_count + 1
  WHERE id = prof_id;
END;
$$ LANGUAGE plpgsql;

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to professionals
CREATE TRIGGER professionals_updated_at
  BEFORE UPDATE ON professionals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
