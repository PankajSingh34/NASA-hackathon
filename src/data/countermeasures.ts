import { Countermeasure } from '../types';

// Seed countermeasure catalog (mock values). Efficacy targets are fractional improvements (positive) or mitigations.
// These are illustrative placeholder numbers, not medical guidance.
export const COUNTERMEASURES: Countermeasure[] = [
  {
    id: 'cm-resisted-exercise',
    name: 'Resisted Exercise Protocol',
    category: 'exercise',
    description: 'High-load resistance training using advanced resistive exercise device to mitigate muscle and bone loss.',
    efficacyTargets: { muscleMass: 0.15, boneDensity: 0.08, fatigue: -0.05 },
    evidenceLevel: 'strong',
    sideEffects: ['Injury risk if improper form', 'Increased fatigue if over-prescribed'],
    dosingGuidelines: '5 sessions per week, alternating major muscle groups, progressive load.',
    references: ['10.1000/space.bone.1']
  },
  {
    id: 'cm-vitamin-d-k2',
    name: 'Vitamin D + K2 Supplementation',
    category: 'nutrition',
    description: 'Supplemental regimen to support calcium metabolism and bone mineral retention.',
    efficacyTargets: { boneDensity: 0.05, fatigue: -0.02 },
    evidenceLevel: 'moderate',
    sideEffects: ['Hypercalcemia risk if overdosed'],
    dosingGuidelines: 'Daily micro-dose per crew health protocol.',
    references: ['10.1000/space.nutrition.7']
  },
  {
    id: 'cm-aerobic-intervals',
    name: 'Aerobic Interval Training',
    category: 'exercise',
    description: 'Cardio intervals to preserve cardiovascular conditioning and blood flow dynamics.',
    efficacyTargets: { bloodFlowIndex: 0.1, fatigue: -0.04, stressLoad: -0.03 },
    evidenceLevel: 'moderate',
    dosingGuidelines: '4 sessions weekly, 30–40 minutes with intervals of 3–4 min at 85% VO2peak.',
    references: ['10.1000/space.cardio.2']
  },
  {
    id: 'cm-light-therapy',
    name: 'Circadian Light Therapy',
    category: 'behavioral',
    description: 'Spectrally tuned light exposure to stabilize circadian rhythm and reduce fatigue.',
    efficacyTargets: { fatigue: -0.07, stressLoad: -0.05, recoveryPotential: 0.04 },
    evidenceLevel: 'emerging',
    references: ['10.1000/space.behavior.5']
  },
  {
    id: 'cm-rad-shielding',
    name: 'Adaptive Radiation Shielding Protocol',
    category: 'radiation',
    description: 'Dynamic crew scheduling and habitat configuration to lower cumulative radiation dose.',
    efficacyTargets: { radiationDose: -0.12, stressLoad: -0.02 },
    evidenceLevel: 'emerging',
    references: ['10.1000/space.radiation.9']
  }
];

export function getCountermeasure(id: string) {
  return COUNTERMEASURES.find(c => c.id === id) || null;
}

export function searchCountermeasures(query: { category?: string; targetMetric?: string; evidenceLevel?: string }) {
  return COUNTERMEASURES.filter(c => {
    if (query.category && c.category !== query.category) return false;
    if (query.evidenceLevel && c.evidenceLevel !== query.evidenceLevel) return false;
    if (query.targetMetric && !Object.keys(c.efficacyTargets).includes(query.targetMetric)) return false;
    return true;
  });
}
