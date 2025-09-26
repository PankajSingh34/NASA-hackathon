import React from 'react';
import { ScenarioProfile, EnvironmentState } from '../types';
import { SCENARIOS } from '../services/scenarioEngine';

interface ScenarioPanelProps {
  currentScenarioId?: string;
  onSelect: (scenario: ScenarioProfile) => void;
  environment?: EnvironmentState;
}

const ScenarioPanel: React.FC<ScenarioPanelProps> = ({ currentScenarioId, onSelect, environment }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide text-gray-200">Mission Scenarios</h3>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
        {SCENARIOS.map(s => (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            className={`w-full text-left p-3 rounded-lg border transition-all ${
              currentScenarioId === s.id ? 'border-cyan-400 bg-cyan-500/10 shadow-inner' : 'border-white/10 hover:border-cyan-300/40 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{s.label}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 border border-white/10">
                {s.durationDays}d
              </span>
            </div>
            <p className="text-[11px] leading-snug mt-1 text-gray-300 line-clamp-2">{s.description}</p>
            <div className="flex gap-1 mt-2 flex-wrap">
              {s.tags.map(t => <span key={t} className="text-[10px] px-2 py-0.5 bg-cyan-600/20 text-cyan-300 rounded-full">{t}</span>)}
            </div>
          </button>
        ))}
      </div>
      {environment && (
        <div className="mt-3 text-[11px] grid grid-cols-5 gap-2 bg-black/30 p-2 rounded border border-white/10">
          <Metric label="g" v={environment.gravity} />
          <Metric label="O₂" v={environment.oxygen} />
          <Metric label="Rad" v={environment.radiation} />
          <Metric label="H₂O" v={environment.water} />
          <Metric label="Nut" v={environment.nutrition} />
        </div>
      )}
    </div>
  );
};

const Metric: React.FC<{ label: string; v: number }> = ({ label, v }) => {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] text-gray-400 mb-0.5">{label}</span>
      <div className="w-full h-1.5 bg-gray-700 rounded overflow-hidden">
        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${Math.min(100, Math.max(0, v * 100)).toFixed(0)}%` }} />
      </div>
      <span className="text-[9px] text-gray-300 mt-0.5">{(v*100).toFixed(0)}%</span>
    </div>
  );
};

export default ScenarioPanel;
