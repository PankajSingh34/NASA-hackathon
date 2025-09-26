// Simple soil/regolith simulation engine integrating with planetary system
// Focus: approximate physical & chemical metrics for extraterrestrial soil samples
// This is a heuristic model (not physically exact) but structured for extension.

export interface SoilSample {
  planet: string;
  regolithType: string; // basaltic, silicate, ice-rich, sulfuric, carbonaceous
  ironOxide: number; // 0-1
  perchlorates: number; // 0-1 (Mars relevant)
  moisture: number; // 0-1
  grainSizeIndex: number; // 0 (fine dust) - 1 (coarse)
  organicMarkers: number; // 0-1 hypothetical biomarker signal
  radiationSterilization: number; // 0-1 (higher means more sterilized)
  suitabilityScore: number; // aggregated for biology experiments
  notes: string[];
}

export interface SoilTestConfig {
  targetUse?: 'plant_growth' | 'bio_reactor' | 'life_support' | 'construction';
}

const PLANET_BASELINES: Record<string, Partial<SoilSample>> = {
  Mars: { regolithType: 'basaltic', ironOxide: 0.72, perchlorates: 0.35, moisture: 0.02, grainSizeIndex: 0.35, organicMarkers: 0.05, radiationSterilization: 0.65 },
  Moon: { regolithType: 'silicate', ironOxide: 0.12, perchlorates: 0.0, moisture: 0.004, grainSizeIndex: 0.55, organicMarkers: 0.0, radiationSterilization: 0.8 },
  Europa: { regolithType: 'ice-rich', ironOxide: 0.05, perchlorates: 0.1, moisture: 0.78, grainSizeIndex: 0.25, organicMarkers: 0.1, radiationSterilization: 0.9 },
  Titan: { regolithType: 'organic', ironOxide: 0.08, perchlorates: 0.05, moisture: 0.15, grainSizeIndex: 0.4, organicMarkers: 0.18, radiationSterilization: 0.5 },
  Default: { regolithType: 'carbonaceous', ironOxide: 0.2, perchlorates: 0.05, moisture: 0.05, grainSizeIndex: 0.4, organicMarkers: 0.02, radiationSterilization: 0.6 }
};

export function generateSoilSample(planet: string, config: SoilTestConfig = {}): SoilSample {
  const base = PLANET_BASELINES[planet] || PLANET_BASELINES.Default;
  // apply small stochastic variability
  const jitter = (v: number, mag = 0.08) => Math.min(1, Math.max(0, v + (Math.random() - 0.5) * mag));

  const ironOxide = jitter(base.ironOxide ?? 0.2);
  const perchlorates = jitter(base.perchlorates ?? 0.02, 0.05);
  const moisture = jitter(base.moisture ?? 0.05, 0.12);
  const grainSizeIndex = jitter(base.grainSizeIndex ?? 0.4, 0.15);
  const organicMarkers = jitter(base.organicMarkers ?? 0.01, 0.06);
  const radiationSterilization = jitter(base.radiationSterilization ?? 0.5, 0.1);

  // suitability scoring heuristics based on intended use
  const use = config.targetUse || 'plant_growth';
  let suitability = 0.5;
  const notes: string[] = [];

  if (use === 'plant_growth') {
    // want some moisture, low perchlorates, moderate iron, some organics
    suitability += (moisture * 0.4) - (perchlorates * 0.3) + (organicMarkers * 0.2) - Math.abs(ironOxide - 0.4) * 0.1;
    if (perchlorates > 0.25) notes.push('High perchlorate detox required');
    if (moisture < 0.05) notes.push('Hydration supplementation needed');
  } else if (use === 'bio_reactor') {
    suitability += (organicMarkers * 0.4) - (radiationSterilization * 0.2) + (moisture * 0.2);
    if (radiationSterilization > 0.75) notes.push('Low native microbial survivability');
  } else if (use === 'life_support') {
    suitability += (moisture * 0.5) - (perchlorates * 0.3) - (radiationSterilization * 0.1);
  } else if (use === 'construction') {
    suitability += (grainSizeIndex * 0.3) + (ironOxide * 0.2) - (moisture * 0.4);
    if (moisture > 0.2) notes.push('Drying/regolith sintering preprocessing needed');
  }

  suitability = Math.max(0, Math.min(1, suitability));

  return {
    planet,
    regolithType: base.regolithType || 'unknown',
    ironOxide: parseFloat(ironOxide.toFixed(3)),
    perchlorates: parseFloat(perchlorates.toFixed(3)),
    moisture: parseFloat(moisture.toFixed(3)),
    grainSizeIndex: parseFloat(grainSizeIndex.toFixed(3)),
    organicMarkers: parseFloat(organicMarkers.toFixed(3)),
    radiationSterilization: parseFloat(radiationSterilization.toFixed(3)),
    suitabilityScore: parseFloat(suitability.toFixed(3)),
    notes
  };
}

export function batchSoilPanel(planet: string, count = 5, config: SoilTestConfig = {}): SoilSample[] {
  return Array.from({ length: count }, () => generateSoilSample(planet, config));
}
