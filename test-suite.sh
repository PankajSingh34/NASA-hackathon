#!/bin/bash

# NASA Space Biology Lab Test Suite
echo "🚀 NASA Space Biology Lab - Comprehensive Test Suite"
echo "=================================================="
echo ""

# Test 1: Check if development server is running
echo "🔍 Test 1: Checking development server..."
if curl -s http://localhost:3004 > /dev/null; then
    echo "✅ Development server is running on port 3004"
else
    echo "❌ Development server is not accessible"
    exit 1
fi

echo ""

# Test 2: Check for component files
echo "🔍 Test 2: Checking component files..."
components=(
    "src/components/BiologyLab.tsx"
    "src/components/SpaceSurvivalLab.tsx" 
    "src/components/AIAnalytics.tsx"
    "src/components/PlanetarySystem.tsx"
    "src/components/MissionControl.tsx"
    "src/components/DataVisualization.tsx"
)

for component in "${components[@]}"; do
    if [ -f "/Users/pankajsingh/Desktop/NASA/nasa-space-biology-react/$component" ]; then
        echo "✅ $component exists"
    else
        echo "❌ $component missing"
    fi
done

echo ""

# Test 3: Check dependencies
echo "🔍 Test 3: Checking key dependencies..."
cd /Users/pankajsingh/Desktop/NASA/nasa-space-biology-react

if npm list three > /dev/null 2>&1; then
    echo "✅ Three.js installed"
else
    echo "❌ Three.js missing"
fi

if npm list crypto-js > /dev/null 2>&1; then
    echo "✅ crypto-js installed" 
else
    echo "❌ crypto-js missing"
fi

echo ""

# Test 4: Build test
echo "🔍 Test 4: Running build test..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Build successful"
else
    echo "⚠️ Build has warnings/errors (check console)"
fi

echo ""

echo "🎉 Test Suite Complete!"
echo ""
echo "📋 Manual Tests to Perform:"
echo "1. Navigate to Biology Lab and click 'Run Full Lab Test'"
echo "2. Navigate to Survival Lab and click 'Test All Scenarios'" 
echo "3. Navigate to AI Analytics and click 'Run Advanced Analysis'"
echo "4. Test navigation between all 7 components"
echo "5. Verify 3D visualizations load properly"
echo ""
echo "🌐 Application URL: http://localhost:3004"