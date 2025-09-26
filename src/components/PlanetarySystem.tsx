import React, { useRef, useEffect, useState } from 'react';
import { fetchPlanets } from '../services/solarSystemApi';
import * as THREE from 'three';
import { generateSoilSample, batchSoilPanel, SoilSample } from '../services/soilTestingEngine';
import { FlaskConical, Beaker, Layers } from 'lucide-react';

interface Planet {
  name: string;
  radius: number;
  distance: number;
  speed: number;
  color: number;
  textureUrl?: string;
  rings?: boolean;
  moons?: Array<{ radius: number; distance: number; speed: number }>;
}

const PlanetarySystem: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const planetsRef = useRef<Array<{ mesh: THREE.Mesh; orbit: THREE.Group; angle: number; speed: number }>>([]);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [soilSamples, setSoilSamples] = useState<SoilSample[] | null>(null);
  const [soilMode, setSoilMode] = useState<'plant_growth' | 'bio_reactor' | 'life_support' | 'construction'>('plant_growth');
  const [isLoading, setIsLoading] = useState(true);

  const [planets, setPlanets] = useState<Planet[]>([]);

  useEffect(() => {
    fetchPlanets()
      .then((data) => {
        console.log('API planet data:', data);
        if (!data || !Array.isArray(data) || data.length === 0) {
          console.error('No planet data returned from API:', data);
          // Fallback to hardcoded planets
          setPlanets([
            { name: 'Sun', radius: 2.5, distance: 0, speed: 0, color: 0xffaa00 },
            { name: 'Mercury', radius: 0.3, distance: 8, speed: 0.02, color: 0x8c7853 },
            { name: 'Venus', radius: 0.45, distance: 12, speed: 0.015, color: 0xffc649 },
            { name: 'Earth', radius: 0.5, distance: 16, speed: 0.01, color: 0x6b93d6, moons: [{ radius: 0.15, distance: 2, speed: 0.05 }] },
            { name: 'Mars', radius: 0.4, distance: 22, speed: 0.008, color: 0xcd5c5c },
            { name: 'Jupiter', radius: 1.2, distance: 30, speed: 0.005, color: 0xd8ca9d, moons: [ { radius: 0.1, distance: 3, speed: 0.03 }, { radius: 0.12, distance: 4, speed: 0.025 }, { radius: 0.08, distance: 5, speed: 0.02 } ] },
            { name: 'Saturn', radius: 1.0, distance: 40, speed: 0.003, color: 0xfad5a5, rings: true },
            { name: 'Uranus', radius: 0.7, distance: 50, speed: 0.002, color: 0x4fd0e7 },
            { name: 'Neptune', radius: 0.65, distance: 60, speed: 0.001, color: 0x4b70dd }
          ]);
          setIsLoading(false);
          return;
        }
        setPlanets(
          data.map((body: any) => ({
            name: body.englishName || body.name,
            radius: body.meanRadius ? body.meanRadius / 500 : 0.5,
            distance: body.semimajorAxis ? body.semimajorAxis / 10000 : 0,
            speed: 0.01,
            color: 0x6b93d6,
            moons: body.moons ? body.moons.map(() => ({ radius: 0.1, distance: 2, speed: 0.05 })) : undefined,
            rings: body.englishName === 'Saturn',
          }))
        );
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching planet data:', err);
        setPlanets([
          { name: 'Sun', radius: 2.5, distance: 0, speed: 0, color: 0xffaa00 },
          { name: 'Mercury', radius: 0.3, distance: 8, speed: 0.02, color: 0x8c7853 },
          { name: 'Venus', radius: 0.45, distance: 12, speed: 0.015, color: 0xffc649 },
          { name: 'Earth', radius: 0.5, distance: 16, speed: 0.01, color: 0x6b93d6, moons: [{ radius: 0.15, distance: 2, speed: 0.05 }] },
          { name: 'Mars', radius: 0.4, distance: 22, speed: 0.008, color: 0xcd5c5c },
          { name: 'Jupiter', radius: 1.2, distance: 30, speed: 0.005, color: 0xd8ca9d, moons: [ { radius: 0.1, distance: 3, speed: 0.03 }, { radius: 0.12, distance: 4, speed: 0.025 }, { radius: 0.08, distance: 5, speed: 0.02 } ] },
          { name: 'Saturn', radius: 1.0, distance: 40, speed: 0.003, color: 0xfad5a5, rings: true },
          { name: 'Uranus', radius: 0.7, distance: 50, speed: 0.002, color: 0x4fd0e7 },
          { name: 'Neptune', radius: 0.65, distance: 60, speed: 0.001, color: 0x4b70dd }
        ]);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!mountRef.current || planets.length === 0) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x02030b);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 20, 40);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add starfield background
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 15000;
    const positions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 2000;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1, transparent: true, opacity: 0.8 });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Create planets
    const planetObjects: Array<{ mesh: THREE.Mesh; orbit: THREE.Group; angle: number; speed: number }> = [];

    planets.forEach((planetData) => {
      const orbitGroup = new THREE.Group();
      scene.add(orbitGroup);

      if (planetData.distance > 0) {
        const ellipse = new THREE.BufferGeometry();
        const segments = 128;
        const points: THREE.Vector3[] = [];
        const a = planetData.distance;
        const e = 0.02 + Math.random() * 0.03;
        const b = a * Math.sqrt(1 - e * e);
        for (let i = 0; i <= segments; i++) {
          const t = (i / segments) * Math.PI * 2;
          const x = a * Math.cos(t) - a * e;
          const z = b * Math.sin(t);
          points.push(new THREE.Vector3(x, 0, z));
        }
        ellipse.setFromPoints(points);
        const lineMat = new THREE.LineBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.4 });
        const orbitLine = new THREE.LineLoop(ellipse, lineMat);
        scene.add(orbitLine);
      }

      const geometry = new THREE.SphereGeometry(planetData.radius, 48, 48);
      const material = new THREE.MeshStandardMaterial({ color: planetData.color, roughness: 0.6, metalness: 0.1 });
      const planetMesh = new THREE.Mesh(geometry, material);
      planetMesh.position.x = planetData.distance;
      planetMesh.userData = { name: planetData.name };

      if (planetData.name === 'Sun') {
        const glowGeometry = new THREE.SphereGeometry(planetData.radius * 1.2, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.3 });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        planetMesh.add(glow);
        const sunLight = new THREE.PointLight(0xfff2cc, 2.4, 180, 2);
        sunLight.position.copy(planetMesh.position);
        sunLight.castShadow = true;
        scene.add(sunLight);
        const coronaGeo = new THREE.BufferGeometry();
        const coronaPoints = new Float32Array(500 * 3);
        for (let i = 0; i < 500; i++) {
          const r = planetData.radius * (1.3 + Math.random() * 0.6);
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const x = r * Math.sin(phi) * Math.cos(theta);
          const y = r * Math.sin(phi) * Math.sin(theta);
          const z = r * Math.cos(phi);
          coronaPoints[i * 3] = x; coronaPoints[i * 3 + 1] = y; coronaPoints[i * 3 + 2] = z;
        }
        coronaGeo.setAttribute('position', new THREE.BufferAttribute(coronaPoints, 3));
        const coronaMat = new THREE.PointsMaterial({ color: 0xffcc55, size: 0.15, transparent: true, opacity: 0.6 });
        const corona = new THREE.Points(coronaGeo, coronaMat);
        planetMesh.add(corona);
      } else {
        planetMesh.castShadow = true;
        planetMesh.receiveShadow = true;
      }

      if (planetData.rings) {
        const ringGeometry = new THREE.RingGeometry(planetData.radius * 1.2, planetData.radius * 2.2, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.6, side: THREE.DoubleSide });
        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = -Math.PI / 2 + 0.1;
        planetMesh.add(rings);
      }

      if (planetData.moons) {
        planetData.moons.forEach((moonData) => {
          const moonGeometry = new THREE.SphereGeometry(moonData.radius, 16, 16);
          const moonMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
          const moon = new THREE.Mesh(moonGeometry, moonMaterial);
          moon.position.x = moonData.distance;
          moon.castShadow = true;
          moon.receiveShadow = true;
          const moonOrbit = new THREE.Group();
          moonOrbit.add(moon);
          planetMesh.add(moonOrbit);
        });
      }

      orbitGroup.add(planetMesh);
      planetMesh.rotation.z = (Math.random() * 23.4 * Math.PI) / 180;
      planetObjects.push({ mesh: planetMesh, orbit: orbitGroup, angle: Math.random() * Math.PI * 2, speed: planetData.speed * (0.8 + Math.random() * 0.4) });
    });

    planetsRef.current = planetObjects;

    const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
    scene.add(ambientLight);
    const hemi = new THREE.HemisphereLight(0x223355, 0x000000, 0.15);
    scene.add(hemi);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - window.innerWidth / 2) / window.innerWidth;
      mouseY = (event.clientY - window.innerHeight / 2) / window.innerHeight;
      targetX = mouseX * 0.1;
      targetY = mouseY * 0.1;
    };

    const handleClick = (event: MouseEvent) => {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        if (clickedObject.userData.name) {
          setSelectedPlanet(clickedObject.userData.name);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    const animate = () => {
      requestAnimationFrame(animate);
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (-targetY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);
      planetsRef.current.forEach((planet) => {
        planet.angle += planet.speed;
        planet.orbit.rotation.y = planet.angle;
        planet.mesh.rotation.y += 0.005 + planet.speed * 0.5;
        planet.mesh.children.forEach((child) => {
          if (child instanceof THREE.Group) {
            child.rotation.y += 0.02;
          }
        });
      });
      stars.rotation.y += 0.00015;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [planets]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4"></div>
            <p className="text-white text-xl">Loading Solar System...</p>
          </div>
        </div>
      )}

      <div ref={mountRef} className="w-full h-full" />

      {/* Planet Info Panel */}
      {selectedPlanet && (
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/85 backdrop-blur-md p-4 sm:p-6 rounded-xl border border-cyan-400/20 max-w-[92vw] sm:max-w-md shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-2xl font-bold text-white">{selectedPlanet}</h3>
            <button onClick={() => setSelectedPlanet(null)} className="text-gray-400 hover:text-white transition-colors">✕</button>
          </div>
          <div className="text-gray-300 space-y-2 text-sm sm:text-base">
            {(() => {
              const planet = planets.find((p: Planet) => p.name === selectedPlanet);
              if (!planet) return null;
              return (
                <ul className="space-y-1">
                  <li><strong>Radius:</strong> {planet.radius ? (planet.radius * 500).toFixed(1) + ' km' : 'N/A'}</li>
                  <li><strong>Distance from Sun:</strong> {planet.distance ? (planet.distance * 10000).toFixed(0) + ' km' : 'N/A'}</li>
                  <li><strong>Moons:</strong> {planet.moons ? planet.moons.length : 0}</li>
                  <li><strong>Rings:</strong> {planet.rings ? 'Yes' : 'No'}</li>
                </ul>
              );
            })()}
          </div>
          <div className="mt-5 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-semibold flex items-center gap-2 text-sm sm:text-base"><Layers className="w-4 h-4 text-cyan-300" /> Regolith / Soil Sampling</h4>
              <select value={soilMode} onChange={e => setSoilMode(e.target.value as any)} className="bg-black/40 text-xs sm:text-sm px-2 py-1 rounded border border-white/20 focus:outline-none">
                <option value="plant_growth">Plant Growth</option>
                <option value="bio_reactor">Bio Reactor</option>
                <option value="life_support">Life Support</option>
                <option value="construction">Construction</option>
              </select>
            </div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <button onClick={() => setSoilSamples(batchSoilPanel(selectedPlanet, 4, { targetUse: soilMode }))} className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs sm:text-sm flex items-center gap-1"><Beaker className="w-4 h-4" /> Batch (4)</button>
              <button onClick={() => setSoilSamples([generateSoilSample(selectedPlanet, { targetUse: soilMode })])} className="px-3 py-1.5 rounded bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm flex items-center gap-1"><FlaskConical className="w-4 h-4" /> Single</button>
              <button onClick={() => setSoilSamples(null)} className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm">Clear</button>
            </div>
            {soilSamples && soilSamples.length > 0 && (
              <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
                {soilSamples.map((s, idx) => (
                  <div key={idx} className="rounded-lg bg-black/40 border border-white/10 p-2 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="font-semibold text-cyan-300">{s.regolithType}</span>
                      <span className="text-gray-400">Score: <span className={`font-semibold ${s.suitabilityScore>0.65?'text-green-400':s.suitabilityScore>0.45?'text-yellow-300':'text-red-400'}`}>{s.suitabilityScore}</span></span>
                    </div>
                    <div className="mt-1 grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] sm:text-[11px] text-gray-300">
                      <span>FeOx: {s.ironOxide}</span>
                      <span>Perch: {s.perchlorates}</span>
                      <span>Moist: {s.moisture}</span>
                      <span>Org: {s.organicMarkers}</span>
                      <span>Grain: {s.grainSizeIndex}</span>
                      <span>RadSter: {s.radiationSterilization}</span>
                    </div>
                    {s.notes.length>0 && (
                      <ul className="mt-1 text-[10px] text-red-300 list-disc list-inside space-y-0.5">
                        {s.notes.map((n,i)=>(<li key={i}>{n}</li>))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Controls Panel */}
      <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-black/80 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-white/20">
        <h4 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Controls</h4>
        <div className="text-gray-300 text-[11px] sm:text-sm space-y-1">
          <p>• Move mouse to orbit around system</p>
          <p>• Click on planets for information</p>
          <p>• Watch real-time orbital mechanics</p>
        </div>
      </div>

      {/* Planet List */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-black/80 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-white/20 max-h-[60vh] overflow-y-auto">
        <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Solar System</h4>
        <div className="space-y-1 sm:space-y-2">
          {planets.length === 0 ? (
            <div className="text-red-400 text-xs">No planet data available. Check API key, network, or console for errors.</div>
          ) : (
            planets.map((planet) => (
              <button key={planet.name} onClick={() => setSelectedPlanet(planet.name)} className="block w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 text-xs sm:text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `#${planet.color.toString(16).padStart(6, '0')}` }}></div>
                  <span>{planet.name}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanetarySystem;