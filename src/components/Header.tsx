import React from 'react'

const Header: React.FC = () => {
  return (
    <header className="text-center py-12 border-b border-white/20 mb-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-4xl font-bold text-orange-400 mb-5 animate-pulse">
          🚀 NASA
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