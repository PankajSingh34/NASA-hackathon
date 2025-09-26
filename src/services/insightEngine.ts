import { ExtendedAIInsight, InsightConfidence, InsightProvenance } from '../types';
import CryptoJS from 'crypto-js';


function classifyTier(score: number): InsightConfidence['tier'] {
  if (score < 0.4) return 'emerging';
  if (score < 0.65) return 'supported';
  if (score < 0.85) return 'robust';
  return 'anomalous'; // used for extreme signals; can be reinterpreted in UI
}

export function buildInsight(params: {
  category: string;
  title: string;
  narrative: string;
  type: ExtendedAIInsight['type'];
  metrics?: Record<string, number>;
  contributors?: string[];
  derivedFrom?: string[];
  seed?: string;
  baseScore?: number;
}): ExtendedAIInsight {
  const seed = params.seed || Math.random().toString(36).slice(2);
  const baseScore = params.baseScore ?? (0.4 + Math.random() * 0.55);
  const confidence: InsightConfidence = {
    score: baseScore,
    tier: classifyTier(baseScore),
    evidenceCount: 5 + Math.floor(Math.random() * 40),
    contributors: params.contributors || ['env:temp','env:radiation','bio:growth','sys:stability'],
    uncertainty: { lower: Math.max(0, baseScore - 0.12), upper: Math.min(1, baseScore + 0.12) }
  };
  const provenance: InsightProvenance = {
    sessionId: 'sess-' + seed,
    derivedFrom: params.derivedFrom || ['run-1','run-2'],
    generatedAt: new Date().toISOString(),
    reproducibilitySeed: seed
  };
  const hashInput = JSON.stringify({ ...params, confidence, provenance });
  const integrityHash = CryptoJS.SHA256(hashInput).toString();
  provenance.integrityHash = integrityHash;
  return {
    id: 'ins-' + seed,
    category: params.category,
    title: params.title,
    narrative: params.narrative,
    type: params.type,
    confidence,
    provenance,
    metrics: params.metrics,
    related: [],
    recommendations: []
  };
}

export function linkInsights(insights: ExtendedAIInsight[]): ExtendedAIInsight[] {
  const ids = insights.map(i => i.id);
  return insights.map(ins => {
    const related = ids.filter(id => id !== ins.id).slice(0, 3);
    return { ...ins, related };
  });
}
