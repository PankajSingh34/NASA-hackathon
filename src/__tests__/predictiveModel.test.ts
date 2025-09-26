import { describe, it, expect } from 'vitest';
import { initHumanState } from '../services/physiologyEngine';
import { projectHuman } from '../services/predictiveModeler';
import { summarizePublication } from '../services/publicationSummarizer';
import { COUNTERMEASURES } from '../data/countermeasures';
import { InterventionPlan, ScenarioProfile, Publication } from '../types';

const scenario: ScenarioProfile = {
  id: 'scn-low-g',
  label: 'Low Gravity Transit',
  durationDays: 30,
  gravity: 0.2,
  oxygen: 0.98,
  radiation: 0.5,
  water: 0.9,
  nutrition: 0.85,
  description: '30-day microgravity transit profile',
  tags: ['transit','microgravity']
};

describe('Predictive Modeler', () => {
  it('generates a trajectory with countermeasure applied', () => {
    const initial = initHumanState();
    const plan: InterventionPlan = {
      id: 'plan-1',
      createdAt: new Date().toISOString(),
      schedule: [
        { day: 3, countermeasureId: COUNTERMEASURES[0].id },
        { day: 7, countermeasureId: COUNTERMEASURES[0].id },
        { day: 14, countermeasureId: COUNTERMEASURES[0].id }
      ],
      label: 'Resistance Boost'
    };
    const result = projectHuman(initial, scenario, { plan, days: 15, dtDays: 1 });
    expect(result.trajectory.length).toBeGreaterThan(5);
    expect(result.insights.length).toBeGreaterThan(0);
  });
});

describe('Publication Summarizer', () => {
  it('produces deterministic structure', () => {
    const pub: Publication = {
      id: 'pub-1',
      title: 'Microgravity effects on plant root growth aboard ISS',
      authors: ['A','B'],
      journal: 'Space Bio',
      year: 2024,
      doi: '10.1000/test',
      category: 'plant biology',
      abstract: 'Plant root growth study aboard ISS reveals adaptive growth patterns and stress attenuation.'
    };
    const summary = summarizePublication(pub, { seed: 'fixed-seed' });
    expect(summary.publicationId).toBe(pub.id);
    expect(summary.keyFindings.length).toBeGreaterThan(0);
    expect(summary.provenance.integrityHash).toBeTruthy();
  });
});
