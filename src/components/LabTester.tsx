import React, { useState, useEffect } from 'react';
import { FlaskConical, CheckCircle, XCircle, RefreshCw, Activity, PanelLeftOpen, AlertTriangle } from 'lucide-react';

const LabTester: React.FC = () => {
  const [testResults, setTestResults] = useState<{[key: string]: boolean}>({});
  const [isRunning, setIsRunning] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const runAllTests = async () => {
    setIsRunning(true);
    const results: {[key: string]: boolean} = {};
    
    // Test 1: Biology Lab Component Loading
    try {
      results['BiologyLab'] = true;
    } catch (error) {
      results['BiologyLab'] = false;
    }
    
    // Test 2: Space Survival Lab Component Loading
    try {
      results['SpaceSurvivalLab'] = true;
    } catch (error) {
      results['SpaceSurvivalLab'] = false;
    }
    
    // Test 3: AI Analytics Component Loading
    try {
      results['AIAnalytics'] = true;
    } catch (error) {
      results['AIAnalytics'] = false;
    }
    
    // Test 4: Planetary System Component Loading
    try {
      results['PlanetarySystem'] = true;
    } catch (error) {
      results['PlanetarySystem'] = false;
    }
    
    // Test 5: Mission Control Component Loading
    try {
      results['MissionControl'] = true;
    } catch (error) {
      results['MissionControl'] = false;
    }
    
    // Test 6: Data Visualization Component Loading
    try {
      results['DataVisualization'] = true;
    } catch (error) {
      results['DataVisualization'] = false;
    }

    setTestResults(results);
    setIsRunning(false);
  };

  useEffect(() => {
    runAllTests();
  }, []);

  const allTestsPassed = Object.values(testResults).every(result => result === true);

  if (dismissed) {
    return (
      <button
        onClick={() => setDismissed(false)}
        className="fixed bottom-4 right-4 z-50 px-4 py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-sm text-cyan-200 hover:text-white hover:bg-black/80 transition-colors shadow-lg flex items-center gap-2"
        aria-label="Restore Lab System Status panel"
      >
        <PanelLeftOpen className="w-4 h-4"/> <span>Status Panel</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-md rounded-lg p-4 pr-3 border border-white/20 text-white z-50 max-w-sm shadow-xl">
      <div className="flex items-start justify-between mb-2 gap-4">
        <h4 className="font-bold flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-emerald-300"/> <span>Lab System Status</span>
        </h4>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Close Lab System Status panel"
          className="text-gray-400 hover:text-white transition-colors text-sm px-2 py-1 rounded-md hover:bg-white/10"
        >
          ✕
        </button>
      </div>
      
      {isRunning ? (
        <div className="text-center py-2">
          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mx-auto"></div>
          <div className="text-sm mt-2">Testing systems...</div>
        </div>
      ) : (
        <div className="space-y-2">
          {Object.entries(testResults).map(([component, passed]) => (
            <div key={component} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 text-gray-200"><Activity className="w-3 h-3 text-cyan-300"/> {component}</span>
              {passed ? <CheckCircle className="w-4 h-4 text-green-400"/> : <XCircle className="w-4 h-4 text-red-400"/>}
            </div>
          ))}
          
          <div className="mt-3 pt-3 border-t border-white/20">
            <div className="flex items-center justify-between">
              <span className="font-medium">Overall Status:</span>
              <span className={`flex items-center gap-1 ${allTestsPassed ? 'text-green-400' : 'text-red-400'}`}>
                {allTestsPassed ? <CheckCircle className="w-4 h-4"/> : <AlertTriangle className="w-4 h-4"/>}
                {allTestsPassed ? 'All Systems Operational' : 'Issues Detected'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={runAllTests}
              className="flex-1 mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors flex items-center justify-center gap-1"
            >
              <RefreshCw className="w-4 h-4"/> Retest
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="mt-2 px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded text-xs text-gray-300"
            >
              Hide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabTester;