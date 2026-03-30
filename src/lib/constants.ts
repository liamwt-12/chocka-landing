export const NE_TOWNS = [
  'Newcastle upon Tyne',
  'Sunderland',
  'Gateshead',
  'Middlesbrough',
  'Durham',
  'Darlington',
  'Hartlepool',
  'Stockton-on-Tees',
  'South Shields',
  'North Shields',
  'Whitley Bay',
  'Hexham',
  'Morpeth',
  'Blyth',
  'Chester-le-Street',
] as const;

export const TRADES = [
  'Plumber',
  'Electrician',
  'Gas Engineer',
  'Roofer',
  'Builder',
  'Locksmith',
  'Carpenter',
  'Plasterer',
  'Painter and Decorator',
  'Tiler',
  'Landscaper',
  'Handyman',
  'Bathroom Fitter',
  'Flooring Fitter',
  'Solar Installer',
  'HVAC Engineer',
  'Damp Specialist',
  'Drainage Engineer',
  'Bricklayer',
  'Kitchen Fitter',
] as const;

export const TRADE_EMOJIS: Record<string, string> = {
  'Plumber': '🔧',
  'Electrician': '⚡',
  'Gas Engineer': '🔥',
  'Roofer': '🏠',
  'Builder': '🧱',
  'Locksmith': '🔑',
  'Carpenter': '🪚',
  'Plasterer': '🪣',
  'Painter and Decorator': '🎨',
  'Tiler': '🔲',
  'Landscaper': '🌿',
  'Handyman': '🛠️',
  'Bathroom Fitter': '🚿',
  'Flooring Fitter': '🪵',
  'Solar Installer': '☀️',
  'HVAC Engineer': '❄️',
  'Damp Specialist': '💧',
  'Drainage Engineer': '🕳️',
  'Bricklayer': '🧱',
  'Kitchen Fitter': '🍳',
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function townSlug(town: string): string {
  return slugify(town);
}

export function tradeSlug(trade: string): string {
  return slugify(trade);
}

export function deslugify(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function findTown(slug: string): string | undefined {
  return NE_TOWNS.find((t) => townSlug(t) === slug);
}

export function findTrade(slug: string): string | undefined {
  return TRADES.find((t) => tradeSlug(t) === slug);
}

export function getBandColor(band: string): string {
  switch (band) {
    case 'excellent':
      return 'score-excellent';
    case 'good':
      return 'score-good';
    case 'fair':
      return 'score-fair';
    case 'poor':
      return 'score-poor';
    default:
      return 'score-fair';
  }
}
