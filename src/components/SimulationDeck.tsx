import React, { useCallback, useEffect, useRef, useState } from 'react';
import ScenarioPanel from './ScenarioPanel';
import HumanStatusPanel from './HumanStatusPanel';
import { EnvironmentState, HumanState, ScenarioProfile, NewsItem, EcosystemState, OrganismGenome } from '../types';
import { SCENARIOS, scenarioToEnvironment } from '../services/scenarioEngine';
import { initHumanState, advanceHuman } from '../services/physiologyEngine';
import { SecurityLedger } from '../services/securityLedger';
import { generateNews } from '../services/newsGenerator';
import { initializeEcosystem, advanceEcosystem } from '../services/ecosystemEngine';

// Simple integrity badge + news feed inside this deck; can be split later.

const ledger = new SecurityLedger();

const TICK_DAYS = 0.1; // each tick advances 0.1 mission day

const SimulationDeck: React.FC = () => {
  const [scenario, setScenario] = useState<ScenarioProfile | undefined>(SCENARIOS[0]);
  const [environment, setEnvironment] = useState<EnvironmentState>(scenarioToEnvironment(SCENARIOS[0]));
  const [human, setHuman] = useState<HumanState>(initHumanState());
  const [running, setRunning] = useState(true);
  const [{ eco, genomes: _genomes }, setEco] = useState<{ eco: EcosystemState; genomes: OrganismGenome[] }>(() => {
    const { state, genomes } = initializeEcosystem();
    return { eco: state, genomes };
  });
  const [news, setNews] = useState<NewsItem[]>([]);
  const [lastVerifyOk, setLastVerifyOk] = useState<boolean | null>(null);
  const tickRef = useRef<number | null>(null);

  const step = useCallback(() => {
    setHuman(prev => {
  const next = advanceHuman(prev, environment, TICK_DAYS);
  // advance ecosystem
  let newEco: EcosystemState | null = null;
  setEco(old => {
    const advanced = advanceEcosystem(old.eco, old.genomes);
    newEco = advanced;
    return { ...old, eco: advanced };
  });
  // add snapshot to ledger (summary + payload)
  ledger.addSnapshot('tick', { h: next, env: environment, eco: newEco });
  // generate news (threshold-based)
  const newItems = generateNews({ human: next, ecosystem: newEco || eco });
      if (newItems.length) {
        setNews(curr => {
          const merged = [...newItems, ...curr].slice(0, 40);
            return merged;
        });
      }
      return next;
    });
  }, [environment]);

  // simulation loop
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(step, 1000);
    tickRef.current = id;
    return () => {
      window.clearInterval(id);
    };
  }, [running, step]);

  const onSelectScenario = (s: ScenarioProfile) => {
    setScenario(s);
    setEnvironment(scenarioToEnvironment(s));
    setHuman(initHumanState());
  ledger.addSnapshot(`reset:${s.id}`, { scenario: s.id });
  const { state, genomes } = initializeEcosystem();
  setEco({ eco: state, genomes });
  };

  const verifyLedger = () => {
  const result = ledger.verify();
  setLastVerifyOk(result.ok);
  };

  const simulateTamper = () => {
    // crude tamper: directly mutate internal chain if exists
    (ledger as any).chain[1] && ((ledger as any).chain[1].snapshotHash = '⚠️tampered');
    setLastVerifyOk(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <ScenarioPanel currentScenarioId={scenario?.id} onSelect={onSelectScenario} environment={environment} />
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 space-y-3">
          <h3 className="text-sm font-semibold tracking-wide text-gray-200 flex items-center justify-between">Simulation
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${running ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-600/40 text-gray-300'}`}>{running ? 'RUNNING' : 'PAUSED'}</span>
          </h3>
          <div className="flex gap-2">
            <button onClick={() => setRunning(r => !r)} className="px-3 py-1.5 text-xs rounded bg-cyan-600/30 border border-cyan-400/40 hover:bg-cyan-600/50">{running ? 'Pause' : 'Resume'}</button>
            <button onClick={step} className="px-3 py-1.5 text-xs rounded bg-blue-600/30 border border-blue-400/40 hover:bg-blue-600/50">Step +{TICK_DAYS}d</button>
            <button onClick={() => { setHuman(initHumanState()); ledger.addSnapshot('manual-reset', {}); }} className="px-3 py-1.5 text-xs rounded bg-amber-600/30 border border-amber-400/40 hover:bg-amber-600/50">Reset Crew</button>
          </div>
          <div className="text-[11px] text-gray-300 space-y-1">
            <div>Ledger Entries: {(ledger as any).chain.length}</div>
            <div className="flex gap-2">
              <button onClick={verifyLedger} className="px-2 py-1 rounded bg-emerald-500/20 border border-emerald-400/40 text-[10px] hover:bg-emerald-500/30">Verify</button>
              <button onClick={simulateTamper} className="px-2 py-1 rounded bg-red-500/20 border border-red-400/40 text-[10px] hover:bg-red-500/30">Tamper</button>
              {lastVerifyOk !== null && (
                <span className={`px-2 py-1 rounded text-[10px] ${lastVerifyOk ? 'bg-emerald-500/30 text-emerald-200' : 'bg-red-600/40 text-red-200'}`}>{lastVerifyOk ? 'Integrity OK' : 'Corrupted'}</span>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 space-y-2 h-72 flex flex-col">
          <h3 className="text-sm font-semibold tracking-wide text-gray-200">Mission News</h3>
          <div className="overflow-y-auto text-[11px] space-y-1 pr-1 custom-scrollbar flex-1">
            {news.length === 0 && <div className="text-gray-400">No events yet...</div>}
            {news.map(n => (
              <div key={n.id} className={`p-2 rounded border flex items-start gap-2 ${
                n.severity === 'critical' ? 'border-red-500/60 bg-red-500/10' :
                n.severity === 'alert' ? 'border-amber-500/60 bg-amber-500/10' :
                n.severity === 'warning' ? 'border-yellow-400/50 bg-yellow-400/10' :
                'border-white/10 bg-white/5'
              }`}>
                <span className="text-[9px] uppercase tracking-wide text-gray-400 mt-0.5">{n.category}</span>
                <div className="flex-1">
                  <div>{n.headline}</div>
                  <div className="text-[9px] text-gray-500">{new Date(n.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="lg:col-span-5">
        <HumanStatusPanel human={human} />
      </div>
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 h-full flex flex-col">
          <h3 className="text-sm font-semibold tracking-wide text-gray-200 mb-2">Ecosystem Snapshot</h3>
          <div className="grid grid-cols-3 gap-2 text-[10px] mb-3">
            <EcoMetric label="Tick" value={eco.tick} />
            <EcoMetric label="Stability" value={(eco.stabilityScore*100).toFixed(1)+'%'} />
            <EcoMetric label="Resilience" value={(eco.resilienceScore*100).toFixed(1)+'%'} />
          </div>
          <div className="space-y-2 overflow-y-auto text-[11px] pr-1 custom-scrollbar">
            {eco.populations.map(p => (
              <div key={p.genomeId} className="p-2 rounded border border-white/10 bg-black/30">
                <div className="flex justify-between"><span className="font-mono text-cyan-300">{p.genomeId.slice(0,8)}</span><span className="text-gray-400">{p.count}</span></div>
                <div className="h-1 bg-gray-700 rounded mt-1 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500" style={{width: `${(p.healthIndex*100).toFixed(1)}%`}} />
                </div>
                <div className="flex justify-between text-[9px] text-gray-400 mt-0.5"><span>Health {(p.healthIndex*100).toFixed(0)}%</span><span>Diversity {(p.diversityIndex*100).toFixed(0)}%</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationDeck;

// local tiny metric component
const EcoMetric: React.FC<{ label: string; value: any }> = ({ label, value }) => (
  <div className="bg-black/30 rounded p-2 border border-white/10 flex flex-col items-center">
    <span className="text-[9px] uppercase tracking-wide text-gray-400 mb-0.5">{label}</span>
    <span className="text-[11px] font-mono text-cyan-300">{value}</span>
  </div>
);