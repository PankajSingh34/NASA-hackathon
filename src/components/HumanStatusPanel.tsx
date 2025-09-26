import React from 'react';
import { HumanState } from '../types';

interface HumanStatusPanelProps {
  human: HumanState;
}

const Bar: React.FC<{ label: string; value: number; color?: string; min?: number; max?: number; emphasisZones?: {warn: number; danger: number}; suffix?: string }>=({label,value,color='from-emerald-400 to-teal-500',min=0,max=1,emphasisZones,suffix=''})=>{
  const pct = ((value - min) / (max - min)) * 100;
  let zoneClass = '';
  if (emphasisZones) {
    if (value <= emphasisZones.danger) zoneClass = 'bg-red-500 animate-pulse';
    else if (value <= emphasisZones.warn) zoneClass = 'bg-amber-400';
  }
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] uppercase tracking-wide text-gray-300">
        <span>{label}</span><span className="font-mono">{value.toFixed(3)}{suffix}</span>
      </div>
      <div className="h-2 rounded bg-gray-700 overflow-hidden relative">
        <div className={`absolute inset-y-0 left-0 bg-gradient-to-r ${zoneClass || color}`} style={{width: `${Math.min(100, Math.max(0,pct)).toFixed(1)}%`}} />
        {emphasisZones && (
          <>
            <div className="absolute top-0 h-full w-px bg-amber-400/60" style={{left: `${(emphasisZones.warn*100).toFixed(1)}%`}} />
            <div className="absolute top-0 h-full w-px bg-red-500/70" style={{left: `${(emphasisZones.danger*100).toFixed(1)}%`}} />
          </>
        )}
      </div>
    </div>
  );
};

const Gauge: React.FC<{ label: string; value: number; max?: number; unit?: string }>=({label,value,max=1,unit=''})=>{
  const pct = Math.min(1, Math.max(0,value/max));
  return (
    <div className="flex flex-col items-center p-2 bg-black/30 rounded border border-white/10 w-20">
      <div className="relative h-16 w-16">
        <svg viewBox="0 0 36 36" className="w-full h-full">
          <path className="text-gray-700" strokeWidth="3" stroke="currentColor" fill="none" strokeLinecap="round" d="M18 2 a16 16 0 0 1 0 32 a16 16 0 0 1 0 -32" />
          <path className="text-cyan-400" strokeWidth="3" stroke="url(#grad)" fill="none" strokeLinecap="round" strokeDasharray={`${(pct*100).toFixed(2)}, 100`} d="M18 2 a16 16 0 0 1 0 32 a16 16 0 0 1 0 -32" />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col text-[10px] font-mono">
          <span>{(pct*100).toFixed(0)}%</span>
          <span className="text-[8px] text-gray-400">{unit}</span>
        </div>
      </div>
      <span className="mt-1 text-[10px] tracking-wide text-gray-300 uppercase">{label}</span>
    </div>
  );
};

const HumanStatusPanel: React.FC<HumanStatusPanelProps> = ({ human }) => {
  // Derived quick viability heuristic (not stored): average of structural & recovery penalized by fatigue & stress
  const viability = (human.boneDensity + human.muscleMass + human.recoveryPotential) / 3 * (1 - human.fatigue * 0.3 - human.stressLoad * 0.2);
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 space-y-4">
      <h3 className="text-sm font-semibold tracking-wide text-gray-200">Crew Physiology</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <Bar label="Bone Density" value={human.boneDensity} emphasisZones={{warn:0.88,danger:0.8}} />
          <Bar label="Muscle Mass" value={human.muscleMass} emphasisZones={{warn:0.88,danger:0.8}} />
            <Bar label="Blood Flow" value={human.bloodFlowIndex} color='from-pink-400 to-rose-500' emphasisZones={{warn:0.75,danger:0.6}} />
          <Bar label="Stress" value={human.stressLoad} color='from-amber-400 to-orange-500' min={0} max={1} emphasisZones={{warn:0.55,danger:0.7}} />
          <Bar label="Fatigue" value={human.fatigue} color='from-purple-400 to-violet-500' min={0} max={1} emphasisZones={{warn:0.55,danger:0.7}} />
          <Bar label="Recovery Pot." value={human.recoveryPotential} color='from-emerald-400 to-green-500' emphasisZones={{warn:0.7,danger:0.5}} />
          <Bar label="Viability" value={viability} color='from-emerald-400 to-teal-500' emphasisZones={{warn:0.75,danger:0.6}} />
        </div>
        <div className="flex flex-wrap gap-2 items-start">
          <Gauge label="Radiation" value={human.radiationDose} max={500} unit="mSv" />
        </div>
      </div>
      <div className="text-[10px] text-gray-400 flex justify-between pt-1 border-t border-white/10">
        <span>Mission Day: {human.time.toFixed(1)}</span>
        <span>Sampled Now</span>
      </div>
    </div>
  );
};

export default HumanStatusPanel;
