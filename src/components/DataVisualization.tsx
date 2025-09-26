import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

interface DataPoint {
  timestamp: number;
  value: number;
  category: string;
}

interface Dataset {
  id: string;
  name: string;
  color: string;
  data: DataPoint[];
  unit: string;
  isLive: boolean;
}

const DataVisualization: React.FC = () => {
  const [selectedDataset, setSelectedDataset] = useState<string>('growth-rate');
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [isRealTime, setIsRealTime] = useState(true);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const [datasets, setDatasets] = useState<Dataset[]>([]);

  // Initialize datasets
  useEffect(() => {
    const initialDatasets: Dataset[] = [
      {
        id: 'growth-rate',
        name: 'Plant Growth Rate',
        color: '#4CAF50',
        data: generateTimeSeriesData(100, 0, 100),
        unit: '%/day',
        isLive: true
      },
      {
        id: 'oxygen-levels',
        name: 'Oxygen Production',
        color: '#2196F3',
        data: generateTimeSeriesData(100, 18, 23),
        unit: '%',
        isLive: true
      },
      {
        id: 'co2-absorption',
        name: 'CO₂ Absorption Rate',
        color: '#FF9800',
        data: generateTimeSeriesData(100, 0.2, 0.8),
        unit: 'mg/L/hr',
        isLive: true
      },
      {
        id: 'temperature',
        name: 'Temperature',
        color: '#E91E63',
        data: generateTimeSeriesData(100, 20, 25),
        unit: '°C',
        isLive: true
      },
      {
        id: 'humidity',
        name: 'Relative Humidity',
        color: '#9C27B0',
        data: generateTimeSeriesData(100, 50, 80),
        unit: '%',
        isLive: true
      },
      {
        id: 'radiation',
        name: 'Radiation Exposure',
        color: '#F44336',
        data: generateTimeSeriesData(100, 0.1, 2.5),
        unit: 'mSv/day',
        isLive: true
      }
    ];
    setDatasets(initialDatasets);
  }, []);

  // Generate realistic time series data
  function generateTimeSeriesData(points: number, min: number, max: number): DataPoint[] {
    const data: DataPoint[] = [];
    const now = Date.now();
    const interval = 3600000; // 1 hour in milliseconds
    
    let previousValue = (min + max) / 2;
    
    for (let i = 0; i < points; i++) {
      const timestamp = now - (points - i) * interval;
      // Add some realistic variation with trend
      const change = (Math.random() - 0.5) * (max - min) * 0.1;
      previousValue = Math.max(min, Math.min(max, previousValue + change));
      
      data.push({
        timestamp,
        value: previousValue,
        category: 'measurement'
      });
    }
    
    return data;
  }

  // Real-time data updates
  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      setDatasets(prev => prev.map(dataset => {
        if (!dataset.isLive) return dataset;

        const newData = [...dataset.data];
        const lastPoint = newData[newData.length - 1];
        const range = dataset.id === 'growth-rate' ? 100 :
                     dataset.id === 'oxygen-levels' ? 5 :
                     dataset.id === 'co2-absorption' ? 0.6 :
                     dataset.id === 'temperature' ? 5 :
                     dataset.id === 'humidity' ? 30 :
                     dataset.id === 'radiation' ? 2.4 : 10;

        const change = (Math.random() - 0.5) * range * 0.05;
        const newValue = Math.max(0, lastPoint.value + change);

        // Add new point
        newData.push({
          timestamp: Date.now(),
          value: newValue,
          category: 'measurement'
        });

        // Keep only last 200 points
        if (newData.length > 200) {
          newData.shift();
        }

        return { ...dataset, data: newData };
      }));
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [isRealTime]);

  // 3D Visualization setup
  useEffect(() => {
    if (!chartRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, 800 / 400, 0.1, 1000);
    camera.position.set(0, 10, 20);

    const renderer = new THREE.WebGLRenderer({ canvas: chartRef.current, antialias: true });
    renderer.setSize(800, 400);
    rendererRef.current = renderer;

    // Create 3D data visualization
    const selectedData = datasets.find(d => d.id === selectedDataset);
    if (selectedData) {
      createDataVisualization(scene, selectedData);
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate the visualization slowly
      scene.rotation.y += 0.005;
      
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
    };
  }, [selectedDataset, datasets]);

  const createDataVisualization = (scene: THREE.Scene, dataset: Dataset) => {
    // Clear existing objects
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    // Create 3D chart
    const points: THREE.Vector3[] = [];
    const maxValue = Math.max(...dataset.data.map(d => d.value));
    const minValue = Math.min(...dataset.data.map(d => d.value));
    const range = maxValue - minValue;

    dataset.data.forEach((point, index) => {
      const x = (index - dataset.data.length / 2) * 0.2;
      const y = ((point.value - minValue) / range) * 10 - 5;
      const z = 0;
      
      points.push(new THREE.Vector3(x, y, z));

      // Create data point spheres
      const geometry = new THREE.SphereGeometry(0.1, 8, 8);
      const material = new THREE.MeshPhongMaterial({ color: dataset.color });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(x, y, z);
      scene.add(sphere);
    });

    // Create connecting line
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: dataset.color, linewidth: 3 });
    const line = new THREE.Line(geometry, material);
    scene.add(line);

    // Create grid
    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x444444);
    gridHelper.position.y = -6;
    scene.add(gridHelper);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatistics = (data: DataPoint[]) => {
    if (data.length === 0) return { min: 0, max: 0, avg: 0, current: 0 };
    
    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const current = values[values.length - 1];
    
    return { min, max, avg, current };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            📊 Advanced Data Visualization
          </h1>
          <p className="text-xl text-gray-300">
            Real-time 3D visualization of space biology experiment data
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Data Selection Panel */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-bold mb-4">Data Sources</h3>
            
            <div className="space-y-3 mb-6">
              {datasets.map(dataset => {
                const stats = getStatistics(dataset.data);
                return (
                  <button
                    key={dataset.id}
                    onClick={() => setSelectedDataset(dataset.id)}
                    className={`w-full p-3 rounded-lg border transition-all ${
                      selectedDataset === dataset.id
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: dataset.color }}
                      />
                      <span className="font-medium">{dataset.name}</span>
                      {dataset.isLive && (
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      )}
                    </div>
                    <div className="text-xs text-gray-400 text-left">
                      Current: {stats.current.toFixed(2)} {dataset.unit}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Time Range</label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="w-full p-2 bg-black/30 border border-white/20 rounded-lg text-white"
                >
                  <option value="1h">Last Hour</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Real-time Updates</span>
                <button
                  onClick={() => setIsRealTime(!isRealTime)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    isRealTime ? 'bg-green-600' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    isRealTime ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* 3D Visualization */}
          <div className="lg:col-span-3">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">3D Data Visualization</h3>
                {isRealTime && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm text-green-400">Live</span>
                  </div>
                )}
              </div>
              
              <canvas ref={chartRef} className="w-full rounded-lg bg-black/20" />
              
              {/* Statistics Panel */}
              {selectedDataset && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(() => {
                    const dataset = datasets.find(d => d.id === selectedDataset);
                    if (!dataset) return null;
                    const stats = getStatistics(dataset.data);
                    
                    return (
                      <>
                        <div className="bg-black/30 p-3 rounded-lg text-center">
                          <div className="text-xs text-gray-400 mb-1">Current</div>
                          <div className="text-lg font-bold" style={{ color: dataset.color }}>
                            {stats.current.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-400">{dataset.unit}</div>
                        </div>
                        
                        <div className="bg-black/30 p-3 rounded-lg text-center">
                          <div className="text-xs text-gray-400 mb-1">Average</div>
                          <div className="text-lg font-bold text-blue-400">
                            {stats.avg.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-400">{dataset.unit}</div>
                        </div>
                        
                        <div className="bg-black/30 p-3 rounded-lg text-center">
                          <div className="text-xs text-gray-400 mb-1">Maximum</div>
                          <div className="text-lg font-bold text-green-400">
                            {stats.max.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-400">{dataset.unit}</div>
                        </div>
                        
                        <div className="bg-black/30 p-3 rounded-lg text-center">
                          <div className="text-xs text-gray-400 mb-1">Minimum</div>
                          <div className="text-lg font-bold text-red-400">
                            {stats.min.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-400">{dataset.unit}</div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Data Table */}
            <div className="mt-6 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h4 className="text-lg font-bold mb-4">Recent Data Points</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-2 text-gray-400">Timestamp</th>
                      <th className="text-left py-2 text-gray-400">Value</th>
                      <th className="text-left py-2 text-gray-400">Unit</th>
                      <th className="text-left py-2 text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDataset && datasets.find(d => d.id === selectedDataset)?.data.slice(-10).reverse().map((point, index) => {
                      const dataset = datasets.find(d => d.id === selectedDataset)!;
                      return (
                        <tr key={index} className="border-b border-white/10">
                          <td className="py-2 text-gray-300">{formatTimestamp(point.timestamp)}</td>
                          <td className="py-2 font-medium" style={{ color: dataset.color }}>
                            {point.value.toFixed(3)}
                          </td>
                          <td className="py-2 text-gray-400">{dataset.unit}</td>
                          <td className="py-2">
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                              Normal
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;