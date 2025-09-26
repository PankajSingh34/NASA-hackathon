import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface Planet {
  name: string;
  radius: number;
  distance: number;
  speed: number;
  color: number;
  textureUrl?: string;
  rings?: boolean;
  moons?: Array<{
    radius: number;
    distance: number;
    speed: number;
  }>;
}

const PlanetarySystem: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const planetsRef = useRef<Array<{ mesh: THREE.Mesh; orbit: THREE.Group; angle: number; speed: number }>>([]);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const planets: Planet[] = [
    {
      name: 'Sun',
      radius: 2.5,
      distance: 0,
      speed: 0,
      color: 0xffaa00,
      textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/sun.jpg'
    },
    {
      name: 'Mercury',
      radius: 0.3,
      distance: 8,
      speed: 0.02,
      color: 0x8c7853,
      textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/mercury.jpg'
    },
    {
      name: 'Venus',
      radius: 0.45,
      distance: 12,
      speed: 0.015,
      color: 0xffc649,
      textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/venus_surface.jpg'
    },
    {
      name: 'Earth',
      radius: 0.5,
      distance: 16,
      speed: 0.01,
      color: 0x6b93d6,
      textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_atmos_2048.jpg',
      moons: [{ radius: 0.15, distance: 2, speed: 0.05 }]
    },
    {
      name: 'Mars',
      radius: 0.4,
      distance: 22,
      speed: 0.008,
      color: 0xcd5c5c,
      textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/mars_1k_color.jpg'
    },
    {
      name: 'Jupiter',
      radius: 1.2,
      distance: 30,
      speed: 0.005,
      color: 0xd8ca9d,
      textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/jupiter_1024.jpg',
      moons: [
        { radius: 0.1, distance: 3, speed: 0.03 },
        { radius: 0.12, distance: 4, speed: 0.025 },
        { radius: 0.08, distance: 5, speed: 0.02 }
      ]
    },
    {
      name: 'Saturn',
      radius: 1.0,
      distance: 40,
      speed: 0.003,
      color: 0xfad5a5,
      textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/saturn_1024.jpg',
      rings: true
    },
    {
      name: 'Uranus',
      radius: 0.7,
      distance: 50,
      speed: 0.002,
      color: 0x4fd0e7,
      textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/uranus_1024.jpg'
    },
    {
      name: 'Neptune',
      radius: 0.65,
      distance: 60,
      speed: 0.001,
      color: 0x4b70dd,
      textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/neptune_1024.jpg'
    }
  ];

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011);
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
    const starsCount = 10000;
    const positions = new Float32Array(starsCount * 3);
    
    for (let i = 0; i < starsCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 2000;
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starsMaterial = new THREE.PointsMaterial({ 
      color: 0xffffff, 
      size: 1,
      transparent: true,
      opacity: 0.8
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Set loading to false immediately since we're not loading external textures
    setIsLoading(false);

    // Create planets
    const planetObjects: Array<{ mesh: THREE.Mesh; orbit: THREE.Group; angle: number; speed: number }> = [];

    planets.forEach((planetData) => {
      const orbitGroup = new THREE.Group();
      scene.add(orbitGroup);

      // Create orbit line
      if (planetData.distance > 0) {
        const orbitGeometry = new THREE.RingGeometry(planetData.distance - 0.05, planetData.distance + 0.05, 64);
        const orbitMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x444444, 
          transparent: true, 
          opacity: 0.3,
          side: THREE.DoubleSide
        });
        const orbitLine = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbitLine.rotation.x = -Math.PI / 2;
        scene.add(orbitLine);
      }

      // Create planet geometry
      const geometry = new THREE.SphereGeometry(planetData.radius, 32, 32);
      
      // Use solid colors for reliability - textures can be added later
      const material = new THREE.MeshPhongMaterial({ 
        color: planetData.color,
        shininess: 30,
        specular: 0x222222
      });

      const planetMesh = new THREE.Mesh(geometry, material);
      
      // Position planet
      planetMesh.position.x = planetData.distance;
      planetMesh.userData = { name: planetData.name };
      
      // Add glow effect for sun
      if (planetData.name === 'Sun') {
        const glowGeometry = new THREE.SphereGeometry(planetData.radius * 1.2, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: 0xffaa00,
          transparent: true,
          opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        planetMesh.add(glow);

        // Add light from sun
        const sunLight = new THREE.PointLight(0xffffff, 2, 100);
        sunLight.position.copy(planetMesh.position);
        sunLight.castShadow = true;
        scene.add(sunLight);
      } else {
        planetMesh.castShadow = true;
        planetMesh.receiveShadow = true;
      }

      // Add rings for Saturn
      if (planetData.rings) {
        const ringGeometry = new THREE.RingGeometry(planetData.radius * 1.2, planetData.radius * 2.2, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0xaaaaaa,
          transparent: true,
          opacity: 0.6,
          side: THREE.DoubleSide
        });
        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = -Math.PI / 2 + 0.1;
        planetMesh.add(rings);
      }

      // Add moons
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
      
      planetObjects.push({
        mesh: planetMesh,
        orbit: orbitGroup,
        angle: Math.random() * Math.PI * 2,
        speed: planetData.speed
      });
    });

    planetsRef.current = planetObjects;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.1);
    scene.add(ambientLight);

    // Mouse controls for camera
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

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Update camera position based on mouse
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (-targetY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Animate planets
      planetsRef.current.forEach((planet) => {
        planet.angle += planet.speed;
        planet.orbit.rotation.y = planet.angle;
        
        // Rotate planet on its axis
        planet.mesh.rotation.y += 0.01;
        
        // Animate moons
        planet.mesh.children.forEach((child) => {
          if (child instanceof THREE.Group) {
            child.rotation.y += 0.02;
          }
        });
      });

      // Rotate starfield slowly
      stars.rotation.y += 0.0002;

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
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
  }, []);

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
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md p-6 rounded-xl border border-white/20 max-w-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-white">{selectedPlanet}</h3>
            <button
              onClick={() => setSelectedPlanet(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="text-gray-300 space-y-2">
            {getPlanetInfo(selectedPlanet)}
          </div>
        </div>
      )}

      {/* Controls Panel */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/20">
        <h4 className="text-white font-semibold mb-2">Controls</h4>
        <div className="text-gray-300 text-sm space-y-1">
          <p>• Move mouse to orbit around system</p>
          <p>• Click on planets for information</p>
          <p>• Watch real-time orbital mechanics</p>
        </div>
      </div>

      {/* Planet List */}
      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/20">
        <h4 className="text-white font-semibold mb-3">Solar System</h4>
        <div className="space-y-2">
          {planets.map((planet) => (
            <button
              key={planet.name}
              onClick={() => setSelectedPlanet(planet.name)}
              className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white 
                         hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: `#${planet.color.toString(16).padStart(6, '0')}` }}
                ></div>
                <span>{planet.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const getPlanetInfo = (planetName: string) => {
  const planetData: { [key: string]: { description: string; facts: string[] } } = {
    Sun: {
      description: "The center of our solar system, a massive ball of hot plasma.",
      facts: [
        "Temperature: 5,778 K surface",
        "Mass: 1.989 × 10³⁰ kg",
        "Age: ~4.6 billion years",
        "Composition: 73% Hydrogen, 25% Helium"
      ]
    },
    Mercury: {
      description: "The smallest planet and closest to the Sun.",
      facts: [
        "Distance from Sun: 57.9 million km",
        "Day length: 59 Earth days",
        "No atmosphere",
        "Temperature: -173°C to 427°C"
      ]
    },
    Venus: {
      description: "The hottest planet with a thick, toxic atmosphere.",
      facts: [
        "Distance from Sun: 108.2 million km",
        "Surface temperature: 462°C",
        "Atmospheric pressure: 90x Earth",
        "Rotates backwards"
      ]
    },
    Earth: {
      description: "Our home planet, the only known world to harbor life.",
      facts: [
        "Distance from Sun: 149.6 million km",
        "71% of surface covered by water",
        "Atmosphere: 78% Nitrogen, 21% Oxygen",
        "One natural satellite: Moon"
      ]
    },
    Mars: {
      description: "The Red Planet, with evidence of ancient water flows.",
      facts: [
        "Distance from Sun: 227.9 million km",
        "Day length: 24.6 hours",
        "Largest volcano: Olympus Mons",
        "Two moons: Phobos and Deimos"
      ]
    },
    Jupiter: {
      description: "The largest planet, a gas giant with a Great Red Spot.",
      facts: [
        "Distance from Sun: 778.5 million km",
        "Mass: 2.5x all other planets combined",
        "79+ known moons",
        "Great Red Spot: storm larger than Earth"
      ]
    },
    Saturn: {
      description: "Famous for its spectacular ring system.",
      facts: [
        "Distance from Sun: 1.43 billion km",
        "Density less than water",
        "82+ known moons",
        "Rings made of ice and rock particles"
      ]
    },
    Uranus: {
      description: "An ice giant that rotates on its side.",
      facts: [
        "Distance from Sun: 2.87 billion km",
        "Rotates on its side (98° tilt)",
        "27 known moons",
        "Composed of water, methane, and ammonia"
      ]
    },
    Neptune: {
      description: "The windiest planet with speeds up to 2,100 km/h.",
      facts: [
        "Distance from Sun: 4.50 billion km",
        "Windiest planet in solar system",
        "14 known moons",
        "Takes 165 Earth years to orbit Sun"
      ]
    }
  };

  const info = planetData[planetName];
  if (!info) return null;

  return (
    <div>
      <p className="mb-3">{info.description}</p>
      <ul className="space-y-1">
        {info.facts.map((fact, index) => (
          <li key={index} className="text-sm">• {fact}</li>
        ))}
      </ul>
    </div>
  );
};

export default PlanetarySystem;