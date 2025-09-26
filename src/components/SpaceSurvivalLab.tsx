import React, { useState, useEffect } from 'react'
import { Rocket, Satellite, Sun, Moon, ShieldAlert, Activity, Play, Pause, TestTubes, RefreshCw, Bone, Leaf, Radiation, Newspaper, ListTree, Calculator } from 'lucide-react'
import CryptoJS from 'crypto-js'

interface SurvivalMetrics {
  astronautHealth: number
  boneDensity: number
  radiationDamage: number
  plantGrowth: number
  oxygenLevel: number
  waterAvailability: number
  timestamp: number
}

interface SliderValues {
  gravity: number
  oxygen: number
  radiation: number
  water: number
}

interface Scenario {
  name: string
  duration: string
  description: string
  gravity: number
  oxygen: number
  radiation: number
  water: number
  icon: string
}

const SpaceSurvivalLab: React.FC = () => {
  const [sliders, setSliders] = useState<SliderValues>({
    gravity: 9.8, // Earth gravity m/s²
    oxygen: 21, // Percentage
    radiation: 0.1, // mSv/day
    water: 100 // Percentage availability
  })



  const [currentScenario, setCurrentScenario] = useState<string>('custom')
  const [simulationTime, setSimulationTime] = useState<number>(0) // Days
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [simulationHash, setSimulationHash] = useState<string>('')
  const [tamperedAlert, setTamperedAlert] = useState<boolean>(false)
  const [newsHeadlines, setNewsHeadlines] = useState<string[]>([])
  const [logs, setLogs] = useState<string[]>([])

  const scenarios: Scenario[] = [
    {
      name: 'ISS Mission',
      duration: '6 months',
      description: 'International Space Station simulation',
      gravity: 0.0, // Microgravity
      oxygen: 20.9,
      radiation: 0.4, // mSv/day
      water: 95,
  icon: 'sat'
    },
    {
      name: 'Mars Mission',
      duration: '180 days',
      description: 'Mars surface exploration',
      gravity: 3.7, // Mars gravity
      oxygen: 16,
      radiation: 0.7,
      water: 85,
  icon: 'mars'
    },
    {
      name: 'Solar Storm',
      duration: '3 days',
      description: 'Emergency solar radiation event',
      gravity: 0.0,
      oxygen: 15,
      radiation: 5.0, // High radiation
      water: 90,
  icon: 'sun'
    },
    {
      name: 'Lunar Base',
      duration: '30 days',
      description: 'Moon base operations',
      gravity: 1.6, // Moon gravity
      oxygen: 19,
      radiation: 1.2,
      water: 80,
  icon: 'moon'
    }
  ]

  // Generate simulation hash for tamper detection
  const generateHash = (values: SliderValues, time: number): string => {
    const hashInput = `${values.gravity}-${values.oxygen}-${values.radiation}-${values.water}-${time}`
    return CryptoJS.SHA256(hashInput).toString()
  }

  // Calculate survival metrics using realistic formulas
  const calculateMetrics = (sliderValues: SliderValues, timeInDays: number): SurvivalMetrics => {
    const t = timeInDays / 365 // Convert to years for bone density formula
    
    // Bone Density Loss Formula: BD = BD0 * (1 - k * (1 - gravity/9.8) * t)
    const gravityFactor = sliderValues.gravity / 9.8
    const boneLossRate = 0.02 // 2% per year in zero gravity
    const boneDensity = Math.max(0, 100 * (1 - boneLossRate * (1 - gravityFactor) * t * 12)) // Monthly rate
    
    // Radiation Damage: RD = Base + alpha * Radiation * t
    const radiationDamage = Math.min(100, sliderValues.radiation * timeInDays * 0.5)
    
    // Plant Growth: PG = Base * OxygenFactor * GravityFactor * WaterFactor
    const oxygenFactor = Math.min(1, sliderValues.oxygen / 21)
    const waterFactor = sliderValues.water / 100
    const gravityPlantFactor = Math.min(1, 0.3 + 0.7 * gravityFactor) // Plants need some gravity
    const plantGrowth = Math.max(0, 100 * oxygenFactor * gravityPlantFactor * waterFactor)
    
    // Overall Astronaut Health
    const oxygenHealth = Math.min(100, sliderValues.oxygen * 4.76) // Drops rapidly below 16%
    const radiationHealth = Math.max(0, 100 - radiationDamage)
    const astronautHealth = Math.min(oxygenHealth, radiationHealth, boneDensity)

    return {
      astronautHealth,
      boneDensity,
      radiationDamage,
      plantGrowth,
      oxygenLevel: sliderValues.oxygen,
      waterAvailability: sliderValues.water,
      timestamp: Date.now()
    }
  }

  // Generate news headlines based on metrics
  const generateNewsHeadlines = (newMetrics: SurvivalMetrics): string[] => {
    const headlines: string[] = []
    
    if (newMetrics.astronautHealth < 70) {
  headlines.push(`ALERT: Astronaut health drops to ${newMetrics.astronautHealth.toFixed(1)}% in space simulation`)
    }
    
    if (newMetrics.boneDensity < 85) {
  headlines.push(`ALERT: Bone density loss detected - ${newMetrics.boneDensity.toFixed(1)}% of Earth baseline`)
    }
    
    if (newMetrics.radiationDamage > 30) {
  headlines.push(`RADIATION WARNING: Exposure at ${newMetrics.radiationDamage.toFixed(1)}% threshold`)
    }
    
    if (newMetrics.plantGrowth < 60) {
  headlines.push(`PLANT GROWTH CONCERN: ${(100 - newMetrics.plantGrowth).toFixed(1)}% reduction detected`)
    }
    
    if (newMetrics.oxygenLevel < 18) {
  headlines.push(`OXYGEN CRITICAL: Atmospheric O2 at ${newMetrics.oxygenLevel.toFixed(1)}%`)
    }

    if (headlines.length === 0) {
  headlines.push(`SYSTEMS NOMINAL: Crew + botany stable`)
    }
    
    return headlines
  }

  // Log events
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]) // Keep last 10 logs
  }

  // Handle slider changes with tamper detection
  const handleSliderChange = (key: keyof SliderValues, value: number) => {
    const newValues = { ...sliders, [key]: value }
    setSliders(newValues)
    
    // Generate new hash
    const newHash = generateHash(newValues, simulationTime)
    
    // Check for tampering (simplified - in real app, compare with stored hash)
    if (simulationHash && simulationHash !== newHash && isRunning) {
      setTamperedAlert(true)
  addLog(`TAMPER DETECTED: ${key.toUpperCase()} manually adjusted during simulation`)
    }
    
    setSimulationHash(newHash)
    addLog(`${key.toUpperCase()} adjusted to ${value}`)
  }

  // Load preset scenario
  const loadScenario = (scenarioName: string) => {
    const scenario = scenarios.find(s => s.name === scenarioName)
    if (scenario) {
      setSliders({
        gravity: scenario.gravity,
        oxygen: scenario.oxygen,
        radiation: scenario.radiation,
        water: scenario.water
      })
      setCurrentScenario(scenarioName)
      setSimulationTime(0)
      setTamperedAlert(false)
  addLog(`Loaded preset scenario: ${scenario.name}`)
    }
  }

  // Start/Stop simulation
  const toggleSimulation = () => {
    if (isRunning) {
      setIsRunning(false)
  addLog(`Simulation stopped at day ${simulationTime}`)
    } else {
      setIsRunning(true)
      setSimulationHash(generateHash(sliders, simulationTime))
  addLog(`Simulation started with ${currentScenario} parameters`)
    }
  }

  // Reset simulation
  const resetSimulation = () => {
    setSimulationTime(0)
    setIsRunning(false)
    setTamperedAlert(false)
    setNewsHeadlines([])
  addLog(`Simulation reset`)
  }

  // Simulation timer effect
  useEffect(() => {
    let interval: number | null = null
    
    if (isRunning) {
      interval = setInterval(() => {
        setSimulationTime(prevTime => {
          const newTime = prevTime + 0.1 // 0.1 day increments for faster demo
          const newMetrics = calculateMetrics(sliders, newTime)
          
          // Generate news every few days
          if (Math.floor(newTime) % 5 === 0 && Math.floor(newTime) > 0) {
            const headlines = generateNewsHeadlines(newMetrics)
            setNewsHeadlines(headlines)
          }
          
          return newTime
        })
      }, 500) // Update every 500ms
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, sliders])

  // Calculate current metrics
  const currentMetrics = calculateMetrics(sliders, simulationTime)

  // Get health status color
  const getHealthColor = (value: number) => {
    if (value >= 80) return 'text-green-400'
    if (value >= 60) return 'text-yellow-400'
    if (value >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  // Get health background color
  const getHealthBgColor = (value: number) => {
    if (value >= 80) return 'bg-green-500'
    if (value >= 60) return 'bg-yellow-500'
    if (value >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3 justify-center">
            <Rocket className="w-10 h-10 text-blue-300"/> <span>Mini Space Survival Lab</span>
          </h1>
          <p className="text-gray-300">Interactive space survival simulator for astronauts and plants</p>
        </div>

        {/* Tamper Alert */}
        {tamperedAlert && (
          <div className="bg-red-500/15 border border-red-500/50 rounded-lg p-4 mb-6 animate-pulse">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-red-400"/>
              <div>
                <h3 className="text-red-400 font-bold tracking-wide text-sm">TAMPERING DETECTED</h3>
                <p className="text-red-300 text-xs">Manual parameter adjustment detected during simulation</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          
          {/* Control Panel */}
          <div className="xl:col-span-1 space-y-6">
            
            {/* Preset Scenarios */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Rocket className="w-5 h-5"/> Preset Scenarios</h3>
              <div className="space-y-3">
                {scenarios.map((scenario) => (
                  <button
                    key={scenario.name}
                    onClick={() => loadScenario(scenario.name)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-300 border ${
                      currentScenario === scenario.name
                        ? 'bg-blue-500/30 border-blue-400'
                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg mr-2">
                          {scenario.icon === 'sat' && <Satellite className="w-5 h-5 inline text-cyan-300"/>}
                          {scenario.icon === 'mars' && <Rocket className="w-5 h-5 inline text-red-400"/>}
                          {scenario.icon === 'sun' && <Sun className="w-5 h-5 inline text-amber-300"/>}
                          {scenario.icon === 'moon' && <Moon className="w-5 h-5 inline text-slate-300"/>}
                        </span>
                        <span className="font-semibold">{scenario.name}</span>
                      </div>
                      <span className="text-sm text-gray-400">{scenario.duration}</span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">{scenario.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Environmental Controls */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Activity className="w-5 h-5"/> Environmental Controls</h3>
              
              {/* Gravity Slider */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Gravity (m/s²)</label>
                  <span className="text-sm text-blue-400">{sliders.gravity.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="9.8"
                  step="0.1"
                  value={sliders.gravity}
                  onChange={(e) => handleSliderChange('gravity', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Zero-G</span>
                  <span>Earth</span>
                </div>
              </div>

              {/* Oxygen Slider */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Oxygen (%)</label>
                  <span className="text-sm text-green-400">{sliders.oxygen.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="25"
                  step="0.1"
                  value={sliders.oxygen}
                  onChange={(e) => handleSliderChange('oxygen', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Critical</span>
                  <span>Optimal</span>
                </div>
              </div>

              {/* Radiation Slider */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Radiation (mSv/day)</label>
                  <span className="text-sm text-orange-400">{sliders.radiation.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={sliders.radiation}
                  onChange={(e) => handleSliderChange('radiation', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Earth-like</span>
                  <span>Extreme</span>
                </div>
              </div>

              {/* Water Slider */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Water Availability (%)</label>
                  <span className="text-sm text-cyan-400">{sliders.water.toFixed(0)}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="1"
                  value={sliders.water}
                  onChange={(e) => handleSliderChange('water', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Limited</span>
                  <span>Full</span>
                </div>
              </div>
            </div>

            {/* Simulation Controls */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Activity className="w-5 h-5"/> Simulation Control</h3>
              <div className="space-y-4">
                <div className="flex space-x-3">
                  <button
                    onClick={toggleSimulation}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      isRunning
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {isRunning ? <span className="flex items-center gap-2 justify-center"><Pause className="w-4 h-4"/>Pause</span> : <span className="flex items-center gap-2 justify-center"><Play className="w-4 h-4"/>Start</span>}
                  </button>
                  <button
                    onClick={() => {
                      // Run all scenario tests automatically
                      resetSimulation();
                      scenarios.forEach((scenario, index) => {
                        setTimeout(() => {
                          loadScenario(scenario.name);
                          setTimeout(() => {
                            setIsRunning(true);
                            setTimeout(() => setIsRunning(false), 3000); // Run each for 3 seconds
                          }, 1000);
                        }, index * 5000); // 5 seconds between each test
                      });
                    }}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-all duration-300 mb-2"
                  >
                    <span className="flex items-center gap-2"><TestTubes className="w-4 h-4"/>Test All</span>
                  </button>
                  
                  <button
                    onClick={resetSimulation}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all duration-300"
                  >
                    <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4"/>Reset</span>
                  </button>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">Day {simulationTime.toFixed(1)}</div>
                  <div className="text-sm text-gray-400">Mission Duration</div>
                </div>
                <div className="text-xs text-gray-500">
                  Hash: {simulationHash.substring(0, 16)}...
                </div>
              </div>
            </div>
          </div>

          {/* Health Metrics */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Health Bars */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Activity className="w-5 h-5"/> Survival Metrics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Astronaut Health */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium flex items-center gap-1"><Activity className="w-4 h-4 text-cyan-300"/>Astronaut Health</span>
                      <span className={`font-bold ${getHealthColor(currentMetrics.astronautHealth)}`}>
                        {currentMetrics.astronautHealth.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-4">
                      <div 
                        className={`h-4 rounded-full transition-all duration-500 ${getHealthBgColor(currentMetrics.astronautHealth)}`}
                        style={{ width: `${currentMetrics.astronautHealth}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium flex items-center gap-1"><Bone className="w-4 h-4 text-amber-300"/>Bone Density</span>
                      <span className={`font-bold ${getHealthColor(currentMetrics.boneDensity)}`}>
                        {currentMetrics.boneDensity.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-4">
                      <div 
                        className={`h-4 rounded-full transition-all duration-500 ${getHealthBgColor(currentMetrics.boneDensity)}`}
                        style={{ width: `${currentMetrics.boneDensity}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Plant Health */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium flex items-center gap-1"><Leaf className="w-4 h-4 text-emerald-300"/>Plant Growth</span>
                      <span className={`font-bold ${getHealthColor(currentMetrics.plantGrowth)}`}>
                        {currentMetrics.plantGrowth.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-4">
                      <div 
                        className={`h-4 rounded-full transition-all duration-500 ${getHealthBgColor(currentMetrics.plantGrowth)}`}
                        style={{ width: `${currentMetrics.plantGrowth}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium flex items-center gap-1"><Radiation className="w-4 h-4 text-red-400"/>Radiation Damage</span>
                      <span className={`font-bold ${getHealthColor(100 - currentMetrics.radiationDamage)}`}>
                        {currentMetrics.radiationDamage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-4">
                      <div 
                        className="h-4 rounded-full transition-all duration-500 bg-red-500"
                        style={{ width: `${currentMetrics.radiationDamage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* News Generator */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Newspaper className="w-5 h-5"/> Mission News</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {newsHeadlines.length > 0 ? (
                  newsHeadlines.map((headline, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-3 border-l-4 border-blue-400">
                      <p className="text-sm">{headline}</p>
                      <p className="text-xs text-gray-400 mt-1">Day {simulationTime.toFixed(1)}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic">Start simulation to generate news headlines...</p>
                )}
              </div>
            </div>

            {/* Event Logs */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><ListTree className="w-5 h-5"/> Event Logs</h3>
              <div className="space-y-1 max-h-48 overflow-y-auto font-mono text-sm">
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <div key={index} className="text-gray-300 hover:bg-white/5 rounded px-2 py-1">
                      {log}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic">No events logged yet...</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Science Formulas Footer */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Calculator className="w-5 h-5"/> Scientific Formulas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">Bone Density Loss</h4>
              <code className="text-gray-300">BD = BD₀ × (1 - k × (1 - g/9.8) × t)</code>
              <p className="text-xs text-gray-400 mt-1">Where k=0.02/year, g=gravity, t=time</p>
            </div>
            <div>
              <h4 className="font-semibold text-orange-400 mb-2">Radiation Damage</h4>
              <code className="text-gray-300">RD = R × t × 0.5</code>
              <p className="text-xs text-gray-400 mt-1">Where R=radiation level, t=time in days</p>
            </div>
            <div>
              <h4 className="font-semibold text-green-400 mb-2">Plant Growth</h4>
              <code className="text-gray-300">PG = Base × O₂ × G × H₂O</code>
              <p className="text-xs text-gray-400 mt-1">Oxygen, Gravity, and Water factors</p>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}

export default SpaceSurvivalLab