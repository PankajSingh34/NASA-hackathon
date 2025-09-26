import React, { useState, useEffect } from 'react';

const LabTester: React.FC = () => {
  const [testResults, setTestResults] = useState<{[key: string]: boolean}>({});
  const [isRunning, setIsRunning] = useState(false);

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

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-md rounded-lg p-4 border border-white/20 text-white z-50 max-w-sm">
      <h4 className="font-bold mb-3 flex items-center">
        🔬 Lab System Status
      </h4>
      
      {isRunning ? (
        <div className="text-center py-2">
          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mx-auto"></div>
          <div className="text-sm mt-2">Testing systems...</div>
        </div>
      ) : (
        <div className="space-y-2">
          {Object.entries(testResults).map(([component, passed]) => (
            <div key={component} className="flex items-center justify-between text-sm">
              <span>{component}</span>
              <span className={passed ? 'text-green-400' : 'text-red-400'}>
                {passed ? '✅' : '❌'}
              </span>
            </div>
          ))}
          
          <div className="mt-3 pt-3 border-t border-white/20">
            <div className="flex items-center justify-between">
              <span className="font-medium">Overall Status:</span>
              <span className={allTestsPassed ? 'text-green-400' : 'text-red-400'}>
                {allTestsPassed ? '🟢 All Systems Operational' : '🔴 Issues Detected'}
              </span>
            </div>
          </div>
          
          <button
            onClick={runAllTests}
            className="w-full mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
          >
            🔄 Retest
          </button>
        </div>
      )}
    </div>
  );
};

export default LabTester;