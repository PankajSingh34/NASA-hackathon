import { useState } from 'react'
import Starfield from './components/Starfield'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import PlanetarySystem from './components/PlanetarySystem'
import BiologyLab from './components/BiologyLab'
import AIAnalytics from './components/AIAnalytics'
import MissionControl from './components/MissionControl'
import DataVisualization from './components/DataVisualization'
import SpaceSurvivalLab from './components/SpaceSurvivalLab'
import LabTester from './components/LabTester'
import KnowledgeGraph from './components/KnowledgeGraph'
import { researchAreas } from './data/researchAreas'
import AdvancedConsole from './components/AdvancedConsole'
import SimulationDeck from './components/SimulationDeck'
import IntroOverlay from './components/IntroOverlay'
import ProjectAbout from './components/ProjectAbout'

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'planets' | 'lab' | 'survival' | 'analytics' | 'mission' | 'data' | 'advanced' | 'simulation' | 'about'>('lab')
  const [showIntro, setShowIntro] = useState(false)
  const [showTitleInfo, setShowTitleInfo] = useState(false)
  const [hoverTimeout, setHoverTimeout] = useState<number | null>(null)

  const openTitleInfo = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    setShowTitleInfo(true)
  }
  const scheduleCloseTitleInfo = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout)
    const t = window.setTimeout(() => setShowTitleInfo(false), 180)
    setHoverTimeout(t)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-black relative overflow-hidden">
      {currentView === 'dashboard' && <Starfield />}
      
      {/* Main Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo/Title */}
            <div className="flex items-center relative">
              <button
                type="button"
                onClick={() => { console.log('Logo clicked -> opening intro + about view'); setShowIntro(true); setCurrentView('about'); }}
                onMouseEnter={openTitleInfo}
                onMouseLeave={scheduleCloseTitleInfo}
                onFocus={openTitleInfo}
                onBlur={scheduleCloseTitleInfo}
                className="text-left group cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400/60 rounded"
                aria-label="Open mission context and about page"
              >
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-violet-400 transition-colors">
                  🚀 NASA Space Biology Engine
                </h1>
                <span className="block text-[10px] tracking-wider text-cyan-300/60 group-hover:text-cyan-200 mt-0.5">Click for Mission Context</span>
              </button>
              {showTitleInfo && (
                <div
                  onMouseEnter={openTitleInfo}
                  onMouseLeave={scheduleCloseTitleInfo}
                  className="absolute left-0 top-full mt-2 w-[420px] max-w-[80vw] z-50"
                >
                  <div className="rounded-xl border border-cyan-400/20 bg-gradient-to-br from-gray-900/95 via-slate-900/90 to-black/90 shadow-xl ring-1 ring-cyan-500/20 p-4 backdrop-blur-md animate-fadeIn">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">🧬</div>
                      <div className="space-y-2">
                        <p className="text-[13px] leading-relaxed text-gray-200">
                          Interactive platform fusing NASA space biology research with real-time physiology & ecosystem simulations. Explore mission scenarios, system adaptation, and knowledge architecture.
                        </p>
                        <ul className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-cyan-200/80 font-medium">
                          <li>Physiology engine</li>
                          <li>Ecosystem dynamics</li>
                          <li>Scenario presets</li>
                          <li>Integrity ledger</li>
                          <li>AI insight scaffolds</li>
                          <li>Knowledge graph</li>
                        </ul>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => { setCurrentView('about'); setShowIntro(true); }}
                            className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-cyan-600/40 hover:bg-cyan-600/60 text-cyan-50 border border-cyan-400/40 transition-colors"
                          >Full Overview →</button>
                          <button
                            onClick={() => { setShowTitleInfo(false) }}
                            className="px-2 py-1 rounded-md text-[10px] bg-white/10 hover:bg-white/20 text-gray-300 border border-white/15"
                          >Close</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Navigation Menu */}
            <div className="flex space-x-2 overflow-x-auto">
              <button
                onClick={() => setCurrentView('lab')}
                className={`px-3 py-2 rounded-full transition-all duration-300 border border-white/20 text-sm whitespace-nowrap ${
                  currentView === 'lab' 
                    ? 'bg-green-600 text-white shadow-lg' 
                    : 'bg-black/50 backdrop-blur-md text-gray-300 hover:text-white'
                }`}
              >
                🧬 Biology Lab
              </button>
              <button
                onClick={() => setCurrentView('planets')}
                className={`px-3 py-2 rounded-full transition-all duration-300 border border-white/20 text-sm whitespace-nowrap ${
                  currentView === 'planets' 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'bg-black/50 backdrop-blur-md text-gray-300 hover:text-white'
                }`}
              >
                🪐 Solar System
              </button>
              <button
                onClick={() => setCurrentView('survival')}
                className={`px-3 py-2 rounded-full transition-all duration-300 border border-white/20 text-sm whitespace-nowrap ${
                  currentView === 'survival' 
                    ? 'bg-violet-600 text-white shadow-lg' 
                    : 'bg-black/50 backdrop-blur-md text-gray-300 hover:text-white'
                }`}
              >
                🌌 Survival Lab
              </button>
              <button
                onClick={() => setCurrentView('analytics')}
                className={`px-3 py-2 rounded-full transition-all duration-300 border border-white/20 text-sm whitespace-nowrap ${
                  currentView === 'analytics' 
                    ? 'bg-cyan-600 text-white shadow-lg' 
                    : 'bg-black/50 backdrop-blur-md text-gray-300 hover:text-white'
                }`}
              >
                🤖 AI Analytics
              </button>
              <button
                onClick={() => setCurrentView('mission')}
                className={`px-3 py-2 rounded-full transition-all duration-300 border border-white/20 text-sm whitespace-nowrap ${
                  currentView === 'mission' 
                    ? 'bg-red-600 text-white shadow-lg' 
                    : 'bg-black/50 backdrop-blur-md text-gray-300 hover:text-white'
                }`}
              >
                🚀 Mission Control
              </button>
              <button
                onClick={() => setCurrentView('data')}
                className={`px-3 py-2 rounded-full transition-all duration-300 border border-white/20 text-sm whitespace-nowrap ${
                  currentView === 'data' 
                    ? 'bg-orange-600 text-white shadow-lg' 
                    : 'bg-black/50 backdrop-blur-md text-gray-300 hover:text-white'
                }`}
              >
                📊 Data Viz
              </button>
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-3 py-2 rounded-full transition-all duration-300 border border-white/20 text-sm whitespace-nowrap ${
                  currentView === 'dashboard' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-black/50 backdrop-blur-md text-gray-300 hover:text-white'
                }`}
              >
                🔬 Research Hub
              </button>
              <button
                onClick={() => setCurrentView('advanced')}
                className={`px-3 py-2 rounded-full transition-all duration-300 border border-white/20 text-sm whitespace-nowrap ${
                  currentView === 'advanced' 
                    ? 'bg-teal-600 text-white shadow-lg' 
                    : 'bg-black/50 backdrop-blur-md text-gray-300 hover:text-white'
                }`}
              >
                🧠 Advanced Console
              </button>
              <button
                onClick={() => setCurrentView('simulation')}
                className={`px-3 py-2 rounded-full transition-all duration-300 border border-white/20 text-sm whitespace-nowrap ${
                  currentView === 'simulation' 
                    ? 'bg-lime-600 text-white shadow-lg' 
                    : 'bg-black/50 backdrop-blur-md text-gray-300 hover:text-white'
                }`}
              >
                🧪 Simulation Deck
              </button>
              <button
                onClick={() => { setCurrentView('about'); setShowIntro(true); }}
                className={`px-3 py-2 rounded-full transition-all duration-300 border border-white/20 text-sm whitespace-nowrap ${
                  currentView === 'about' 
                    ? 'bg-fuchsia-600 text-white shadow-lg' 
                    : 'bg-black/50 backdrop-blur-md text-gray-300 hover:text-white'
                }`}
              >
                📘 About
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area with proper top spacing */}
      <div className="pt-20">
        {/* Render Current View */}
        {currentView === 'dashboard' && (
          <div className="relative z-10">
            <Header />
            <main className="container mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <Dashboard researchAreas={researchAreas} />
              </div>
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 h-96">
                  <h3 className="text-xl font-bold text-white mb-4">Knowledge Graph</h3>
                  <KnowledgeGraph />
                </div>
                <AIAnalytics researchAreas={researchAreas} />
              </div>
            </div>
          </main>
        </div>
      )}
      
      {currentView === 'planets' && (
        <div className="relative w-full h-screen">
          <PlanetarySystem />
        </div>
      )}
      
      {currentView === 'lab' && <BiologyLab />}
      
      {currentView === 'survival' && <SpaceSurvivalLab />}
      
      {currentView === 'analytics' && <AIAnalytics researchAreas={researchAreas} />}
      
      {currentView === 'mission' && <MissionControl />}
      
        {currentView === 'data' && <DataVisualization />}
      {currentView === 'advanced' && (
        <div className="max-w-7xl mx-auto px-4 pb-24">
          <AdvancedConsole />
        </div>
      )}
      {currentView === 'simulation' && (
        <div className="max-w-7xl mx-auto px-4 pb-24">
          <SimulationDeck />
        </div>
      )}
      {currentView === 'about' && (
        <div className="max-w-7xl mx-auto px-4 pb-24">
          <ProjectAbout />
        </div>
      )}
      </div>
      
      {/* Lab System Status Monitor */}
      <LabTester />
      {showIntro && <IntroOverlay onClose={() => setShowIntro(false)} />}
    </div>
  )
}export default App