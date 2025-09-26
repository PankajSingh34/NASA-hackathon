import React, { useState, useEffect } from 'react';

interface Mission {
  id: string;
  name: string;
  status: 'active' | 'planned' | 'completed';
  launchDate: string;
  duration: string;
  objectives: string[];
  experiments: Experiment[];
  dataStreaming: boolean;
  location: string;
}

interface Experiment {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'scheduled';
  progress: number;
  dataPoints: number;
  lastUpdate: string;
  criticalFindings?: string;
}

const MissionControl: React.FC = () => {
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [realTimeData, setRealTimeData] = useState<{[key: string]: number}>({});
  const [isStreaming, setIsStreaming] = useState(true);

  const missions: Mission[] = [
    {
      id: 'artemis-3',
      name: 'Artemis III',
      status: 'planned',
      launchDate: '2026-12-15',
      duration: '30 days',
      location: 'Lunar South Pole',
      objectives: [
        'First woman and next man on Moon',
        'Establish sustainable lunar presence',
        'Test life support systems for Mars',
        'Conduct astrobiology experiments'
      ],
      experiments: [
        {
          id: 'lunar-bio-1',
          name: 'Lunar Regolith Plant Growth',
          status: 'scheduled',
          progress: 0,
          dataPoints: 0,
          lastUpdate: '2025-09-26T10:30:00Z'
        },
        {
          id: 'radiation-bio-1',
          name: 'Deep Space Radiation Effects',
          status: 'scheduled',
          progress: 0,
          dataPoints: 0,
          lastUpdate: '2025-09-26T10:30:00Z'
        }
      ],
      dataStreaming: false
    },
    {
      id: 'iss-expedition-70',
      name: 'ISS Expedition 70',
      status: 'active',
      launchDate: '2023-09-15',
      duration: '6 months',
      location: 'Low Earth Orbit',
      objectives: [
        'Microgravity research',
        'Plant growth experiments',
        'Human physiological studies',
        'Technology demonstrations'
      ],
      experiments: [
        {
          id: 'veggie-5',
          name: 'Veggie-05: Advanced Plant Habitat',
          status: 'running',
          progress: 78,
          dataPoints: 15420,
          lastUpdate: '2025-09-26T14:22:00Z',
          criticalFindings: 'Tomatoes showing 23% faster growth in optimized LED conditions'
        },
        {
          id: 'tissue-chips-2',
          name: 'Tissue Chips in Space',
          status: 'running',
          progress: 92,
          dataPoints: 8930,
          lastUpdate: '2025-09-26T13:45:00Z',
          criticalFindings: 'Liver-on-chip models show enhanced drug metabolism pathways'
        },
        {
          id: 'cardinal-muscle',
          name: 'Cardinal Muscle Experiment',
          status: 'completed',
          progress: 100,
          dataPoints: 24680,
          lastUpdate: '2025-09-20T16:30:00Z',
          criticalFindings: 'Identified key genes responsible for muscle atrophy in microgravity'
        }
      ],
      dataStreaming: true
    },
    {
      id: 'mars-sample-return',
      name: 'Mars Sample Return',
      status: 'planned',
      launchDate: '2028-07-20',
      duration: '26 months',
      location: 'Mars / Earth Return',
      objectives: [
        'Retrieve Perseverance samples',
        'Search for signs of ancient life',
        'Analyze Martian biosignatures',
        'Test planetary protection protocols'
      ],
      experiments: [
        {
          id: 'mars-bio-analysis',
          name: 'Martian Biosignature Analysis',
          status: 'scheduled',
          progress: 0,
          dataPoints: 0,
          lastUpdate: '2025-09-26T10:30:00Z'
        }
      ],
      dataStreaming: false
    },
    {
      id: 'europa-clipper',
      name: 'Europa Clipper',
      status: 'active',
      launchDate: '2024-10-14',
      duration: '5.5 years',
      location: 'Jupiter System',
      objectives: [
        'Study Europa\'s subsurface ocean',
        'Assess habitability potential',
        'Analyze ice shell composition',
        'Search for organic compounds'
      ],
      experiments: [
        {
          id: 'europa-ice-analysis',
          name: 'Ice Shell Penetrating Radar',
          status: 'running',
          progress: 12,
          dataPoints: 3400,
          lastUpdate: '2025-09-26T11:15:00Z',
          criticalFindings: 'Detected potential water plume activity near south polar region'
        }
      ],
      dataStreaming: true
    }
  ];

  // Simulate real-time data streaming
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const newData: {[key: string]: number} = {};
      
      missions.forEach(mission => {
        if (mission.dataStreaming) {
          mission.experiments.forEach(exp => {
            if (exp.status === 'running') {
              newData[`${mission.id}_${exp.id}_oxygen`] = 20.5 + Math.random() * 0.8;
              newData[`${mission.id}_${exp.id}_co2`] = 0.4 + Math.random() * 0.1;
              newData[`${mission.id}_${exp.id}_humidity`] = 60 + Math.random() * 10;
              newData[`${mission.id}_${exp.id}_temperature`] = 22 + Math.random() * 3;
              newData[`${mission.id}_${exp.id}_growth_rate`] = Math.random() * 100;
            }
          });
        }
      });
      
      setRealTimeData(newData);
    }, 2000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'planned': return 'text-blue-400 bg-blue-400/20';
      case 'completed': return 'text-gray-400 bg-gray-400/20';
      case 'running': return 'text-green-400 bg-green-400/20';
      case 'scheduled': return 'text-yellow-400 bg-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatLastUpdate = (dateString: string) => {
    const now = new Date();
    const update = new Date(dateString);
    const diffMs = now.getTime() - update.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            🚀 NASA Mission Control Center
          </h1>
          <p className="text-xl text-gray-300">
            Real-time monitoring of space biology experiments across active missions
          </p>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className="text-sm text-gray-400">
                {isStreaming ? 'Live Data Stream Active' : 'Data Stream Offline'}
              </span>
            </div>
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className={`px-3 py-1 rounded-full text-xs ${
                isStreaming ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              } transition-colors`}
            >
              {isStreaming ? 'Stop Stream' : 'Start Stream'}
            </button>
          </div>
        </header>

        {/* Mission Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {missions.map((mission) => (
            <div
              key={mission.id}
              onClick={() => setSelectedMission(mission)}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 
                         hover:border-white/40 cursor-pointer transition-all duration-300 hover:bg-white/15"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{mission.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(mission.status)}`}>
                  {mission.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Launch:</span>
                  <span className="text-white">{formatDate(mission.launchDate)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-white">{mission.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Location:</span>
                  <span className="text-white">{mission.location}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-400">Active Experiments:</div>
                {mission.experiments.slice(0, 2).map((exp) => (
                  <div key={exp.id} className="bg-black/30 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">{exp.name}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(exp.status)}`}>
                        {exp.status}
                      </span>
                    </div>
                    {exp.status === 'running' && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>{exp.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div 
                            className="bg-green-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${exp.progress}%` }}
                          />
                        </div>
                        {mission.dataStreaming && realTimeData[`${mission.id}_${exp.id}_temperature`] && (
                          <div className="text-xs text-green-400">
                            Live: {realTimeData[`${mission.id}_${exp.id}_temperature`]?.toFixed(1)}°C
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {mission.experiments.length > 2 && (
                  <div className="text-xs text-gray-400 text-center">
                    +{mission.experiments.length - 2} more experiments
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Mission View */}
        {selectedMission && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl border border-white/20 
                            max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gray-900/95 backdrop-blur-md border-b border-white/20 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedMission.name}</h2>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedMission.status)}`}>
                        {selectedMission.status.toUpperCase()}
                      </span>
                      {selectedMission.dataStreaming && (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-sm text-green-400">Live Data</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMission(null)}
                    className="text-gray-400 hover:text-white transition-colors p-2"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Mission Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Launch Date</h4>
                    <p className="text-gray-300">{formatDate(selectedMission.launchDate)}</p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Mission Duration</h4>
                    <p className="text-gray-300">{selectedMission.duration}</p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Location</h4>
                    <p className="text-gray-300">{selectedMission.location}</p>
                  </div>
                </div>

                {/* Mission Objectives */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Mission Objectives</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedMission.objectives.map((objective, index) => (
                      <div key={index} className="flex items-start space-x-3 bg-black/20 p-3 rounded-lg">
                        <span className="text-blue-400 mt-1">•</span>
                        <span className="text-gray-300">{objective}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Experiments */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">
                    Biology Experiments ({selectedMission.experiments.length})
                  </h4>
                  <div className="space-y-4">
                    {selectedMission.experiments.map((exp) => (
                      <div key={exp.id} className="bg-black/30 p-4 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium text-white">{exp.name}</h5>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(exp.status)}`}>
                              {exp.status}
                            </span>
                            <span className="text-xs text-gray-400">
                              Updated {formatLastUpdate(exp.lastUpdate)}
                            </span>
                          </div>
                        </div>

                        {exp.status === 'running' && (
                          <>
                            <div className="mb-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">Progress</span>
                                <span className="text-white">{exp.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
                                  style={{ width: `${exp.progress}%` }}
                                />
                              </div>
                            </div>

                            {selectedMission.dataStreaming && (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                                {realTimeData[`${selectedMission.id}_${exp.id}_temperature`] && (
                                  <div className="bg-blue-500/20 p-2 rounded text-center">
                                    <div className="text-xs text-blue-300">Temperature</div>
                                    <div className="text-sm font-semibold text-white">
                                      {realTimeData[`${selectedMission.id}_${exp.id}_temperature`]?.toFixed(1)}°C
                                    </div>
                                  </div>
                                )}
                                {realTimeData[`${selectedMission.id}_${exp.id}_humidity`] && (
                                  <div className="bg-green-500/20 p-2 rounded text-center">
                                    <div className="text-xs text-green-300">Humidity</div>
                                    <div className="text-sm font-semibold text-white">
                                      {realTimeData[`${selectedMission.id}_${exp.id}_humidity`]?.toFixed(1)}%
                                    </div>
                                  </div>
                                )}
                                {realTimeData[`${selectedMission.id}_${exp.id}_oxygen`] && (
                                  <div className="bg-purple-500/20 p-2 rounded text-center">
                                    <div className="text-xs text-purple-300">Oxygen</div>
                                    <div className="text-sm font-semibold text-white">
                                      {realTimeData[`${selectedMission.id}_${exp.id}_oxygen`]?.toFixed(1)}%
                                    </div>
                                  </div>
                                )}
                                {realTimeData[`${selectedMission.id}_${exp.id}_growth_rate`] && (
                                  <div className="bg-orange-500/20 p-2 rounded text-center">
                                    <div className="text-xs text-orange-300">Growth Rate</div>
                                    <div className="text-sm font-semibold text-white">
                                      {realTimeData[`${selectedMission.id}_${exp.id}_growth_rate`]?.toFixed(0)}%
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}

                        <div className="text-sm text-gray-400 mb-2">
                          Data Points Collected: <span className="text-white font-medium">{exp.dataPoints.toLocaleString()}</span>
                        </div>

                        {exp.criticalFindings && (
                          <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-lg">
                            <div className="text-xs text-yellow-300 font-medium mb-1">CRITICAL FINDINGS</div>
                            <div className="text-sm text-gray-300">{exp.criticalFindings}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionControl;