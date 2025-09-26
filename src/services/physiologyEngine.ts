import { HumanState, EnvironmentState } from '../types';

// Constants (tunable)
const K_BONE = 0.0009; // per day loss coefficient
const K_MUSCLE = 0.0012; // per day loss coefficient
const GRAVITY_EXPONENT = 1.4; // accentuate low gravity effects
const RADIATION_SCALE = 0.04; // mSv / day scaling base

export interface PhysiologyConfig {
  baseline?: Partial<HumanState>;
}

export function initHumanState(): HumanState {
  return {
    time: 0,
    boneDensity: 1,
    muscleMass: 1,
    bloodFlowIndex: 1,
    radiationDose: 0,
    fatigue: 0.1,
    stressLoad: 0.1,
    recoveryPotential: 0.85
  };
}

export function advanceHuman(previous: HumanState, env: EnvironmentState, dtDays: number): HumanState {
  const gravFactor = Math.max(0, Math.min(1.2, env.gravity));
  const oxygenFactor = Math.max(0, Math.min(1, env.oxygen));
  const nutritionFactor = Math.max(0, Math.min(1, env.nutrition));

  // Bone density decline accelerates with gravity deficit
  const boneDecline = K_BONE * (1 - gravFactor) * dtDays;
  const newBone = Math.max(0, previous.boneDensity * (1 - boneDecline));

  // Muscle loss with exponent on gravity gap
  const muscleDecline = K_MUSCLE * Math.pow((1 - gravFactor), GRAVITY_EXPONENT) * dtDays;
  const newMuscle = Math.max(0, previous.muscleMass * (1 - muscleDecline));

  // Blood flow influenced by oxygen + partial gravity support
  const bloodFlow = 0.7 + 0.3 * oxygenFactor;
  const adjustedBlood = Math.max(0, Math.min(1, bloodFlow * (0.8 + 0.2 * gravFactor)));

  // Radiation accumulation (later: spikes)
  const radGain = (env.radiation) * RADIATION_SCALE * dtDays * (1 + (1 - gravFactor) * 0.3);
  const newDose = previous.radiationDose + radGain * 100; // convert to mSv-like scale

  // Fatigue grows if nutrition or oxygen low
  const fatigueDelta = (1 - nutritionFactor * 0.7 - oxygenFactor * 0.3) * 0.02 * dtDays;
  const newFatigue = Math.max(0, Math.min(1, previous.fatigue + fatigueDelta));

  // Stress: composite of radiation & gravity deficit & fatigue
  const stress = Math.max(0, Math.min(1, (env.radiation * 0.4) + (1 - gravFactor) * 0.3 + newFatigue * 0.3));

  // Recovery potential declines with cumulative dose & stress
  const recovery = Math.max(0.2, 0.95 - (newDose / 5000) - stress * 0.3);

  return {
    time: previous.time + dtDays,
    boneDensity: newBone,
    muscleMass: newMuscle,
    bloodFlowIndex: adjustedBlood,
    radiationDose: newDose,
    fatigue: newFatigue,
    stressLoad: stress,
    recoveryPotential: recovery
  };
}
