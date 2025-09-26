import { useState, useEffect } from 'react'
import {
  FlaskConical,
  Globe2,
  ShieldHalf,
  Brain,
  Rocket,
  BarChart3,
  Microscope,
  TerminalSquare,
  Cpu,
  Info,
  Menu,
  X
} from 'lucide-react'
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Close mobile menu on view change or resize > md
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => { setMobileMenuOpen(false) }, [currentView])

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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center gap-3">
            {/* Logo/Title */}
            <div className="flex items-center relative min-w-0 mr-6 flex-shrink-0">
              <button
                type="button"
                onClick={() => { console.log('Logo clicked -> opening intro + about view'); setShowIntro(true); setCurrentView('about'); }}
                onMouseEnter={openTitleInfo}
                onMouseLeave={scheduleCloseTitleInfo}
                onFocus={openTitleInfo}
                onBlur={scheduleCloseTitleInfo}
                className="text-left group cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400/60 rounded max-w-[70vw]"
                aria-label="Open mission context and about page"
              >
                <h1 className="flex items-center gap-1.5 text-base sm:text-xl font-bold leading-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-violet-400 transition-colors whitespace-nowrap pr-2">
                  <Rocket className="w-5 h-5 text-orange-300" /> NASA Space Biology Engine
                </h1>
                <span className="block text-[9px] sm:text-[10px] tracking-wider text-cyan-300/60 group-hover:text-cyan-200 mt-0.5">Tap for Mission Context</span>
              </button>
              {showTitleInfo && (
                <div
                  onMouseEnter={openTitleInfo}
                  onMouseLeave={scheduleCloseTitleInfo}
                  className="absolute left-0 top-full mt-2 w-[420px] max-w-[92vw] sm:max-w-[80vw] z-50"
                >
                  <div className="rounded-xl border border-cyan-400/20 bg-gradient-to-br from-gray-900/95 via-slate-900/90 to-black/90 shadow-xl ring-1 ring-cyan-500/20 p-4 backdrop-blur-md animate-fadeIn">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-400/30">
                        <Microscope className="w-6 h-6 text-cyan-300" />
                      </div>
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

            {/* Mobile Menu Toggle */}
            <div className="flex items-center md:hidden ml-auto">
              <button
                onClick={() => setMobileMenuOpen(o => !o)}
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
                className={`p-2 rounded-lg border border-white/20 bg-black/40 backdrop-blur-sm text-cyan-200 hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/60 ${mobileMenuOpen ? 'ring-2 ring-cyan-500/50' : ''}`}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Navigation Menu */}
            <div className="hidden md:flex items-center flex-wrap gap-2 overflow-x-auto ml-auto pr-1">
              <button
                onClick={() => setCurrentView('lab')}
                className={`px-3 py-2 rounded-full transition-all duration-300 border border-white/20 text-sm whitespace-nowrap ${
                  currentView === 'lab' 
                    ? 'bg-green-600 text-white shadow-lg' 
                    : 'bg-black/50 backdrop-blur-md text-gray-300 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5"><FlaskConical className="w-4 h-4" /> Biology Lab</span>
              </button>
              <button
                onClick={() => setCurrentView('planets')}
                className={`px-3 py-2 rounded-full transition-all duration-300 border border-white/20 text-sm whitespace-nowrap ${
                  currentView === 'planets' 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'bg-black/50 backdrop-blur-md text-gray-300 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5"><Globe2 className="w-4 h-4" /> Solar System</span>
              </button>
              <button
                onClick={() => setCurrentView('survival')}
                className={`px-3 py-2 rounded-full transition-all duration-300 border border-white/20 text-sm whitespace-nowrap ${
                  currentView === 'survival' 
                    ? 'bg-violet-600 text-white shadow-lg' 
                    : 'bg-black/50 backdrop-blur-md text-gray-300 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5"><ShieldHalf className="w-4 h-4" /> Survival Lab</span>
              </button>
              <button
                onClick={() => setCurrentView('analytics')}
                className={`px-3 py-2 rounded-full transition-all duration-300 border border-white/20 text-sm whitespace-nowrap ${
                  currentView === 'analytics' 
                    ? 'bg-cyan-600 text-white shadow-lg' 
                    : 'bg-black/50 backdrop-blur-md text-gray-300 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5"><Brain className="w-4 h-4" /> AI Analytics</span>
              </button>
              <button
                onClick={() => setCurrentView('mission')}
                className={`px-3 py-2 rounded-full transition-all duration-300 border border-white/20 text-sm whitespace-nowrap ${
                  currentView === 'mission' 
                    ? 'bg-red-600 text-white shadow-lg' 
                    : 'bg-black/50 backdrop-blur-md text-gray-300 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5"><Rocket className="w-4 h-4" /> Mission Control</span>
              </button>
              <button
                onClick={() => setCurrentView('data')}
                className={`px-3 py-2 rounded-full transition-all duration-300 border border-white/20 text-sm whitespace-nowrap ${
                  currentView === 'data' 
                    ? 'bg-orange-600 text-white shadow-lg' 
                    : 'bg-black/50 backdrop-blur-md text-gray-300 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5"><BarChart3 className="w-4 h-4" /> Data Viz</span>
              </button>
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-3 py-2 rounded-full transition-all duration-300 border border-white/20 text-sm whitespace-nowrap ${
                  currentView === 'dashboard' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-black/50 backdrop-blur-md text-gray-300 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5"><Microscope className="w-4 h-4" /> Research Hub</span>
              </button>
              <button
                onClick={() => setCurrentView('advanced')}
                className={`px-3 py-2 rounded-full transition-all duration-300 border border-white/20 text-sm whitespace-nowrap ${
                  currentView === 'advanced' 
                    ? 'bg-teal-600 text-white shadow-lg' 
                    : 'bg-black/50 backdrop-blur-md text-gray-300 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5"><TerminalSquare className="w-4 h-4" /> Advanced Console</span>
              </button>
              <button
                onClick={() => setCurrentView('simulation')}
                className={`px-3 py-2 rounded-full transition-all duration-300 border border-white/20 text-sm whitespace-nowrap ${
                  currentView === 'simulation' 
                    ? 'bg-lime-600 text-white shadow-lg' 
                    : 'bg-black/50 backdrop-blur-md text-gray-300 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4" /> Simulation Deck</span>
              </button>
              <button
                onClick={() => { setCurrentView('about'); setShowIntro(true); }}
                className={`px-3 py-2 rounded-full transition-all duration-300 border border-white/20 text-sm whitespace-nowrap ${
                  currentView === 'about' 
                    ? 'bg-fuchsia-600 text-white shadow-lg' 
                    : 'bg-black/50 backdrop-blur-md text-gray-300 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5"><Info className="w-4 h-4" /> About</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        <div
          className={`md:hidden overflow-hidden transition-[max-height] duration-500 ease-in-out bg-black/70 backdrop-blur-xl border-t border-white/10 ${mobileMenuOpen ? 'max-h-[520px]' : 'max-h-0'}`}
          aria-hidden={!mobileMenuOpen}
        >
          <div className="px-4 py-4 grid grid-cols-2 gap-3 text-sm">
            {[
              { key: 'lab', label: <span className="flex items-center gap-1"><FlaskConical className="w-4 h-4" /> Lab</span>, color: 'bg-green-600' },
              { key: 'planets', label: <span className="flex items-center gap-1"><Globe2 className="w-4 h-4" /> System</span>, color: 'bg-purple-600' },
              { key: 'survival', label: <span className="flex items-center gap-1"><ShieldHalf className="w-4 h-4" /> Survival</span>, color: 'bg-violet-600' },
              { key: 'analytics', label: <span className="flex items-center gap-1"><Brain className="w-4 h-4" /> AI</span>, color: 'bg-cyan-600' },
              { key: 'mission', label: <span className="flex items-center gap-1"><Rocket className="w-4 h-4" /> Mission</span>, color: 'bg-red-600' },
              { key: 'data', label: <span className="flex items-center gap-1"><BarChart3 className="w-4 h-4" /> Data</span>, color: 'bg-orange-600' },
              { key: 'dashboard', label: <span className="flex items-center gap-1"><Microscope className="w-4 h-4" /> Research</span>, color: 'bg-blue-600' },
              { key: 'advanced', label: <span className="flex items-center gap-1"><TerminalSquare className="w-4 h-4" /> Console</span>, color: 'bg-teal-600' },
              { key: 'simulation', label: <span className="flex items-center gap-1"><Cpu className="w-4 h-4" /> Sim Deck</span>, color: 'bg-lime-600' },
              { key: 'about', label: <span className="flex items-center gap-1"><Info className="w-4 h-4" /> About</span>, color: 'bg-fuchsia-600' }
            ].map(btn => (
              <button
                key={btn.key}
                onClick={() => setCurrentView(btn.key as any)}
                className={`w-full px-3 py-2 rounded-lg font-medium border border-white/15 shadow-sm transition-all active:scale-[0.97] ${currentView === btn.key ? `${btn.color} text-white` : 'bg-white/5 text-gray-300 hover:bg-white/15'}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content Area with proper top spacing */}
  <div className="pt-24 md:pt-20">
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