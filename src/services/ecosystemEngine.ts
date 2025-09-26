import { EcosystemState, OrganismGenome } from '../types';

export interface EcosystemConfig {
  seed?: string;
  initialGenomes?: OrganismGenome[];
}

function rng(seed: number) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export function initializeEcosystem(config: EcosystemConfig = {}): { state: EcosystemState; genomes: OrganismGenome[] } {
  const seedStr = config.seed || Math.random().toString(36).slice(2);
  const numericSeed = seedStr.split('').reduce((a,c)=> a + c.charCodeAt(0), 0) || 1;
  const rand = rng(numericSeed);

  const genomes: OrganismGenome[] = config.initialGenomes || Array.from({ length: 3 }).map((_, i) => ({
    id: `g-${seedStr}-${i}`,
    species: ['Cyanobacteria','Yeast','Algae'][i % 3],
    traits: {
      radiationResistance: 0.3 + rand() * 0.4,
      growthRate: 0.4 + rand() * 0.4,
      mutationRate: 0.01 + rand() * 0.05,
      resourceEfficiency: 0.3 + rand() * 0.5,
      stressTolerance: 0.2 + rand() * 0.6
    },
    lineage: []
  }));

  const state: EcosystemState = {
    id: 'eco-' + seedStr,
    tick: 0,
    timestamp: new Date().toISOString(),
    environment: {
      temperature: 22 + rand() * 4,
      radiation: 0.4 + rand() * 0.3,
      gravity: 0.38, // Mars baseline
      pressure: 0.6 + rand() * 0.2,
      nutrients: 0.7 + rand() * 0.3,
      lightIntensity: 0.8 + rand() * 0.2
    },
    populations: genomes.map(g => ({
      genomeId: g.id,
      count: 100 + Math.floor(rand() * 200),
      healthIndex: 0.6 + rand() * 0.3,
      diversityIndex: 0.3 + rand() * 0.4
    })),
    stabilityScore: 0.5,
    resilienceScore: 0.5
  };
  return { state, genomes };
}

export function advanceEcosystem(state: EcosystemState, _genomes: OrganismGenome[]): EcosystemState {
  const rand = Math.random;
  const newTick = state.tick + 1;
  const updatedPopulations = state.populations.map(p => {
    const growthFactor = 1 + (rand() - 0.45) * 0.1 * state.environment.nutrients;
    const newCount = Math.max(0, Math.floor(p.count * growthFactor));
    const healthDelta = (rand() - 0.5) * 0.05;
    return {
      ...p,
      count: newCount,
      healthIndex: Math.min(1, Math.max(0, p.healthIndex + healthDelta)),
      diversityIndex: Math.min(1, Math.max(0, p.diversityIndex + (rand() - 0.5) * 0.02))
    };
  });
  const stabilityScore = updatedPopulations.reduce((a,p)=> a + p.healthIndex, 0) / updatedPopulations.length * 0.6 + (state.environment.nutrients) * 0.4;
  const resilienceScore = stabilityScore * 0.9 + (rand() * 0.1);
  return {
    ...state,
    tick: newTick,
    timestamp: new Date().toISOString(),
    populations: updatedPopulations,
    stabilityScore: Math.min(1, Math.max(0, stabilityScore)),
    resilienceScore: Math.min(1, Math.max(0, resilienceScore))
  };
}
