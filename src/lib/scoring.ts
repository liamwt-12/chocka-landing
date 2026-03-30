import { ChockaScoreResult } from './types';

interface ScoreInput {
  starRating: number;
  reviewCount: number;
  recentReviews: number;
  hasDescription: boolean;
  hasHours: boolean;
  hasPhone: boolean;
  hasWebsite: boolean;
  photoCount: number;
  responseRate: number;
  lastPostDays: number;
}

export function calculateChockaScore(data: ScoreInput): ChockaScoreResult {
  // Star rating — 40 points
  const starScore = Math.round((data.starRating / 5) * 40);

  // Review volume — 25 points (capped at 100 reviews = full marks)
  const reviewScore = Math.round(Math.min(data.reviewCount / 100, 1) * 25);

  // Review recency — 15 points (reviews in last 90 days, capped at 10)
  const recencyScore = Math.round(Math.min(data.recentReviews / 10, 1) * 15);

  // Profile completeness — 10 points
  let completeness = 0;
  if (data.hasDescription) completeness += 3;
  if (data.hasHours) completeness += 2;
  if (data.hasPhone) completeness += 2;
  if (data.hasWebsite) completeness += 1;
  if (data.photoCount >= 3) completeness += 2;

  // Response rate — 10 points
  const responseScore = Math.round(data.responseRate * 10);

  // Activity bonus — up to 6 points
  let activityScore = 0;
  if (data.lastPostDays <= 30) activityScore = 6;
  else if (data.lastPostDays <= 60) activityScore = 3;
  else if (data.lastPostDays <= 90) activityScore = 1;

  const total = Math.min(
    100,
    starScore + reviewScore + recencyScore + completeness + responseScore + activityScore
  );

  const band =
    total >= 81 ? 'excellent' : total >= 61 ? 'good' : total >= 41 ? 'fair' : 'poor';

  return {
    score: total,
    band,
    components: {
      starScore,
      reviewScore,
      recencyScore,
      completeness,
      responseScore,
      activityScore,
    },
  };
}

export function getWeakestComponent(components: ChockaScoreResult['components']): string {
  const maxScores: Record<string, number> = {
    starScore: 40,
    reviewScore: 25,
    recencyScore: 15,
    completeness: 10,
    responseScore: 10,
    activityScore: 6,
  };

  const labels: Record<string, string> = {
    starScore: 'star rating',
    reviewScore: 'review volume',
    recencyScore: 'review recency',
    completeness: 'profile completeness',
    responseScore: 'response rate',
    activityScore: 'activity/posting',
  };

  let weakest = '';
  let lowestRatio = 1;

  for (const [key, max] of Object.entries(maxScores)) {
    const value = components[key as keyof typeof components];
    const ratio = value / max;
    if (ratio < lowestRatio) {
      lowestRatio = ratio;
      weakest = key;
    }
  }

  return labels[weakest] || 'overall profile';
}
