export interface Business {
  id: string;
  google_place_id: string;
  name: string;
  slug: string;
  trade: string;
  town: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  google_maps_url: string | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
  updated_at: string;
}

export interface Score {
  id: string;
  business_id: string;
  score: number;
  band: 'poor' | 'fair' | 'good' | 'excellent';
  star_rating: number | null;
  review_count: number | null;
  recency_score: number | null;
  completeness_score: number | null;
  response_rate_score: number | null;
  activity_score: number | null;
  last_active_at: string | null;
  calculated_at: string;
}

export interface ScoreHistory {
  id: string;
  business_id: string;
  score: number;
  rank_in_town_trade: number | null;
  week_of: string;
  created_at: string;
}

export interface Ranking {
  id: string;
  business_id: string;
  trade: string;
  town: string;
  rank: number;
  previous_rank: number | null;
  movement: number | null;
  updated_at: string;
}

export interface ClaimedListing {
  id: string;
  business_id: string;
  email: string;
  claimed_at: string;
  chocka_customer: boolean;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  town: string;
  trade: string | null;
  subscribed_at: string;
}

export interface BusinessWithScore extends Business {
  scores: Score;
  rankings: Ranking;
  claimed_listings: ClaimedListing[] | null;
}

export interface LeagueTableEntry {
  rank: number;
  previous_rank: number | null;
  movement: number | null;
  business: Business;
  score: Score;
  is_claimed: boolean;
  is_chocka_customer: boolean;
}

export interface ScoreComponents {
  starScore: number;
  reviewScore: number;
  recencyScore: number;
  completeness: number;
  responseScore: number;
  activityScore: number;
}

export interface ChockaScoreResult {
  score: number;
  band: 'poor' | 'fair' | 'good' | 'excellent';
  components: ScoreComponents;
}
