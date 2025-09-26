import { LifeSupportModule, LifeSupportStepResult, ResourceState, ResourceWarning } from '../types';

export interface LifeSupportConfig {
  crewCount: number;
  oxygenUsePerCrewPerHour?: number;
  waterUsePerCrewPerHour?: number;
  co2ProductionPerCrewPerHour?: number;
  energyUsePerCrewPerHour?: number;
  wastePerCrewPerHour?: number;
}

const DEFAULTS = {
  oxygenUsePerCrewPerHour: 0.84, // arbitrary units
  waterUsePerCrewPerHour: 2.2, // liters
  co2ProductionPerCrewPerHour: 0.9,
  energyUsePerCrewPerHour: 0.5,
  wastePerCrewPerHour: 0.3
};

export function initResourceState(): ResourceState {
  return {
    timestamp: new Date().toISOString(),
    tick: 0,
    oxygen: 250,
    carbonDioxide: 40,
    water: 600,
    biomass: 30,
    energy: 500,
    waste: 10
  };
}

export function stepLifeSupport(previous: ResourceState, modules: LifeSupportModule[], cfg: LifeSupportConfig, dtHours: number): LifeSupportStepResult {
  const c = { ...DEFAULTS, ...cfg };
  let state: ResourceState = { ...previous, tick: previous.tick + dtHours, timestamp: new Date().toISOString(), warnings: [] };

  // Crew consumption
  const crewO2Use = c.crewCount * c.oxygenUsePerCrewPerHour * dtHours;
  const crewWaterUse = c.crewCount * c.waterUsePerCrewPerHour * dtHours;
  const crewCO2Prod = c.crewCount * c.co2ProductionPerCrewPerHour * dtHours;
  const crewEnergyUse = c.crewCount * c.energyUsePerCrewPerHour * dtHours;
  const crewWaste = c.crewCount * c.wastePerCrewPerHour * dtHours;

  state.oxygen -= crewO2Use;
  state.water -= crewWaterUse;
  state.carbonDioxide += crewCO2Prod;
  state.energy -= crewEnergyUse;
  state.waste += crewWaste;

  const moduleMetrics: Record<string, number> = {};

  for (const m of modules) {
    const eff = m.efficiency ?? 1;
    if (m.oxygenGenRate) {
      state.oxygen += m.oxygenGenRate * eff * dtHours;
      moduleMetrics[m.id + ':o2'] = (moduleMetrics[m.id + ':o2'] || 0) + m.oxygenGenRate * eff * dtHours;
      // CO2 scrubbing implicitly
      state.carbonDioxide -= (m.oxygenGenRate * 0.6) * eff * dtHours;
    }
    if (m.waterRecycleRate) {
      state.water += m.waterRecycleRate * eff * dtHours;
      moduleMetrics[m.id + ':h2o'] = (moduleMetrics[m.id + ':h2o'] || 0) + m.waterRecycleRate * eff * dtHours;
      state.waste = Math.max(0, state.waste - m.waterRecycleRate * 0.2 * eff * dtHours);
    }
    if (m.co2ScrubRate) {
      state.carbonDioxide -= m.co2ScrubRate * eff * dtHours;
      moduleMetrics[m.id + ':co2'] = (moduleMetrics[m.id + ':co2'] || 0) + m.co2ScrubRate * eff * dtHours;
    }
    if (m.biomassOutputRate) {
      state.biomass += m.biomassOutputRate * eff * dtHours;
      moduleMetrics[m.id + ':bio'] = (moduleMetrics[m.id + ':bio'] || 0) + m.biomassOutputRate * eff * dtHours;
    }
    if (m.energyOutput) {
      state.energy += m.energyOutput * eff * dtHours;
      moduleMetrics[m.id + ':energy'] = (moduleMetrics[m.id + ':energy'] || 0) + m.energyOutput * eff * dtHours;
    }
  }

  // Clamp minimums
  state.oxygen = Math.max(0, state.oxygen);
  state.water = Math.max(0, state.water);
  state.energy = Math.max(0, state.energy);
  state.carbonDioxide = Math.max(0, state.carbonDioxide);

  // Warnings
  const warnings: ResourceWarning[] = [];
  function warn(type: ResourceWarning['type'], severity: ResourceWarning['severity'], message: string) {
    warnings.push({ id: `${type}-${state.tick}`, type, severity, message, atTick: state.tick });
  }
  if (state.oxygen < 100) warn('oxygen-low', state.oxygen < 60 ? 'critical' : 'warning', 'Oxygen reserve trending low');
  if (state.water < 200) warn('water-low', state.water < 120 ? 'critical' : 'warning', 'Water reserve trending low');
  if (state.energy < 120) warn('energy-low', state.energy < 60 ? 'critical' : 'warning', 'Energy reserve trending low');
  if (state.carbonDioxide > 180) warn('co2-high', state.carbonDioxide > 260 ? 'critical' : 'warning', 'CO2 accumulation high');
  if (state.waste > 200) warn('waste-high', state.waste > 300 ? 'critical' : 'warning', 'Waste processing backlog');
  state.warnings = warnings;

  // Sustainability heuristic (0-1): combine normalized reserves
  const sustainabilityIndex = Math.max(0, Math.min(1, (
    (state.oxygen / 400) * 0.25 +
    (state.water / 800) * 0.25 +
    (state.energy / 600) * 0.2 +
    (1 - state.carbonDioxide / 400) * 0.15 +
    (1 - state.waste / 400) * 0.15
  )));

  const warningFlags = warnings.map(w => w.type);

  return { state, sustainabilityIndex, warningFlags, moduleMetrics };
}
