import { advanceHuman } from './physiologyEngine';
import { Countermeasure, HumanState, InterventionPlan, ProjectionResult, ScenarioProfile } from '../types';
import { getCountermeasure } from '../data/countermeasures';
import { buildInsight } from './insightEngine';

interface ApplyContext {
  countermeasures: Record<string, Countermeasure>;
}

function applyCountermeasures(state: HumanState, day: number, plan: InterventionPlan | undefined, ctx: ApplyContext): HumanState {
  if (!plan) return state;
  const todays = plan.schedule.filter(s => s.day === day);
  if (todays.length === 0) return state;
  let newState = { ...state };
  for (const sched of todays) {
    const cm = ctx.countermeasures[sched.countermeasureId];
    if (!cm) continue;
    for (const [metric, delta] of Object.entries(cm.efficacyTargets)) {
      const key = metric as keyof HumanState;
      const baseVal = newState[key];
      if (typeof baseVal === 'number' && typeof delta === 'number') {
        // Interpret positive delta as mitigation/improvement fraction, negative as reduction
        const adjusted = baseVal * (1 + delta);
        // clamp 0-? some metrics accumulate (radiationDose) -> custom handling
        if (key === 'radiationDose') {
          newState[key] = Math.max(0, adjusted);
        } else {
          newState[key] = Math.max(0, Math.min(1.5, adjusted));
        }
      }
    }
  }
  return newState;
}

export interface ProjectionOptions {
  plan?: InterventionPlan;
  days?: number;
  dtDays?: number;
}

export function projectHuman(initial: HumanState, scenario: ScenarioProfile, opts: ProjectionOptions = {}): ProjectionResult {
  const days = opts.days ?? scenario.durationDays;
  const dt = opts.dtDays ?? 1;
  const steps = Math.ceil(days / dt);
  const trajectory: HumanState[] = [initial];
  const plan = opts.plan;
  // Build countermeasure context
  const cmIds = new Set(plan?.schedule.map(s => s.countermeasureId));
  const ctx: ApplyContext = {
    countermeasures: {}
  };
  cmIds.forEach(id => {
    const cm = getCountermeasure(id);
    if (cm) ctx.countermeasures[id] = cm;
  });

  let current = { ...initial };
  for (let i = 0; i < steps; i++) {
    // Advance environment (could vary with time; currently constant scenario values)
    const env = {
      gravity: scenario.gravity,
      oxygen: scenario.oxygen,
      radiation: scenario.radiation,
      water: scenario.water,
      nutrition: scenario.nutrition
    };
    current = advanceHuman(current, env, dt);
    // Apply countermeasures at day boundary (integer day)
    const dayIndex = Math.floor(current.time);
    current = applyCountermeasures(current, dayIndex, plan, ctx);
    trajectory.push({ ...current });
  }

  // Insight generation (simplified)
  const final = trajectory[trajectory.length - 1];
  const boneLoss = 1 - final.boneDensity;
  const muscleLoss = 1 - final.muscleMass;
  const insights = [
    buildInsight({
      category: 'physiology',
      title: 'Projected Bone Loss',
      narrative: `Bone density projected decline ${(boneLoss * 100).toFixed(1)}% over ${days} days`,
      type: 'prediction',
      metrics: { boneLossFraction: boneLoss }
    }),
    buildInsight({
      category: 'physiology',
      title: 'Projected Muscle Loss',
      narrative: `Muscle mass projected decline ${(muscleLoss * 100).toFixed(1)}% over ${days} days`,
      type: 'prediction',
      metrics: { muscleLossFraction: muscleLoss }
    })
  ];

  return {
    trajectory,
    insights,
    appliedPlan: plan
  };
}
