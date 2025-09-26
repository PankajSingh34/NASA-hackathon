import React from 'react'
import { Rocket, Brain } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <header className="text-center py-12 border-b border-white/20 mb-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-400/30 animate-pulse">
            <Rocket className="w-10 h-10 text-orange-300" />
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-400/30 animate-pulse delay-150">
            <Brain className="w-10 h-10 text-purple-300" />
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Space Biology Knowledge Engine
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Exploring 1,473+ Publications • Multi-Omics Integration • Advanced Bio-manufacturing • Mission Planning Support
        </p>
      </div>
    </header>
  )
}

export default Header