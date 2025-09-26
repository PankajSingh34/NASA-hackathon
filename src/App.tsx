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

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'planets' | 'lab' | 'survival' | 'analytics' | 'mission' | 'data' | 'advanced' | 'simulation'>('lab')

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-black relative overflow-hidden">
      {currentView === 'dashboard' && <Starfield />}
      
      {/* Main Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo/Title */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                🚀 NASA Space Biology Engine
              </h1>
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
      </div>
      
      {/* Lab System Status Monitor */}
      <LabTester />
    </div>
  )
}export default App