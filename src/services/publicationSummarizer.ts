import CryptoJS from 'crypto-js';
import { Publication, PublicationSummary, PublicationSummaryProvenance } from '../types';

// Simple keyword heuristic lists (can be expanded or externalized later)
const ORGANISM_CUES = ['plant', 'arabidopsis', 'mouse', 'rodent', 'human', 'yeast', 'microbe', 'bacteria'];
const MISSION_CUES = ['apollo', 'iss', 'gateway', 'artemis', 'mars', 'lunar'];
const METHOD_CUES = ['omic', 'genome', 'transcript', 'assay', 'spectro', 'culture', 'radiation', 'imaging'];
const RISK_CUES = ['loss', 'decline', 'damage', 'risk', 'lesion', 'dysfunction', 'attenuation'];

function tokenize(text: string): string[] {
  return text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

function extractMatches(tokens: string[], cues: string[]): string[] {
  const set = new Set<string>();
  for (const t of tokens) {
    for (const cue of cues) {
      if (t.startsWith(cue)) set.add(cue);
    }
  }
  return Array.from(set);
}

function topKeywords(tokens: string[], limit = 8): string[] {
  const freq: Record<string, number> = {};
  for (const t of tokens) {
    if (t.length < 4) continue;
    freq[t] = (freq[t] || 0) + 1;
  }
  return Object.entries(freq)
    .sort((a,b) => b[1]-a[1])
    .slice(0, limit)
    .map(e => e[0]);
}

export interface SummarizeOptions {
  seed?: string;
  algorithmVersion?: string;
}

export function summarizePublication(pub: Publication, opts: SummarizeOptions = {}): PublicationSummary {
  const seed = opts.seed || Math.random().toString(36).slice(2);
  const version = opts.algorithmVersion || 'heuristic-v0.1';
  const tokens = tokenize(pub.abstract || pub.title || '');
  const organisms = extractMatches(tokens, ORGANISM_CUES);
  const missions = extractMatches(tokens, MISSION_CUES);
  const methods = extractMatches(tokens, METHOD_CUES);
  const risks = extractMatches(tokens, RISK_CUES);
  const keywords = topKeywords(tokens);

  // Fake key findings: select top 3-5 tokens & compose simple statements
  const findings = keywords.slice(0, 4).map(k => `Observed pattern relating to ${k}`);
  if (findings.length === 0) findings.push('Insufficient abstract signal for heuristic extraction');

  const provenance: PublicationSummaryProvenance = {
    publicationId: pub.id,
    generatedAt: new Date().toISOString(),
    algorithmVersion: version,
    reproducibilitySeed: seed
  };

  const integrityBase = JSON.stringify({ pubId: pub.id, seed, version, keywords });
  provenance.integrityHash = CryptoJS.SHA256(integrityBase).toString();

  return {
    id: 'ps-' + seed,
    publicationId: pub.id,
    keyFindings: findings,
    methods,
    organisms,
    missionsReferenced: missions,
    riskFactors: risks,
    keywords,
    provenance
  };
}
