import { NewsItem, HumanState, EcosystemState } from '../types';

let counter = 0;

interface GenerateContext {
  human?: HumanState;
  ecosystem?: EcosystemState;
  tamper?: boolean;
}

export function generateNews(ctx: GenerateContext): NewsItem[] {
  const items: NewsItem[] = [];
  const now = new Date().toISOString();

  if (ctx.human) {
    const h = ctx.human;
    if (h.boneDensity < 0.92) {
      items.push(makeItem('physiology', 'warning', `Bone density has declined ${(100*(1-h.boneDensity)).toFixed(1)}%`));
    }
    if (h.muscleMass < 0.9) {
      items.push(makeItem('physiology', 'alert', `Muscle atrophy crossing ${(100*(1-h.muscleMass)).toFixed(1)}% loss`));
    }
    if (h.radiationDose > 250) {
      items.push(makeItem('physiology', 'critical', `Radiation cumulative dose ${(h.radiationDose).toFixed(0)} mSv`));
    }
  }

  if (ctx.ecosystem) {
    if (ctx.ecosystem.stabilityScore < 0.35) items.push(makeItem('botany','alert','Ecosystem stability critical – collapse risk'));    
    if (ctx.ecosystem.resilienceScore > 0.8) items.push(makeItem('botany','info','Resilience plateau emerging; optimization window open'));
  }

  if (ctx.tamper) {
    items.push(makeItem('security','critical','Integrity violation: ledger mismatch detected'));
  }

  return items.map(i => ({ ...i, timestamp: now }));
}

function makeItem(category: NewsItem['category'], severity: NewsItem['severity'], headline: string): NewsItem {
  return {
    id: 'news-' + (++counter),
    timestamp: new Date().toISOString(),
    headline,
    category,
    severity
  };
}
