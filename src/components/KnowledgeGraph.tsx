import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const KnowledgeGraph: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 50;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Create nodes
    const nodes: THREE.Mesh[] = [];
    const nodePositions = [
      { x: 0, y: 0, z: 0 },
      { x: 15, y: 10, z: 5 },
      { x: -15, y: 15, z: -5 },
      { x: 20, y: -10, z: 10 },
      { x: -20, y: -15, z: -10 },
      { x: 0, y: 25, z: 15 },
      { x: 25, y: 0, z: -15 }
    ];

    const nodeColors = [0x4fc3f7, 0x81c784, 0xffb74d, 0xf48fb1, 0xce93d8, 0x90caf9, 0xa5d6a7];

    nodePositions.forEach((pos, index) => {
      const geometry = new THREE.SphereGeometry(1.5, 32, 32);
      const material = new THREE.MeshBasicMaterial({ 
        color: nodeColors[index % nodeColors.length],
        transparent: true,
        opacity: 0.8
      });
      const node = new THREE.Mesh(geometry, material);
      node.position.set(pos.x, pos.y, pos.z);
      scene.add(node);
      nodes.push(node);
    });

    // Create connections
    const connections: THREE.Line[] = [];
    const connectionPairs = [
      [0, 1], [0, 2], [1, 3], [2, 4], [0, 5], [1, 6], [3, 6]
    ];

    connectionPairs.forEach(([startIndex, endIndex]) => {
      const start = nodePositions[startIndex];
      const end = nodePositions[endIndex];
      
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(start.x, start.y, start.z),
        new THREE.Vector3(end.x, end.y, end.z)
      ]);
      
      const material = new THREE.LineBasicMaterial({ 
        color: 0x555555,
        transparent: true,
        opacity: 0.3
      });
      
      const line = new THREE.Line(geometry, material);
      scene.add(line);
      connections.push(line);
    });

    // Animation
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      // Rotate the entire scene slowly
      scene.rotation.y += 0.005;
      scene.rotation.x += 0.002;

      // Animate individual nodes
      nodes.forEach((node, index) => {
        node.rotation.x += 0.01;
        node.rotation.y += 0.015;
        
        // Subtle floating animation
        const time = Date.now() * 0.001;
        node.position.y += Math.sin(time + index) * 0.02;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of Three.js resources
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full min-h-[400px] rounded-xl border border-white/20 bg-black/20"
      style={{ background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)' }}
    />
  );
};

export default KnowledgeGraph;