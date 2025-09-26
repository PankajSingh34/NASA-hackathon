import React from 'react';
import { Rocket, Leaf, Users2, Microscope, ShieldQuestion, Brain, Globe2, Star, Wrench } from 'lucide-react';

const ProjectAbout: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-5rem)] pb-32 relative">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-12">
        <header className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent flex flex-wrap items-center gap-3">
            <Rocket className="w-10 h-10 text-cyan-300"/> <span>NASA Space Biology Knowledge Engine</span>
          </h1>
          <p className="text-sm uppercase tracking-widest text-cyan-300/70 font-semibold">Topic • Challenge • Importance</p>
          <p className="text-gray-300 max-w-3xl leading-relaxed text-base">
            An intelligent exploration and simulation platform transforming decades of NASA space biology research into actionable, AI-augmented insights for mission planners, scientists, educators, and explorers.
          </p>
        </header>

        {/* Topic Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-cyan-300 flex items-center gap-2"><Globe2 className="w-6 h-6"/> What’s the Topic About?</h2>
          <p className="text-gray-300 leading-relaxed text-base max-w-4xl">
            NASA has conducted hundreds of biological experiments in space to understand how living systems respond to microgravity, radiation, isolation, and resource constraints. The results span plant growth dynamics, human physiological adaptation, microbial behavior, and organism development in spaceflight conditions.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Leaf className="w-6 h-6 text-emerald-300"/>, text: 'Plant growth, nutrient uptake & photobiology in microgravity.' },
              { icon: <Users2 className="w-6 h-6 text-blue-300"/>, text: 'Bone, muscle, immune, cardiovascular & cognitive system changes.' },
              { icon: <Microscope className="w-6 h-6 text-pink-300"/>, text: 'Model organism adaptation & developmental biology off Earth.' },
              { icon: <ShieldQuestion className="w-6 h-6 text-violet-300"/>, text: 'Microbial mutation, virulence, biofilms & survival in space.' }
            ].map(item => (
              <div key={item.text} className="p-4 rounded-lg bg-gradient-to-br from-slate-900/60 to-slate-800/40 border border-white/10 shadow-inner flex flex-col gap-2">
                <div>{item.icon}</div>
                <p className="text-sm text-gray-200 leading-snug">{item.text}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-300 text-base max-w-4xl">
            The core challenge: this knowledge is fragmented across 600+ dense publications, mission reports, and experimental payload summaries—difficult to query, synthesize, or simulate holistically.
          </p>
        </section>

        {/* Challenge Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-amber-300 flex items-center gap-2"><Rocket className="w-6 h-6"/> What’s the Challenge Asking?</h2>
          <p className="text-gray-300 max-w-4xl text-base">
            Build a unified, AI-enhanced platform that ingests, structures, summarizes and visualizes NASA’s space biology research while linking it to simulation layers and mission readiness context.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <h3 className="text-cyan-300 font-semibold tracking-wide text-sm">Core Objectives</h3>
              <ul className="space-y-1 text-gray-200 text-sm">
                <li>• Ingest & normalize distributed research records</li>
                <li>• Summarize complex findings via AI-assisted reduction</li>
                <li>• Construct knowledge graphs to surface relationships</li>
                <li>• Enable semantic + exploratory natural-language querying</li>
                <li>• Contextualize via physiology + ecosystem simulations</li>
              </ul>
            </div>
            <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <h3 className="text-cyan-300 font-semibold tracking-wide text-sm">User Flow Examples</h3>
              <ul className="space-y-1 text-gray-200 text-sm">
                <li>• Bone density inquiry → consolidated experiment timeline + risk trend</li>
                <li>• Mission planner → identifies underexplored immunology gaps pre-Mars</li>
                <li>• Plant growth query → environmental factor sensitivity surfaces</li>
                <li>• Student exploration → accessible summaries with linked primary sources</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Importance Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-emerald-300 flex items-center gap-2"><Star className="w-6 h-6"/> Why is This Important?</h2>
          <p className="text-gray-300 max-w-4xl text-base">
            Sustained lunar habitation and multi-year Mars missions demand biological resilience: closed-loop life support, crew health preservation, adaptive agriculture, radiation mitigation, and robust microbial/ecosystem control. Accelerating synthesis of past research shortens the path to operational readiness.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Mission Readiness', desc: 'Streamlines risk modeling & countermeasure prioritization.' , color: 'from-emerald-900/40 to-emerald-600/10 border-emerald-400/30'},
              { title: 'Knowledge Gap Detection', desc: 'Highlights low-density evidence zones before deep-space deployment.' , color: 'from-blue-900/40 to-blue-600/10 border-blue-400/30'},
              { title: 'STEM Accessibility', desc: 'Makes frontier life sciences explorable for emerging researchers & students.' , color: 'from-violet-900/40 to-violet-600/10 border-violet-400/30'}
            ].map(card => (
              <div key={card.title} className={`p-5 rounded-xl bg-gradient-to-br ${card.color} border shadow-inner`}> 
                <h4 className="text-sm font-semibold tracking-wide mb-2 text-gray-200">{card.title}</h4>
                <p className="text-xs text-gray-300 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Platform Value */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-pink-300 flex items-center gap-2"><Brain className="w-5 h-5"/> Platform Advantages</h2>
          <ul className="space-y-2 text-sm text-gray-200 max-w-3xl">
            <li>• AI summarization lowers cognitive overhead & accelerates triage.</li>
            <li>• Knowledge graph links stressors → biological system responses.</li>
            <li>• Simulation deck blends abstract knowledge with dynamic physiological + ecosystem states.</li>
            <li>• Integrity ledger conceptually supports reproducibility & audit trails.</li>
            <li>• Scenario presets provide mission-contextual framing for insights.</li>
          </ul>
        </section>

        {/* Architecture Summary */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-sky-300 flex items-center gap-2"><Wrench className="w-5 h-5"/> Architecture Snapshot</h2>
          <div className="grid lg:grid-cols-3 gap-4 text-sm">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2">
              <h3 className="text-cyan-300 font-semibold text-xs tracking-wide">Data & Knowledge</h3>
              <ul className="space-y-1 text-gray-200">
                <li>• Research area catalog (seeded)</li>
                <li>• Planned ingestion layer (future)</li>
                <li>• Knowledge graph visualization</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2">
              <h3 className="text-cyan-300 font-semibold text-xs tracking-wide">Simulation Engines</h3>
              <ul className="space-y-1 text-gray-200">
                <li>• Physiology decay & adaptation</li>
                <li>• Ecosystem population dynamics</li>
                <li>• Scenario-driven environment mapping</li>
                <li>• News & anomaly scaffolds</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2">
              <h3 className="text-cyan-300 font-semibold text-xs tracking-wide">Interface Layer</h3>
              <ul className="space-y-1 text-gray-200">
                <li>• Simulation Deck dashboards</li>
                <li>• Mission / Analytics consoles</li>
                <li>• Future replay & provenance</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-10 border-t border-white/10 text-xs text-gray-500 space-y-2">
          <p>Prototype mission: accelerate biological readiness for sustained extraterrestrial operations.</p>
          <p className="text-[10px]">© {new Date().getFullYear()} Space Biology Hackathon – For research & educational use.</p>
        </footer>
      </div>
    </div>
  );
};

export default ProjectAbout;
