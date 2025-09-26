import { initHumanState, advanceHuman } from '../services/physiologyEngine';
import { scenarioToEnvironment, SCENARIOS } from '../services/scenarioEngine';

describe('physiologyEngine', () => {
  it('advances human state with time and increases radiation dose', () => {
    const env = scenarioToEnvironment(SCENARIOS[0]);
    let h = initHumanState();
    const baseDose = h.radiationDose;
    h = advanceHuman(h, env, 1);
    expect(h.time).toBeGreaterThan(0);
    expect(h.radiationDose).toBeGreaterThan(baseDose);
  });

  it('reduces bone and muscle over time in low gravity', () => {
  const marsTransit = scenarioToEnvironment(SCENARIOS.find((s) => s.id === 'mars-180')!);
    let h = initHumanState();
    const startBone = h.boneDensity;
    const startMuscle = h.muscleMass;
    for (let i = 0; i < 30; i++) {
      h = advanceHuman(h, marsTransit, 1);
    }
    expect(h.boneDensity).toBeLessThan(startBone);
    expect(h.muscleMass).toBeLessThan(startMuscle);
  });
});
