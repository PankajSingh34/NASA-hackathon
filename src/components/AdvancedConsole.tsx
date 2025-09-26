import React, { useEffect, useState } from 'react';
import { ExtendedAIInsight, GeneratedMission, EcosystemState, OrganismGenome } from '../types';
import { generateMission } from '../services/missionGenerator';
import { buildInsight, linkInsights } from '../services/insightEngine';
import { initializeEcosystem, advanceEcosystem } from '../services/ecosystemEngine';
import { detectAnomaly } from '../services/anomalyDetector';
import { ReplayLog } from '../services/replayEngine';

const AdvancedConsole: React.FC = () => {
  const [mission, setMission] = useState<GeneratedMission | null>(null);
  const [insights, setInsights] = useState<ExtendedAIInsight[]>([]);
  const [ecoState, setEcoState] = useState<EcosystemState | null>(null);
  const [genomes, setGenomes] = useState<OrganismGenome[]>([]);
  const [history, setHistory] = useState<number[]>([]);
  const [anomaly, setAnomaly] = useState<any>(null);
  const [replayLog] = useState(()=> new ReplayLog());

  // Initialize systems on mount
  useEffect(() => {
    const seed = Math.random().toString(36).slice(2,7);
    const m = generateMission(seed);
    setMission(m);

    const { state, genomes } = initializeEcosystem({ seed });
    setEcoState(state);
    setGenomes(genomes);

    const baseInsights = linkInsights([
      buildInsight({
        category: 'Ecosystem Stability',
        title: 'Early Stability Profile Emerging',
        narrative: 'Initial ecosystem readings indicate forming stability plateau; watch nutrient variance swings.',
        type: 'prediction',
        baseScore: 0.52,
        derivedFrom: [state.id],
        contributors: ['env:nutrients','pop:diversity']
      }),
      buildInsight({
        category: 'Adaptive Signals',
        title: 'Radiation Resistance Trend Slightly Upward',
        narrative: 'Genome lineage projections suggest incremental stress hardening over next 12 cycles.',
        type: 'prediction',
        baseScore: 0.61,
        derivedFrom: [state.id],
        contributors: ['trait:radiationResistance']
      })
    ]);
    setInsights(baseInsights);

    replayLog.record({ type: 'init', timestamp: new Date().toISOString(), tick: 0, summary: 'System initialized', payload: { missionId: m.id } });
  }, []);

  // Advance ecosystem periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setEcoState(prev => {
        if (!prev) return prev;
        const advanced = advanceEcosystem(prev, genomes);
        setHistory(h => [...h.slice(-200), advanced.stabilityScore]);
        replayLog.record({ type: 'tick', timestamp: new Date().toISOString(), tick: advanced.tick, summary: 'Advance ecosystem', payload: { stability: advanced.stabilityScore } });
        const a = detectAnomaly([...history, advanced.stabilityScore]);
        setAnomaly(a.isAnomaly ? a : null);
        return advanced;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [genomes, history, replayLog]);

  return (
    <div className="p-6 bg-black/40 border border-white/10 rounded-xl text-white space-y-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Advanced Systems Console</h2>

      {mission && (
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <h3 className="font-semibold mb-2">Mission: {mission.title}</h3>
          <p className="text-sm text-blue-200 mb-2">{mission.narrativeHook}</p>
          <div className="text-xs flex flex-wrap gap-2 mb-2">
            {mission.tags.map(t => <span key={t} className="px-2 py-0.5 bg-blue-600/30 rounded-full border border-blue-500/40">{t}</span>)}
          </div>
          <ul className="text-xs space-y-1 list-disc ml-5">
            {mission.stages.map(s => <li key={s.id}><span className="font-medium">{s.title}</span> – {s.objective} <span className="text-[10px] text-gray-300">[{s.riskLevel}]</span></li>)}
          </ul>
        </div>
      )}

      {ecoState && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
            <h4 className="font-semibold mb-1">Ecosystem</h4>
            <p className="text-xs text-gray-300">Tick: {ecoState.tick}</p>
            <div className="text-xs mt-2 space-y-1">
              <p>Stability: {(ecoState.stabilityScore*100).toFixed(1)}%</p>
              <p>Resilience: {(ecoState.resilienceScore*100).toFixed(1)}%</p>
              <p>Nutrients: {(ecoState.environment.nutrients*100).toFixed(0)}%</p>
              <p>Radiation: {(ecoState.environment.radiation*100).toFixed(0)}%</p>
            </div>
          </div>
          <div className="bg-white/5 p-3 rounded-lg border border-white/10 col-span-2">
            <h4 className="font-semibold mb-2">Insights</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {insights.map(ins => (
                <div key={ins.id} className="p-2 bg-black/40 rounded border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{ins.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-600/30 border border-purple-500/40">{(ins.confidence.score*100).toFixed(1)}% {ins.confidence.tier}</span>
                  </div>
                  <p className="text-[11px] mt-1 text-gray-300 leading-snug">{ins.narrative}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-3">
            {anomaly && (
              <div className="p-3 bg-red-700/30 border border-red-500/40 rounded">
                <p className="text-sm font-semibold">Anomaly Detected</p>
                <p className="text-xs">Score: {(anomaly.score*100).toFixed(1)}% | z = {anomaly.zScore.toFixed(2)} | Reason: {anomaly.reason}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="text-xs text-gray-400">
        <p>Replay Log Entries: {replayLog.length()}</p>
      </div>
    </div>
  );
};

export default AdvancedConsole;
