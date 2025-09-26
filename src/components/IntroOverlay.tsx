import React from 'react';

interface IntroOverlayProps {
  onClose: () => void;
}

const IntroOverlay: React.FC<IntroOverlayProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[999] flex items-start justify-center overflow-y-auto bg-black/70 backdrop-blur-md p-6">
      <div className="relative max-w-4xl w-full mx-auto mt-16 mb-24 bg-gradient-to-br from-gray-900/90 via-slate-900/90 to-black/90 border border-white/10 rounded-2xl shadow-2xl ring-1 ring-cyan-400/10">
        <div className="absolute top-3 right-3">
          <button onClick={onClose} className="px-3 py-1.5 text-xs rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-gray-200 tracking-wide">CLOSE ✕</button>
        </div>
        <div className="p-8 space-y-8">
          <header className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent flex items-center gap-2">
              🚀 NASA Space Biology Knowledge Mission
            </h1>
            <p className="text-sm uppercase tracking-wider text-cyan-300/70 font-semibold">Topic • Challenge • Importance</p>
          </header>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-cyan-300 flex items-center gap-2">🌍 What’s the Topic About?</h2>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              NASA has conducted space biology experiments for decades to understand how life adapts beyond Earth. These studies explore fundamental questions about biological systems in microgravity and radiation-rich environments.
            </p>
            <ul className="space-y-2 text-sm md:text-base text-gray-200 list-none pl-0">
              <li className="flex gap-2"><span>🌱</span><span>How do plants grow in zero or partial gravity?</span></li>
              <li className="flex gap-2"><span>🧑‍🚀</span><span>What happens to the human body (bones, muscles, immune system, cognition, radiation exposure)?</span></li>
              <li className="flex gap-2"><span>🐭</span><span>How do small animals and model organisms adapt physiologically?</span></li>
              <li className="flex gap-2"><span>🦠</span><span>How do microbes behave, mutate, or become more/less virulent?</span></li>
            </ul>
            <p className="text-gray-300 text-sm md:text-base">
              The knowledge exists—but it’s fragmented across hundreds of dense research papers (608+ and growing). Extracting actionable insights is slow and labor-intensive.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-amber-300 flex items-center gap-2">🚀 What’s the Challenge Asking?</h2>
            <p className="text-gray-300 text-sm md:text-base">
              Build an intelligent, interactive platform that consolidates NASA’s space biology research into an accessible, AI-augmented decision and exploration tool.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">
                <h3 className="text-cyan-300 font-semibold text-sm tracking-wide">Core Objectives</h3>
                <ul className="space-y-1 text-gray-200">
                  <li>• Ingest & structure research artifacts</li>
                  <li>• Generate AI summaries & comparative insights</li>
                  <li>• Build knowledge graph relationships</li>
                  <li>• Enable semantic + exploratory querying</li>
                </ul>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">
                <h3 className="text-cyan-300 font-semibold text-sm tracking-wide">Example User Flows</h3>
                <ul className="space-y-1 text-gray-200">
                  <li>👩‍🔬 “Bone density in microgravity” → Summary + key experiments + trend curves</li>
                  <li>🛰 “Knowledge gaps before Mars departure” → Highlighted risk domains</li>
                  <li>🌱 “Plant growth optimization factors” → Environment variable impacts</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-emerald-300 flex items-center gap-2">🌟 Why is This Important?</h2>
            <p className="text-gray-300 text-sm md:text-base">
              Sustained human presence on the Moon and Mars depends on deep biological understanding: food production, crew health, stress adaptation, radiation mitigation, and closed-loop ecosystems. This platform accelerates translation of research into mission readiness.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-900/30 to-emerald-700/10 border border-emerald-500/20">
                <h4 className="text-emerald-300 font-semibold mb-1 text-xs tracking-wide">MISSION PREP</h4>
                <p className="text-gray-200 text-xs leading-relaxed">Reduces analysis time for biomedical risk assessment.</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-900/30 to-blue-700/10 border border-blue-500/20">
                <h4 className="text-blue-300 font-semibold mb-1 text-xs tracking-wide">KNOWLEDGE GAPS</h4>
                <p className="text-gray-200 text-xs leading-relaxed">Surfaces under-studied systems before deep-space deployment.</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-violet-900/30 to-violet-700/10 border border-violet-500/20">
                <h4 className="text-violet-300 font-semibold mb-1 text-xs tracking-wide">EDUCATION & ACCESS</h4>
                <p className="text-gray-200 text-xs leading-relaxed">Makes space life sciences explorable for students & new researchers.</p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-pink-300 flex items-center gap-2">🧠 How This Platform Helps</h2>
            <ul className="space-y-1 text-sm text-gray-200">
              <li>• AI summarization lowers cognitive load.</li>
              <li>• Knowledge graph exposes cross-domain linkages (e.g., radiation ↔ bone loss).</li>
              <li>• Simulation layers (physiology + ecosystem) contextualize experimental implications.</li>
              <li>• Integrity ledger concept hints at auditability & reproducibility tracking.</li>
            </ul>
          </section>

          <footer className="pt-4 border-t border-white/10 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <p className="text-[11px] text-gray-400">Prototype mission: accelerate biological readiness for sustained extraterrestrial operations.</p>
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-400/40 text-cyan-200 transition-colors">Close & Return</button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default IntroOverlay;
