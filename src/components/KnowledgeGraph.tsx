import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useKnowledgeGraph } from '../services/useKnowledgeGraph';

interface Props {
  height?: number;
}

const KnowledgeGraph: React.FC<Props> = ({ height = 400 }) => {
  const { nodes: kgNodes, relations, summaries, loading } = useKnowledgeGraph();
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const animationRef = useRef<number>();
  const [hoverInfo, setHoverInfo] = useState<{ title: string; findings: string[] } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    // Cleanup existing renderer if re-running due to data change
    if (rendererRef.current) {
      mountRef.current.innerHTML = '';
    }
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(70, mountRef.current.clientWidth / height, 0.1, 2000);
    camera.position.z = 120;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, height);
    renderer.setPixelRatio(window.devicePixelRatio * 0.9);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Build geometry from dynamic graph
    const meshNodes: { mesh: THREE.Mesh; id: string }[] = [];
    const colorScale = (idx: number) => new THREE.Color().setHSL((idx * 0.13) % 1, 0.55, 0.55);
    kgNodes.forEach((n, i) => {
      const g = new THREE.SphereGeometry(2.2, 20, 20);
      const m = new THREE.MeshBasicMaterial({ color: colorScale(i), transparent: true, opacity: 0.85 });
      const mesh = new THREE.Mesh(g, m);
      mesh.position.set(n.position.x, n.position.y, n.position.z);
      mesh.userData = { id: n.id };
      scene.add(mesh);
      meshNodes.push({ mesh, id: n.id });
    });

    // Relations (lines)
    relations.forEach(r => {
      const aNode = kgNodes.find(n => n.id === r.a);
      const bNode = kgNodes.find(n => n.id === r.b);
      if (!aNode || !bNode) return;
      const geom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(aNode.position.x, aNode.position.y, aNode.position.z),
        new THREE.Vector3(bNode.position.x, bNode.position.y, bNode.position.z)
      ]);
      const mat = new THREE.LineBasicMaterial({ color: 0x348feb, transparent: true, opacity: 0.22 });
      const line = new THREE.Line(geom, mat);
      scene.add(line);
    });

    // Interaction (raycaster)
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    function onPointerMove(ev: MouseEvent) {
      if (!renderer.domElement) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    }
    renderer.domElement.addEventListener('mousemove', onPointerMove);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      scene.rotation.y += 0.0015;
      scene.rotation.x += 0.0006;
      // Raycast
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(meshNodes.map(mn => mn.mesh));
      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const id = (hit.userData as any).id;
        const summary = summaries.find(s => 'pub:' + s.publicationId === kgNodes.find(n => n.id === id)?.title);
        if (summary) {
          setHoverInfo({ title: summary.publicationId, findings: summary.keyFindings.slice(0, 3) });
        }
      } else if (hoverInfo) {
        setHoverInfo(null);
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousemove', onPointerMove);
      scene.traverse(obj => {
        if ((obj as any).geometry) (obj as any).geometry.dispose();
        if ((obj as any).material) {
          const mat = (obj as any).material;
          if (Array.isArray(mat)) mat.forEach(m => m.dispose()); else mat.dispose();
        }
      });
      renderer.dispose();
    };
  }, [kgNodes, relations, summaries, height]);

  return (
    <div className="relative w-full" style={{ height }}>
      <div
        ref={mountRef}
        className="w-full h-full rounded-xl border border-white/15 bg-black/30 backdrop-blur-sm"
        style={{ background: 'radial-gradient(circle at center, rgba(59,130,246,0.08) 0%, transparent 70%)' }}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-cyan-300 animate-pulse">
          Building knowledge graph…
        </div>
      )}
      {hoverInfo && (
        <div className="absolute left-2 top-2 max-w-[260px] p-3 rounded-lg bg-slate-900/90 border border-cyan-400/30 shadow-xl text-[11px] text-cyan-100">
          <div className="font-semibold text-cyan-300 mb-1">{hoverInfo.title}</div>
            <ul className="space-y-1 list-disc pl-4">
              {hoverInfo.findings.map(f => <li key={f}>{f}</li>)}
            </ul>
        </div>
      )}
    </div>
  );
};

export default KnowledgeGraph;