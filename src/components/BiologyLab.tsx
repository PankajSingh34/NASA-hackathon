import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

interface Organism {
  id: string;
  name: string;
  type: 'plant' | 'microbe' | 'fungi' | 'algae';
  baseGrowthRate: number;
  temperatureRange: [number, number];
  pressureRange: [number, number];
  radiationTolerance: number;
  oxygenRequirement: number;
  color: string;
  description: string;
}

interface PlanetConditions {
  name: string;
  temperature: number; // Celsius
  pressure: number; // atm
  radiation: number; // 0-1 scale
  oxygen: number; // 0-1 scale
  gravity: number; // Earth = 1
  atmosphere: string;
  color: string;
}

interface ExperimentData {
  organism: Organism;
  planet: PlanetConditions;
  growthProgress: number; // 0-1
  survivalRate: number; // 0-1
  adaptationStage: string;
  timeElapsed: number; // days
  isActive: boolean;
  stressIndex: number; // 0-1 computed from environmental mismatches
  viabilityScore: number; // composite viability predictor
  mutationCount: number;
  generation: number;
  history: Array<{ time: number; growth: number; survival: number; stress: number; viability: number }>;
  anomaly?: boolean;
}

const BiologyLab: React.FC = () => {
  const [selectedOrganism, setSelectedOrganism] = useState<Organism | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetConditions | null>(null);
  const [experiments, setExperiments] = useState<ExperimentData[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [timeSpeed, setTimeSpeed] = useState(1);
  const [advancedMode, setAdvancedMode] = useState(true);
  const [autoEvolve, setAutoEvolve] = useState(true);
  const [globalEnvAdjust, setGlobalEnvAdjust] = useState({ temp: 0, radiation: 0, pressure: 1, oxygen: 1 });
  const [lastEvolutionTick, setLastEvolutionTick] = useState(0);
  const labRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const controlsRef = useRef<OrbitControls>();
  const composerRef = useRef<EffectComposer>();
  const envLightRef = useRef<THREE.PointLight>();

  const organisms: Organism[] = [
    {
      id: 'extremophile-1',
      name: 'Tardigrade',
      type: 'microbe',
      baseGrowthRate: 0.8,
      temperatureRange: [-272, 150],
      pressureRange: [0, 1200],
      radiationTolerance: 0.95,
      oxygenRequirement: 0.1,
      color: '#4CAF50',
      description: 'Ultra-resistant water bear, can survive extreme conditions'
    },
    {
      id: 'plant-1',
      name: 'Martian Wheat',
      type: 'plant',
      baseGrowthRate: 0.6,
      temperatureRange: [-40, 40],
      pressureRange: [0.001, 2],
      radiationTolerance: 0.3,
      oxygenRequirement: 0.4,
      color: '#8BC34A',
      description: 'Genetically modified wheat for Mars cultivation'
    },
    {
      id: 'algae-1',
      name: 'Chlorella Vulgaris',
      type: 'algae',
      baseGrowthRate: 0.9,
      temperatureRange: [5, 45],
      pressureRange: [0.1, 5],
      radiationTolerance: 0.6,
      oxygenRequirement: 0.2,
      color: '#2E7D32',
      description: 'Fast-growing algae for oxygen production'
    },
    {
      id: 'fungi-1',
      name: 'Aspergillus Niger',
      type: 'fungi',
      baseGrowthRate: 0.7,
      temperatureRange: [6, 47],
      pressureRange: [0.1, 3],
      radiationTolerance: 0.8,
      oxygenRequirement: 0.3,
      color: '#795548',
      description: 'Radiation-resistant fungi for decomposition'
    },
    {
      id: 'microbe-2',
      name: 'Deinococcus Radiodurans',
      type: 'microbe',
      baseGrowthRate: 0.5,
      temperatureRange: [-10, 70],
      pressureRange: [0.01, 10],
      radiationTolerance: 0.99,
      oxygenRequirement: 0.1,
      color: '#E91E63',
      description: 'Extremely radiation-resistant bacterium'
    }
  ];

  const planets: PlanetConditions[] = [
    {
      name: 'Mars',
      temperature: -63,
      pressure: 0.006,
      radiation: 0.85,
      oxygen: 0.001,
      gravity: 0.38,
      atmosphere: '95% CO2, 3% N2, 1.6% Ar',
      color: '#CD5C5C'
    },
    {
      name: 'Europa',
      temperature: -160,
      pressure: 0.0000001,
      radiation: 0.9,
      oxygen: 0.0,
      gravity: 0.134,
      atmosphere: 'Oxygen (thin)',
      color: '#87CEEB'
    },
    {
      name: 'Titan',
      temperature: -179,
      pressure: 1.45,
      radiation: 0.1,
      oxygen: 0.0,
      gravity: 0.14,
      atmosphere: '98% N2, 2% CH4',
      color: '#DEB887'
    },
    {
      name: 'Venus',
      temperature: 464,
      pressure: 92,
      radiation: 0.2,
      oxygen: 0.0,
      gravity: 0.9,
      atmosphere: '96% CO2, 3.5% N2',
      color: '#FFC649'
    },
    {
      name: 'ISS Lab',
      temperature: 22,
      pressure: 1,
      radiation: 0.4,
      oxygen: 0.21,
      gravity: 0.0,
      atmosphere: '78% N2, 21% O2',
      color: '#4FC3F7'
    }
  ];

  // Calculate survival, growth and advanced metrics based on planetary + global adjustments
  const calculateGrowthFactors = (organism: Organism, planetInput: PlanetConditions) => {
    // Apply global environment adjustments (simulate habitat engineering)
    const planet: PlanetConditions = {
      ...planetInput,
      temperature: planetInput.temperature + globalEnvAdjust.temp,
      radiation: Math.max(0, Math.min(1, planetInput.radiation + globalEnvAdjust.radiation)),
      pressure: planetInput.pressure * globalEnvAdjust.pressure,
      oxygen: planetInput.oxygen * globalEnvAdjust.oxygen,
    };

    const optimalTemp = (organism.temperatureRange[0] + organism.temperatureRange[1]) / 2;
    const tempSpan = (organism.temperatureRange[1] - organism.temperatureRange[0]) || 1;
    const tempDelta = Math.abs(planet.temperature - optimalTemp);
    const tempFactor = Math.max(0, 1 - (tempDelta / tempSpan));

    const midPressure = (organism.pressureRange[0] + organism.pressureRange[1]) / 2;
    const pressureFactor = planet.pressure >= organism.pressureRange[0] && planet.pressure <= organism.pressureRange[1]
      ? 1
      : Math.max(0, 1 - Math.abs(Math.log10(planet.pressure + 1e-6) - Math.log10(midPressure + 1e-6)) / 3);

    const radiationFactor = planet.radiation <= organism.radiationTolerance
      ? 1 - (planet.radiation * 0.2)
      : Math.max(0, organism.radiationTolerance - (planet.radiation - organism.radiationTolerance) * 1.2);

    const oxygenFactor = planet.oxygen >= organism.oxygenRequirement
      ? 1
      : Math.max(0, planet.oxygen / (organism.oxygenRequirement + 1e-6));

    const survivalBase = (tempFactor * pressureFactor * radiationFactor * oxygenFactor) / 4;
    // Stress increases when factors diverge; weight temp & radiation heavier
    const stressIndex = 1 - Math.min(1, (tempFactor * 0.35 + pressureFactor * 0.2 + radiationFactor * 0.3 + oxygenFactor * 0.15));
    // Viability penalized by stress and boosted by survival
    const viabilityScore = Math.max(0, Math.min(1, survivalBase * (1 - stressIndex * 0.6)));
    // Growth influenced by viability and base rate
    const growthRate = organism.baseGrowthRate * (0.4 + viabilityScore * 0.6) * (1 - stressIndex * 0.5);

    return {
      survival: Math.max(0, Math.min(1, survivalBase)),
      growthRate: Math.max(0, Math.min(1, growthRate)),
      stressIndex: Math.max(0, Math.min(1, stressIndex)),
      viabilityScore,
      adjustedPlanet: planet,
      factors: { tempFactor, pressureFactor, radiationFactor, oxygenFactor }
    };
  };

  const attemptMutation = (exp: ExperimentData): ExperimentData => {
    // Mutations more likely under stress but not near-death
    const mutationChance = exp.stressIndex * 0.4 + (1 - exp.survivalRate) * 0.2;
    if (Math.random() < mutationChance) {
      const mutated = { ...exp };
      mutated.organism = { ...mutated.organism, baseGrowthRate: Math.min(1, mutated.organism.baseGrowthRate * (1 + (Math.random() - 0.5) * 0.1)) };
      mutated.mutationCount += 1;
      if (mutated.mutationCount % 3 === 0) mutated.generation += 1;
      return mutated;
    }
    return exp;
  };

  const computeAdaptationStage = (progress: number) => {
    if (progress > 0.85) return 'Mature';
    if (progress > 0.65) return 'Flowering';
    if (progress > 0.45) return 'Growth Phase';
    if (progress > 0.25) return 'Sprouting';
    if (progress > 0.1) return 'Germinating';
    return 'Initializing';
  };

  // Start a new experiment
  const startExperiment = () => {
    if (!selectedOrganism || !selectedPlanet) return;

    const { survival, stressIndex, viabilityScore } = calculateGrowthFactors(selectedOrganism, selectedPlanet);
    
    const newExperiment: ExperimentData = {
      organism: selectedOrganism,
      planet: selectedPlanet,
      growthProgress: 0,
      survivalRate: survival,
      adaptationStage: survival > 0.7 ? 'Thriving' : survival > 0.3 ? 'Adapting' : 'Struggling',
      timeElapsed: 0,
      isActive: true,
      stressIndex,
      viabilityScore,
      mutationCount: 0,
      generation: 0,
      history: []
    };

    setExperiments(prev => [...prev, newExperiment]);
    setIsRunning(true);
  };

  // Update experiments
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setExperiments(prev => prev.map(exp => {
        if (!exp.isActive || exp.growthProgress >= 1) return exp;
        const { growthRate, survival, stressIndex, viabilityScore } = calculateGrowthFactors(exp.organism, exp.planet);
        const progressIncrement = (growthRate * timeSpeed * 0.01) * (1 + (Math.random() - 0.5) * 0.2);
        const newProgress = Math.min(1, exp.growthProgress + progressIncrement);
        const newTime = exp.timeElapsed + timeSpeed;
        const adaptationStage = computeAdaptationStage(newProgress);
        let updated: ExperimentData = {
          ...exp,
            growthProgress: newProgress,
            timeElapsed: newTime,
            adaptationStage,
            survivalRate: survival,
            stressIndex,
            viabilityScore,
            anomaly: stressIndex > 0.85 && viabilityScore < 0.3 ? true : false,
            history: [...exp.history.slice(-299), { time: newTime, growth: newProgress, survival, stress: stressIndex, viability: viabilityScore }]
        };
        if (advancedMode && autoEvolve && newTime - lastEvolutionTick > 50) {
          updated = attemptMutation(updated);
        }
        return updated;
      }));
      if (autoEvolve) setLastEvolutionTick(t => t + timeSpeed);
    }, 130);

    return () => clearInterval(interval);
  }, [isRunning, timeSpeed]);

  // 3D Visualization setup (responsive + orbit controls + plant models)
  useEffect(() => {
    if (!labRef.current) return;

    const container = labRef.current;
    const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x060606);
  scene.fog = new THREE.FogExp2(0x06090d, 0.035);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.set(6, 6, 10);
    cameraRef.current = camera;

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controlsRef.current = controls;

    // Lights
  const hemi = new THREE.HemisphereLight(0x6aa8ff, 0x1a1f22, 0.55);
    scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 0.85);
    key.position.set(8, 12, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);
  const fill = new THREE.PointLight(0x3399ff, 0.35, 25, 2);
    fill.position.set(-6, 4, -4);
    scene.add(fill);
  const envLight = new THREE.PointLight(0xff8844, 0.0, 18, 2.5);
  envLight.position.set(0, 3.5, 0);
  scene.add(envLight);
  envLightRef.current = envLight;

    // Floor / lab pad
    const floorGeo = new THREE.CircleGeometry(18, 64);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x232629, roughness: 0.92, metalness: 0.04 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Subtle grid etched into floor
    const grid = new THREE.GridHelper(18, 36, 0x224455, 0x112233);
    (grid.material as THREE.Material).opacity = 0.15;
    (grid.material as THREE.Material).transparent = true;
    scene.add(grid);

    // Habitat cylindrical chamber (glass-like)
    const chamberGeo = new THREE.CylinderGeometry(9, 9, 6, 64, 1, true);
    const chamberMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a1418,
      transparent: true,
      opacity: 0.18,
      roughness: 0.15,
      metalness: 0.4,
      transmission: 0.85,
      thickness: 0.6,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1
    });
    const chamber = new THREE.Mesh(chamberGeo, chamberMat);
    chamber.position.y = 3;
    scene.add(chamber);
    const chamberRimGeo = new THREE.TorusGeometry(9, 0.18, 16, 100);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x2e4d55, metalness: 0.8, roughness: 0.3 });
    const rimTop = new THREE.Mesh(chamberRimGeo, rimMat); rimTop.position.y = 6; rimTop.rotation.x = Math.PI / 2; scene.add(rimTop);
    const rimBottom = rimTop.clone(); rimBottom.position.y = 0; scene.add(rimBottom);

    // Subtle ambient particles (atmospheric motes)
    const particleGeo = new THREE.BufferGeometry();
  const particleCount = 550;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i*3] = (Math.random() - 0.5) * 15;
      positions[i*3 + 1] = Math.random() * 6 + 0.2;
      positions[i*3 + 2] = (Math.random() - 0.5) * 15;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({ color: 0x55ffcc, size: 0.035, transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Resize handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const width = container.clientWidth || 800;
      const height = Math.min(480, Math.max(360, width * 0.5));
      rendererRef.current.setSize(width, height);
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      if (composerRef.current) composerRef.current.setSize(width, height);
    };
    handleResize();
    window.addEventListener('resize', handleResize);


    // Postprocessing
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(container.clientWidth || 800, 420), 0.85, 0.8, 0.3);
    bloom.threshold = 0.2;
    bloom.strength = 0.6;
    bloom.radius = 0.5;
    composer.addPass(bloom);
    composerRef.current = composer;

    const animate = () => {
      requestAnimationFrame(animate);
      const t = performance.now() * 0.001;
      controls.update();
      particles.rotation.y = t * 0.02;
      // Update experiments
      scene.children.forEach(child => {
        if (child.userData.isExperiment) {
          const exp = experiments[child.userData.experimentIndex];
          if (!exp) return;
          const stem = child.children.find(c => c.userData.part === 'stem');
          const cap = child.children.find(c => c.userData.part === 'cap');
          const leaves = child.children.filter(c => c.userData.part === 'leaf');
          const branches = child.children.filter(c => c.userData.part === 'branch');
          const growth = exp.growthProgress;
          const displayed = child.userData.displayedGrowth ?? 0;
          const newDisplayed = displayed + (growth - displayed) * 0.08; // smooth interpolation
          child.userData.displayedGrowth = newDisplayed;
          const height = 0.4 + newDisplayed * 2.4;
          if (stem) stem.scale.set(1, height, 1);
          if (cap) cap.position.y = height + 0.08;
          leaves.forEach((leaf, idx) => {
            leaf.scale.setScalar(0.28 + newDisplayed * 0.95);
            leaf.rotation.z = Math.sin(t * 1.5 + idx) * 0.2;
          });
          // Branch emergence at growth thresholds
          branches.forEach((br, idx) => {
            const threshold = 0.25 + idx * 0.18;
            const active = newDisplayed > threshold;
            const local = Math.max(0, Math.min(1, (newDisplayed - threshold) * 3));
            br.visible = active;
            if (active) br.scale.setScalar(0.2 + local * 0.9);
          });
          // subtle pulsation based on survival
          child.position.y = Math.sin(t * 2 + child.userData.experimentIndex) * 0.05 * exp.survivalRate;
          // color shift by stress
          if (cap instanceof THREE.Mesh && cap.material instanceof THREE.MeshStandardMaterial) {
            const stress = exp.stressIndex;
            const base = new THREE.Color(exp.organism.color);
            const stressTint = new THREE.Color(0xff2222);
            base.lerp(stressTint, stress * 0.4);
            cap.material.color = base;
            cap.material.emissiveIntensity = 0.2 + (1 - exp.viabilityScore) * 0.4;
          }
        }
      });
      composer.render();
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (renderer && renderer.domElement && container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [experiments]);

  // Dynamic environment lighting reacting to global environment adjustments
  useEffect(() => {
    if (!envLightRef.current) return;
    const heat = Math.max(-1, Math.min(1, globalEnvAdjust.temp / 50));
    const rad = Math.max(0, Math.min(1, (globalEnvAdjust.radiation + 0.5))); // -0.5..0.5 -> 0..1
    const color = new THREE.Color().setHSL(0.05 + 0.08 * rad + 0.08 * heat, 0.55 + 0.2 * rad, 0.45 + 0.15 * heat);
    envLightRef.current.color = color;
    envLightRef.current.intensity = 0.2 + Math.abs(heat) * 0.6 + rad * 0.4;
  }, [globalEnvAdjust]);

  // Rebuild experiment meshes when experiments change (structure-level changes)
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    // Remove old experiment groups
    const toRemove = scene.children.filter(c => c.userData.isExperiment);
    toRemove.forEach(obj => scene.remove(obj));
    experiments.forEach((exp, i) => {
      const plant = ((): THREE.Group => {
        // reuse builder inside previous effect scope? Duplicate here for isolation.
        const group = new THREE.Group();
        group.userData.isExperiment = true;
        group.userData.experimentIndex = i;
        const stemGeo = new THREE.CylinderGeometry(0.08, 0.12, 1, 10, 1, true);
        const stemMat = new THREE.MeshStandardMaterial({ color: exp.organism.color, roughness: 0.7, metalness: 0.05 });
        const stem = new THREE.Mesh(stemGeo, stemMat); stem.castShadow = true; stem.position.y = 0.5; stem.userData.part = 'stem';
        group.add(stem);
        const capGeo = new THREE.SphereGeometry(0.25, 20, 16);
        const capMat = new THREE.MeshStandardMaterial({ color: exp.organism.color, emissive: 0x001100, emissiveIntensity: 0.3 });
        const cap = new THREE.Mesh(capGeo, capMat); cap.position.y = 1.05; cap.castShadow = true; cap.userData.part = 'cap';
        group.add(cap);
        const leafGeo = new THREE.PlaneGeometry(0.6, 0.25, 4, 1);
        const leafMat = new THREE.MeshBasicMaterial({ color: exp.organism.color, side: THREE.DoubleSide, transparent: true, opacity: 0.85 });
        const leafL = new THREE.Mesh(leafGeo, leafMat); leafL.position.set(0.18,0.6,0); leafL.rotation.y = Math.PI/2; leafL.userData.part='leaf'; group.add(leafL);
        const leafR = leafL.clone(); leafR.position.x = -0.18; leafR.rotation.y = -Math.PI/2; group.add(leafR);
        // Procedural side branches (3) that emerge with growth
        for (let b = 0; b < 3; b++) {
          const brGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.8, 8, 1, true);
          const brMat = new THREE.MeshStandardMaterial({ color: exp.organism.color, roughness: 0.6, metalness: 0.08 });
          const br = new THREE.Mesh(brGeo, brMat);
          br.position.y = 0.8 + b * 0.5;
          br.rotation.z = (b % 2 === 0 ? 1 : -1) * (0.6 + b * 0.15);
          br.castShadow = true;
            br.userData.part = 'branch';
          br.visible = false;
          group.add(br);
        }
        return group;
      })();
      plant.position.set((i - experiments.length/2) * 2.5, 0, 0);
      scene.add(plant);
    });
  }, [experiments]);

  // Auto-demo: if no experiments after 2s, spawn a demo
  useEffect(() => {
    if (experiments.length === 0) {
      const timer = setTimeout(() => {
        if (experiments.length === 0) {
          setSelectedOrganism(organisms[1]); // Martian Wheat
          setSelectedPlanet(planets[0]); // Mars
          setTimeout(() => startExperiment(), 100);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [experiments]);

  // Add experiment visualizations to 3D scene
  useEffect(() => {
    if (!sceneRef.current) return;

    // Remove existing experiment objects
    const objectsToRemove = sceneRef.current.children.filter(child => child.userData.isExperiment);
    objectsToRemove.forEach(obj => sceneRef.current!.remove(obj));

    // Add new experiment objects
    experiments.forEach((exp, index) => {
      const geometry = new THREE.SphereGeometry(0.5, 16, 16);
      const material = new THREE.MeshPhongMaterial({ color: exp.organism.color });
      const mesh = new THREE.Mesh(geometry, material);
      
      mesh.position.set((index - experiments.length / 2) * 3, 1, 0);
      mesh.userData = { isExperiment: true, experimentIndex: index };
      mesh.castShadow = true;
      
      sceneRef.current!.add(mesh);
    });
  }, [experiments]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            🧬 Astrobiology Lab Simulation
          </h1>
          <p className="text-xl text-gray-300">
            Real-time biological growth simulation across different planetary environments
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
            <label className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10 cursor-pointer">
              <input type="checkbox" checked={advancedMode} onChange={() => setAdvancedMode(v => !v)} /> Advanced Mode
            </label>
            <label className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10 cursor-pointer">
              <input type="checkbox" checked={autoEvolve} onChange={() => setAutoEvolve(v => !v)} /> Auto-Evolution
            </label>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Organism Selection */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              🦠 Select Organism
            </h3>
            <div className="space-y-3">
              {organisms.map(organism => (
                <button
                  key={organism.id}
                  onClick={() => setSelectedOrganism(organism)}
                  className={`w-full p-4 rounded-lg border transition-all ${
                    selectedOrganism?.id === organism.id
                      ? 'border-green-500 bg-green-500/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: organism.color }}
                    />
                    <div className="text-left">
                      <div className="font-semibold">{organism.name}</div>
                      <div className="text-sm text-gray-400">{organism.type}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {selectedOrganism && (
              <div className="mt-4 p-4 bg-black/30 rounded-lg">
                <h4 className="font-semibold mb-2">{selectedOrganism.name}</h4>
                <p className="text-sm text-gray-300 mb-3">{selectedOrganism.description}</p>
                <div className="text-xs space-y-1">
                  <div>Growth Rate: {(selectedOrganism.baseGrowthRate * 100).toFixed(0)}%</div>
                  <div>Temperature: {selectedOrganism.temperatureRange[0]}°C to {selectedOrganism.temperatureRange[1]}°C</div>
                  <div>Radiation Tolerance: {(selectedOrganism.radiationTolerance * 100).toFixed(0)}%</div>
                </div>
              </div>
            )}
          </div>

          {/* Planet Selection */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              🪐 Select Environment
            </h3>
            <div className="space-y-3">
              {planets.map(planet => (
                <button
                  key={planet.name}
                  onClick={() => setSelectedPlanet(planet)}
                  className={`w-full p-4 rounded-lg border transition-all ${
                    selectedPlanet?.name === planet.name
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: planet.color }}
                    />
                    <div className="text-left">
                      <div className="font-semibold">{planet.name}</div>
                      <div className="text-sm text-gray-400">{planet.temperature}°C</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {selectedPlanet && (
              <div className="mt-4 p-4 bg-black/30 rounded-lg">
                <h4 className="font-semibold mb-2">{selectedPlanet.name}</h4>
                <div className="text-xs space-y-1">
                  <div>Temperature: {selectedPlanet.temperature}°C</div>
                  <div>Pressure: {selectedPlanet.pressure} atm</div>
                  <div>Radiation: {(selectedPlanet.radiation * 100).toFixed(0)}%</div>
                  <div>Oxygen: {(selectedPlanet.oxygen * 100).toFixed(1)}%</div>
                  <div>Gravity: {selectedPlanet.gravity}g</div>
                </div>
              </div>
            )}
          </div>

          {/* Experiment Controls */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              ⚗️ Experiment Controls
            </h3>
            
            <button
              onClick={startExperiment}
              disabled={!selectedOrganism || !selectedPlanet}
              className="w-full mb-4 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 
                         disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
            >
              Start Experiment
            </button>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Time Speed</label>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={timeSpeed}
                  onChange={(e) => setTimeSpeed(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-gray-400">{timeSpeed}x speed</div>
              </div>

              <div className="mt-4 space-y-3">
                <h4 className="text-sm font-semibold text-blue-300">Habitat Engineering (Global Adjust)</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block mb-1">Δ Temp (°C)</label>
                    <input type="range" min={-50} max={50} step={1} value={globalEnvAdjust.temp} onChange={e => setGlobalEnvAdjust(a => ({ ...a, temp: Number(e.target.value) }))} />
                    <div className="text-gray-400">{globalEnvAdjust.temp >=0 ? '+' : ''}{globalEnvAdjust.temp}</div>
                  </div>
                  <div>
                    <label className="block mb-1">Radiation Offset</label>
                    <input type="range" min={-0.5} max={0.5} step={0.01} value={globalEnvAdjust.radiation} onChange={e => setGlobalEnvAdjust(a => ({ ...a, radiation: Number(e.target.value) }))} />
                    <div className="text-gray-400">{globalEnvAdjust.radiation.toFixed(2)}</div>
                  </div>
                  <div>
                    <label className="block mb-1">Pressure ×</label>
                    <input type="range" min={0.1} max={5} step={0.1} value={globalEnvAdjust.pressure} onChange={e => setGlobalEnvAdjust(a => ({ ...a, pressure: Number(e.target.value) }))} />
                    <div className="text-gray-400">{globalEnvAdjust.pressure.toFixed(2)}x</div>
                  </div>
                  <div>
                    <label className="block mb-1">Oxygen ×</label>
                    <input type="range" min={0.1} max={5} step={0.1} value={globalEnvAdjust.oxygen} onChange={e => setGlobalEnvAdjust(a => ({ ...a, oxygen: Number(e.target.value) }))} />
                    <div className="text-gray-400">{globalEnvAdjust.oxygen.toFixed(2)}x</div>
                  </div>
                </div>
                <button onClick={() => setGlobalEnvAdjust({ temp: 0, radiation: 0, pressure: 1, oxygen: 1 })} className="w-full mt-2 text-xs bg-gray-700 hover:bg-gray-600 rounded py-1">Reset Environment Adjustments</button>
              </div>

              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors ${
                  isRunning 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isRunning ? 'Pause All' : 'Resume All'}
              </button>

              <button
                onClick={() => {
                  // Run comprehensive test - test all organisms on all planets
                  setExperiments([]);
                  organisms.slice(0, 3).forEach((organism, index) => {
                    setTimeout(() => {
                      setSelectedOrganism(organism);
                      setSelectedPlanet(planets[index % planets.length]);
                      setTimeout(() => {
                        const { survival, stressIndex, viabilityScore } = calculateGrowthFactors(organism, planets[index % planets.length]);
                        const newExperiment: ExperimentData = {
                          organism: organism,
                          planet: planets[index % planets.length],
                          growthProgress: 0,
                          survivalRate: survival,
                          adaptationStage: survival > 0.7 ? 'Thriving' : survival > 0.3 ? 'Adapting' : 'Struggling',
                          timeElapsed: 0,
                          isActive: true,
                          stressIndex,
                          viabilityScore,
                          mutationCount: 0,
                          generation: 0,
                          history: []
                        };
                        setExperiments(prev => [...prev, newExperiment]);
                        setIsRunning(true);
                      }, 100);
                    }, index * 500);
                  });
                }}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors mb-2"
              >
                🧪 Run Full Lab Test
              </button>

              <button
                onClick={() => setExperiments([])}
                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* 3D Lab Visualization */}
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold mb-2">3D Lab Visualization</h3>
          <p className="text-xs text-gray-400 mb-3">Drag to orbit • Scroll to zoom • Auto-demo spawns if none started</p>
          <div ref={labRef} className="w-full" />
        </div>

        {/* Active Experiments */}
        {experiments.length > 0 && (
          <div className="mt-8 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold mb-4">Active Experiments ({experiments.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {experiments.map((exp, index) => (
                <div key={index} className="bg-black/30 p-4 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{exp.organism.name}</h4>
                    <span className="text-sm text-gray-400">{exp.planet.name}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Growth Progress</span>
                        <span>{(exp.growthProgress * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${exp.growthProgress * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Survival Rate</span>
                        <span>{(exp.survivalRate * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            exp.survivalRate > 0.7 ? 'bg-green-500' :
                            exp.survivalRate > 0.3 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${exp.survivalRate * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-sm space-y-1">
                      <div>Stage: <span className="text-blue-400">{exp.adaptationStage}</span>{exp.anomaly && <span className="ml-2 text-red-400 text-xs">ANOMALY</span>}</div>
                      <div>Time: <span className="text-gray-400">{exp.timeElapsed.toFixed(0)} days</span></div>
                      <div>Stress: <span className="text-yellow-400">{(exp.stressIndex * 100).toFixed(1)}%</span></div>
                      <div>Viability: <span className="text-green-300">{(exp.viabilityScore * 100).toFixed(1)}%</span></div>
                      <div>Generation: <span className="text-purple-300">{exp.generation}</span> | Mut: <span className="text-gray-300">{exp.mutationCount}</span></div>
                    </div>
                    {exp.history.length > 5 && (
                      <div className="mt-2 h-8 w-full bg-gray-800 rounded overflow-hidden relative">
                        {/* Sparkline */}
                        <svg className="absolute inset-0 w-full h-full">
                          {(() => {
                            const points = exp.history.slice(-50);
                            if (!points.length) return null;
                            const path = points.map((p,i) => `${(i/(points.length-1))*100},${(1- p.growth)*(100)}`).join(' ');
                            return <polyline points={path} stroke="#4ade80" strokeWidth={1} fill="none" />;
                          })()}
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-500">Growth Trend</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BiologyLab;