// Core data types for House Haven Realty

export interface Agent {
  id: string
  slug: string
  name: string
  title: string
  email?: string
  phone?: string
  headshot_url: string
  bio: string
  license_number?: string
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface Community {
  id: string
  slug: string
  name: string
  county: string
  state: string
  description: string
  highlights: string[]
  median_home_price?: number
  avg_days_on_market?: number
  latitude?: number
  longitude?: number
  hero_image_url?: string
  created_at: string
}

export interface Listing {
  id: string
  mls_id: string
  address: string
  city: string
  state: string
  zip: string
  price: number
  bedrooms: number
  bathrooms: number
  sqft: number
  status: 'active' | 'pending' | 'sold'
  listing_agent_name: string
  listing_agent_firm: string
  photos: string[]
  description: string
  days_on_market: number
  listed_at: string
}

export interface ValuationRequest {
  id: string
  address: string
  city: string
  state: string
  zip: string
  name: string
  email: string
  phone: string
  timeline: string
  created_at: string
}
