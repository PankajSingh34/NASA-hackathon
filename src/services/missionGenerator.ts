import { GeneratedMission, MissionStage } from '../types';

const STAGE_LIBRARY: Omit<MissionStage, 'id'>[] = [
  {
    title: 'Initialize Bioreactor Matrix',
    objective: 'Deploy microbial starter cultures in controlled habitat',
    successCriteria: 'Culture viability > 92% after 6 hours',
    riskLevel: 'moderate',
    dependencies: [],
    estimatedDurationHours: 6
  },
  {
    title: 'Stabilize Atmospheric Exchange',
    objective: 'Balance O2/CO2 at breathable threshold prototype',
    successCriteria: 'Maintain O2 18-22% for 12 hours',
    riskLevel: 'high',
    dependencies: [],
    estimatedDurationHours: 18
  },
  {
    title: 'Genetic Drift Monitoring',
    objective: 'Track adaptive mutations in radiation-exposed lineage',
    successCriteria: 'Sequence coverage > 40x with <2% error',
    riskLevel: 'moderate',
    dependencies: [],
    estimatedDurationHours: 24
  },
  {
    title: 'Closed-Loop Nutrient Reclamation',
    objective: 'Reduce external nutrient import by 60%',
    successCriteria: 'Reclamation efficiency sustained > 55%',
    riskLevel: 'high',
    dependencies: [],
    estimatedDurationHours: 48
  }
];

function pick<T>(arr: T[], count: number, seedRand: () => number): T[] {
  const clone = [...arr];
  const chosen: T[] = [];
  while (clone.length && chosen.length < count) {
    const idx = Math.floor(seedRand() * clone.length);
    chosen.push(clone.splice(idx, 1)[0]);
  }
  return chosen;
}

// Simple seedable RNG (Mulberry32)
function rng(seed: number) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export function generateMission(seed: string): GeneratedMission {
  const numericSeed = seed.split('').reduce((a,c)=> a + c.charCodeAt(0), 0) || 1;
  const rand = rng(numericSeed);
  const stageCount = 3 + Math.floor(rand() * 3);
  const baseStages = pick(STAGE_LIBRARY, stageCount, rand).map((st, i) => ({
    id: `${seed}-stage-${i+1}`,
    ...st,
    dependencies: i === 0 ? [] : [ `${seed}-stage-${i}` ]
  }));
  const difficultyRoll = rand();
  const difficulty: GeneratedMission['difficulty'] = difficultyRoll < 0.25 ? 'training' : difficultyRoll < 0.55 ? 'standard' : difficultyRoll < 0.85 ? 'advanced' : 'critical';
  return {
    id: `mission-${seed}`,
    seed,
    title: `Mission ${seed.toUpperCase()} – Bio-Systems Initiative`,
    narrativeHook: 'Establish a resilient closed-loop bio-ecology under off-world constraints while accelerating adaptive optimization.',
    stages: baseStages,
    difficulty,
    tags: ['bio', 'terraform', 'optimization', difficulty],
    createdAt: new Date().toISOString()
  };
}
