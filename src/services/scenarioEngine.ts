import { ScenarioProfile, EnvironmentState } from '../types';

export const SCENARIOS: ScenarioProfile[] = [
  {
    id: 'iss-6m',
    label: 'ISS – 6 Months',
    durationDays: 180,
    gravity: 0.9,
    oxygen: 0.95,
    radiation: 0.35,
    water: 0.85,
    nutrition: 0.9,
    description: 'Nominal microgravity adaptation with moderate radiation exposure and good life support.',
    tags: ['baseline','human','orbit']
  },
  {
    id: 'mars-180',
    label: 'Mars Transit – 180d',
    durationDays: 180,
    gravity: 0.38,
    oxygen: 0.85,
    radiation: 0.55,
    water: 0.75,
    nutrition: 0.8,
    description: 'Transit + partial gravity adaptation with increased radiation risk and resource constraints.',
    tags: ['mars','radiation','resource']
  },
  {
    id: 'solar-storm',
    label: 'Solar Storm – 3d',
    durationDays: 3,
    gravity: 1,
    oxygen: 0.9,
    radiation: 0.9,
    water: 0.8,
    nutrition: 0.85,
    description: 'Acute high radiation event with short-term operational stress.',
    tags: ['acute','radiation','event']
  }
];

export function scenarioToEnvironment(s: ScenarioProfile): EnvironmentState {
  return {
    gravity: s.gravity,
    oxygen: s.oxygen,
    radiation: s.radiation,
    water: s.water,
    nutrition: s.nutrition
  };
}
