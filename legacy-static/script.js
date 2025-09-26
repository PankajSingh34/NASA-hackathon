// 3D Knowledge Graph Variables
let scene, camera, renderer, raycaster, mouse;
let nodes = [],
  connections = [],
  nodeObjects = [];
let animationId;
let isAnimating = true;
let currentVisualization = "sphere";

// Research data for 3D visualization
const researchData = [
  {
    name: "Plant Growth & Physiology",
    publications: 127,
    priority: "high",
    position: { x: 0, y: 0, z: 0 },
    description:
      "Microgravity effects on root orientation, stem elongation, photosynthesis, nutrient uptake, gene expression, and hormonal regulation",
    color: 0x2ecc71,
    category: "plant-biology",
    sources: ["Frontiers", "PubMed Central"],
  },
  {
    name: "Microbial Behavior & Virulence",
    publications: 156,
    priority: "critical",
    position: { x: 6, y: 3, z: -4 },
    description:
      "Microbial response to space stressors - mutation, antibiotic resistance, biofilm formation aboard ISS and ground analogs",
    color: 0xe74c3c,
    category: "microbiology",
    sources: ["NASA Taskbook", "Astrobiology", "Oxford Academic"],
  },
  {
    name: "Omics Studies Integration",
    publications: 203,
    priority: "critical",
    position: { x: -5, y: 4, z: 3 },
    description:
      "Transcriptomics, proteomics, genomics, metabolomics integration to understand molecular-level changes in space",
    color: 0x9b59b6,
    category: "molecular-biology",
    sources: ["PubMed Central", "Oxford Academic", "NASA Science Data"],
  },
  {
    name: "Human Physiology & Health",
    publications: 189,
    priority: "critical",
    position: { x: 4, y: -3, z: 5 },
    description:
      "Bone density loss, muscle atrophy, cardiovascular changes, immune modulation, radiation effects, stress responses",
    color: 0x3498db,
    category: "human-biology",
    sources: ["NASA", "NASA Taskbook", "NASA Science"],
  },
  {
    name: "Reproductive & Developmental Biology",
    publications: 84,
    priority: "high",
    position: { x: -3, y: -4, z: -3 },
    description:
      "Reproduction and development in altered gravity, epigenetic changes across generations, multigenerational effects",
    color: 0xf39c12,
    category: "developmental-biology",
    sources: ["Nature", "Cell Biology"],
  },
  {
    name: "Radiation & DNA Repair",
    publications: 167,
    priority: "critical",
    position: { x: 5, y: 2, z: -6 },
    description:
      "Space radiation DNA damage, repair mechanisms, adaptation strategies for deep-space vs LEO environments",
    color: 0xe67e22,
    category: "radiation-biology",
    sources: ["Oxford Academic", "Nature", "NASA Science"],
  },
  {
    name: "Bioregenerative Life Support",
    publications: 96,
    priority: "high",
    position: { x: -4, y: 5, z: 2 },
    description:
      "Engineering biological systems for food production, waste recycling, oxygen generation, synthetic biology applications",
    color: 0x1abc9c,
    category: "life-support",
    sources: ["Nature", "NASA"],
  },
  {
    name: "Stress Response & Metabolism",
    publications: 134,
    priority: "high",
    position: { x: 3, y: 4, z: 4 },
    description:
      "Oxidative stress responses, metabolic shifts, cellular adaptation pathways under microgravity and radiation",
    color: 0x34495e,
    category: "stress-biology",
    sources: ["Cell Metabolism", "Space Biology"],
  },
  {
    name: "Biospecimen & Data Management",
    publications: 112,
    priority: "medium",
    position: { x: -6, y: -2, z: 1 },
    description:
      "OSDR, ALSDA, GeneLab repositories, metadata management, specimen collection and sharing protocols",
    color: 0x95a5a6,
    category: "data-management",
    sources: ["NASA", "NASA Science Data", "GeneLab"],
  },
  {
    name: "Space Bio-manufacturing",
    publications: 73,
    priority: "medium",
    position: { x: 2, y: -5, z: -2 },
    description:
      "Bioprocess engineering under microgravity, manufacturing materials, nutrients, pharmaceuticals using biological systems",
    color: 0x8e44ad,
    category: "bio-manufacturing",
    sources: ["Biotechnology", "Space Manufacturing"],
  },
  {
    name: "Cardiovascular Adaptation",
    publications: 87,
    priority: "high",
    position: { x: -2, y: 1, z: -5 },
    description:
      "Heart function, blood circulation, fluid shifts, orthostatic intolerance in microgravity environments",
    color: 0xc0392b,
    category: "human-biology",
    sources: ["Circulation Research", "Space Medicine"],
  },
  {
    name: "Bone & Muscle Systems",
    publications: 145,
    priority: "high",
    position: { x: 1, y: -2, z: 6 },
    description:
      "Bone density loss, muscle atrophy mechanisms, exercise countermeasures, pharmaceutical interventions",
    color: 0x16a085,
    category: "human-biology",
    sources: ["Bone Research", "Muscle Biology"],
  },
];

// Initialize 3D scene
function init3DScene() {
  const container = document.getElementById("threejs-container");
  if (!container) return;

  // Scene setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0a);

  // Camera setup
  camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(10, 10, 10);
  camera.lookAt(0, 0, 0);

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // Raycaster for mouse interaction
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // Add stars background
  createStarField();

  // Create research nodes
  createResearchNodes();

  // Create connections between nodes
  createConnections();

  // Add lights
  addLights();

  // Add event listeners
  renderer.domElement.addEventListener("mousemove", onMouseMove);
  renderer.domElement.addEventListener("click", onMouseClick);
  window.addEventListener("resize", onWindowResize);

  // Start animation
  animate();
}

function createStarField() {
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.5,
  });

  const starsVertices = [];
  for (let i = 0; i < 1000; i++) {
    const x = (Math.random() - 0.5) * 100;
    const y = (Math.random() - 0.5) * 100;
    const z = (Math.random() - 0.5) * 100;
    starsVertices.push(x, y, z);
  }

  starsGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starsVertices, 3)
  );
  const starField = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(starField);
}

function createResearchNodes() {
  nodeObjects = [];

  researchData.forEach((research, index) => {
    // Node size based on publication count
    const size = Math.max(0.3, research.publications / 100);

    // Create node geometry and material
    const geometry = new THREE.SphereGeometry(size, 16, 16);
    const material = new THREE.MeshPhongMaterial({
      color: research.color,
      transparent: true,
      opacity: 0.8,
      emissive: research.color,
      emissiveIntensity: 0.1,
    });

    const node = new THREE.Mesh(geometry, material);
    node.position.set(
      research.position.x,
      research.position.y,
      research.position.z
    );
    node.userData = research;

    // Add glow effect
    const glowGeometry = new THREE.SphereGeometry(size * 1.2, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: research.color,
      transparent: true,
      opacity: 0.2,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.copy(node.position);

    scene.add(node);
    scene.add(glow);
    nodeObjects.push({ mesh: node, glow: glow, data: research });
  });
}

function createConnections() {
  // Create connections between related research areas
  const connectionPairs = [
    // Plant biology connections
    [0, 6],
    [0, 7],
    [0, 2], // Plant Growth with Life Support, Stress Response, Omics

    // Microbiology connections
    [1, 5],
    [1, 7],
    [1, 8], // Microbial with Radiation, Stress Response, Data Management

    // Omics studies connections (central hub)
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 7], // Omics with Human Health, Reproduction, Radiation, Stress

    // Human physiology connections
    [3, 10],
    [3, 11],
    [3, 5],
    [3, 7], // Human Health with Cardiovascular, Bone/Muscle, Radiation, Stress

    // Radiation effects connections
    [5, 4],
    [5, 7],
    [5, 1], // Radiation with Reproduction, Stress, Microbial

    // Life support connections
    [6, 0],
    [6, 9],
    [6, 1], // Life Support with Plants, Bio-manufacturing, Microbial

    // Bio-manufacturing connections
    [9, 6],
    [9, 1],
    [9, 8], // Bio-manufacturing with Life Support, Microbial, Data

    // Cardiovascular and musculoskeletal
    [10, 11],
    [10, 3], // Cardiovascular with Bone/Muscle, Human Health

    // Data management connections
    [8, 2],
    [8, 3],
    [8, 5], // Data with Omics, Human Health, Radiation
  ];

  connectionPairs.forEach((pair) => {
    const start = researchData[pair[0]].position;
    const end = researchData[pair[1]].position;

    const points = [
      new THREE.Vector3(start.x, start.y, start.z),
      new THREE.Vector3(end.x, end.y, end.z),
    ];

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x4fc3f7,
      transparent: true,
      opacity: 0.3,
    });

    const line = new THREE.Line(geometry, material);
    scene.add(line);
    connections.push(line);
  });
}

function addLights() {
  const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1, 100);
  pointLight.position.set(10, 10, 10);
  scene.add(pointLight);

  const pointLight2 = new THREE.PointLight(0x4fc3f7, 0.5, 100);
  pointLight2.position.set(-10, -10, -10);
  scene.add(pointLight2);
}

function animate() {
  animationId = requestAnimationFrame(animate);

  if (isAnimating) {
    // Rotate the entire scene slowly
    scene.rotation.y += 0.005;

    // Make nodes pulse
    nodeObjects.forEach((nodeObj, index) => {
      const scale = 1 + Math.sin(Date.now() * 0.003 + index) * 0.1;
      nodeObj.mesh.scale.setScalar(scale);
      nodeObj.glow.scale.setScalar(scale);
    });
  }

  renderer.render(scene, camera);
}

function onMouseMove(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(nodeObjects.map((n) => n.mesh));

  // Reset all node materials
  nodeObjects.forEach((nodeObj) => {
    nodeObj.mesh.material.emissiveIntensity = 0.1;
    nodeObj.glow.material.opacity = 0.2;
  });

  if (intersects.length > 0) {
    const intersected = intersects[0].object;
    intersected.material.emissiveIntensity = 0.3;

    // Find the corresponding glow
    const nodeObj = nodeObjects.find((n) => n.mesh === intersected);
    if (nodeObj) {
      nodeObj.glow.material.opacity = 0.4;
      showNodeInfo(nodeObj.data);
    }

    renderer.domElement.style.cursor = "pointer";
  } else {
    renderer.domElement.style.cursor = "default";
    hideNodeInfo();
  }
}

function onMouseClick(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(nodeObjects.map((n) => n.mesh));

  if (intersects.length > 0) {
    const intersected = intersects[0].object;
    const nodeObj = nodeObjects.find((n) => n.mesh === intersected);
    if (nodeObj) {
      // Zoom to node
      const targetPosition = nodeObj.mesh.position.clone();
      targetPosition.multiplyScalar(1.5);
      camera.position.copy(targetPosition);
      camera.lookAt(nodeObj.mesh.position);
    }
  }
}

function onWindowResize() {
  const container = document.getElementById("threejs-container");
  if (container && camera && renderer) {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }
}

function showNodeInfo(data) {
  const nodeInfo = document.getElementById("nodeInfo");
  const nodeTitle = document.getElementById("nodeTitle");
  const nodeDescription = document.getElementById("nodeDescription");

  if (nodeTitle && nodeDescription && nodeInfo) {
    nodeTitle.textContent = `${data.name} (${data.publications} publications)`;
    nodeDescription.textContent = data.description;
    nodeInfo.style.display = "block";
  }
}

function hideNodeInfo() {
  const nodeInfo = document.getElementById("nodeInfo");
  if (nodeInfo) {
    nodeInfo.style.display = "none";
  }
}

// Control functions
function resetCamera() {
  if (camera) {
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);
  }
}

function toggleAnimation() {
  isAnimating = !isAnimating;
}

function changeVisualization() {
  if (!nodeObjects.length) return;

  if (currentVisualization === "sphere") {
    // Change to cube visualization
    nodeObjects.forEach((nodeObj) => {
      const size = Math.max(0.3, nodeObj.data.publications / 100);
      const newGeometry = new THREE.BoxGeometry(size, size, size);
      nodeObj.mesh.geometry.dispose();
      nodeObj.mesh.geometry = newGeometry;
    });
    currentVisualization = "cube";
  } else {
    // Change back to sphere
    nodeObjects.forEach((nodeObj) => {
      const size = Math.max(0.3, nodeObj.data.publications / 100);
      const newGeometry = new THREE.SphereGeometry(size, 16, 16);
      nodeObj.mesh.geometry.dispose();
      nodeObj.mesh.geometry = newGeometry;
    });
    currentVisualization = "sphere";
  }
}

function showConnections() {
  connections.forEach((connection) => {
    connection.material.opacity =
      connection.material.opacity === 0.3 ? 0.8 : 0.3;
  });
}

function createStars() {
  const starsContainer = document.getElementById("stars");
  const numStars = 100;

  for (let i = 0; i < numStars; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDelay = Math.random() * 3 + "s";
    starsContainer.appendChild(star);
  }
}

// Tab functionality
function showTab(tabName) {
  // Hide all tab contents
  const tabContents = document.querySelectorAll(".tab-content");
  tabContents.forEach((tab) => tab.classList.remove("active"));

  // Remove active class from all tabs
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => tab.classList.remove("active"));

  // Show selected tab content
  const selectedTab = document.getElementById(tabName);
  if (selectedTab) {
    selectedTab.classList.add("active");
  }

  // Add active class to clicked tab
  const clickedTab = document.querySelector(
    `[onclick="showTab('${tabName}')"]`
  );
  if (clickedTab) {
    clickedTab.classList.add("active");
  }

  // Initialize 3D scene when knowledge graph tab is shown
  if (tabName === "knowledge-graph" && !scene) {
    setTimeout(() => {
      init3DScene();
    }, 100);
  }
}

// Research details modal functionality
function showResearchDetails(researchId, event) {
  // Prevent event bubbling to avoid tab switching
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }

  const modal = document.getElementById("researchModal");
  const modalContent = document.getElementById("modalContent");

  // Sample detailed content based on research ID
  const researchDetails = {
    "plant-microgravity": {
      title: "Microgravity Effects on Plant Growth & Physiology",
      content: `
                <h2>Microgravity Effects on Plant Growth & Physiology</h2>
                <div class="research-meta" style="margin: 20px 0;">
                    <span>📊 127 Publications</span>
                    <span>🗓️ 2015-2025</span>
                    <span>🎯 High Priority</span>
                    <span>🌱 15+ Plant Species</span>
                </div>
                
                <h3>Executive Summary</h3>
                <p>Comprehensive research reveals how microgravity fundamentally alters plant growth patterns, cellular processes, and molecular responses. Studies demonstrate significant changes in root orientation, stem elongation, photosynthetic efficiency, and nutrient uptake mechanisms.</p>
                
                <h3>Key Research Areas</h3>
                <ul>
                    <li><strong>Root Orientation (Gravitropism):</strong> Loss of normal gravity sensing leads to random root growth patterns</li>
                    <li><strong>Stem Elongation:</strong> Altered cell wall synthesis and expansion mechanisms</li>
                    <li><strong>Photosynthesis:</strong> Changes in chloroplast orientation and light harvesting efficiency</li>
                    <li><strong>Nutrient Uptake:</strong> Modified root hair development and ion transport</li>
                </ul>
                
                <h3>Molecular & Genetic Changes</h3>
                <ul>
                    <li><strong>Gene Expression:</strong> Differential regulation of gravity-response genes</li>
                    <li><strong>Cell Wall Modifications:</strong> Altered cellulose and pectin deposition patterns</li>
                    <li><strong>Hormonal Regulation:</strong> Changes in auxin, cytokinin, and gibberellin pathways</li>
                    <li><strong>Stress Responses:</strong> Activation of oxidative stress and defense pathways</li>
                </ul>
                
                <h3>Mission Applications</h3>
                <p>Critical for sustainable food production during long-duration Mars missions. Research supports development of controlled environment agriculture systems and selection of optimal crop varieties for space cultivation.</p>
                
                <h3>Data Sources</h3>
                <p><strong>Frontiers in Plant Science:</strong> Leading research on plant space biology<br>
                <strong>PubMed Central:</strong> Comprehensive database of peer-reviewed studies</p>
            `,
    },
    "microbial-behavior": {
      title: "Microbial Behavior & Virulence in Space",
      content: `
                <h2>Microbial Behavior & Virulence in Space</h2>
                <div class="research-meta" style="margin: 20px 0;">
                    <span>📊 156 Publications</span>
                    <span>🗓️ 2018-2025</span>
                    <span>🎯 Critical Priority</span>
                    <span>🦠 25+ Microbial Species</span>
                </div>
                
                <h3>Executive Summary</h3>
                <p>Space stressors including microgravity and radiation significantly alter microbial behavior, leading to increased virulence, antibiotic resistance, and novel biofilm formation patterns. These changes pose critical risks for crew health and spacecraft systems.</p>
                
                <h3>Key Stress Responses</h3>
                <ul>
                    <li><strong>Mutation Rates:</strong> 2-3x increase in genetic mutations under space conditions</li>
                    <li><strong>Antibiotic Resistance:</strong> Accelerated development of multi-drug resistance</li>
                    <li><strong>Biofilm Formation:</strong> Enhanced biofilm production and structural complexity</li>
                    <li><strong>Virulence Factors:</strong> Increased expression of pathogenicity genes</li>
                </ul>
                
                <h3>ISS Research Findings</h3>
                <ul>
                    <li><strong>Salmonella:</strong> Increased virulence and stress tolerance aboard ISS</li>
                    <li><strong>E. coli:</strong> Altered gene expression and biofilm architecture</li>
                    <li><strong>Staphylococcus:</strong> Enhanced antibiotic resistance mechanisms</li>
                    <li><strong>Candida:</strong> Fungal adaptation and increased pathogenicity</li>
                </ul>
                
                <h3>Ground-Based Analog Studies</h3>
                <p>Simulated microgravity using clinostats and high-aspect ratio vessels (HARVs) confirm space-flight findings and enable controlled experiments for mechanistic understanding.</p>
                
                <h3>Mission Implications</h3>
                <p>Critical for developing new antimicrobial strategies, spacecraft decontamination protocols, and crew health monitoring systems for long-duration missions.</p>
                
                <h3>Data Sources</h3>
                <p><strong>NASA Taskbook:</strong> Comprehensive mission research database<br>
                <strong>Astrobiology Journal:</strong> Leading research in space microbiology<br>
                <strong>Oxford Academic:</strong> Peer-reviewed microbiology studies</p>
            `,
    },
    "omics-integration": {
      title: "Omics Studies: Multi-level Molecular Analysis",
      content: `
                <h2>Omics Studies: Transcriptomics / Proteomics / Genomics / Metabolomics</h2>
                <div class="research-meta" style="margin: 20px 0;">
                    <span>📊 203 Publications</span>
                    <span>🗓️ 2020-2025</span>
                    <span>🎯 Critical Priority</span>
                    <span>🧬 Multi-Omics Integration</span>
                </div>
                
                <h3>Executive Summary</h3>
                <p>Comprehensive molecular analysis using transcriptomics, proteomics, genomics, and metabolomics provides unprecedented insights into space-induced biological changes. Integration of omics data reveals system-level adaptations and identifies biomarkers for space health.</p>
                
                <h3>Omics Technologies</h3>
                <ul>
                    <li><strong>Transcriptomics:</strong> RNA sequencing reveals gene expression changes in space</li>
                    <li><strong>Proteomics:</strong> Mass spectrometry analysis of protein abundance and modifications</li>
                    <li><strong>Genomics:</strong> Whole genome sequencing for mutation and epigenetic analysis</li>
                    <li><strong>Metabolomics:</strong> Small molecule profiling of cellular metabolism</li>
                </ul>
                
                <h3>Key Discoveries</h3>
                <ul>
                    <li><strong>Gene Networks:</strong> Identification of space-responsive gene modules</li>
                    <li><strong>Protein Pathways:</strong> Disrupted cellular signaling cascades</li>
                    <li><strong>Metabolic Shifts:</strong> Altered energy production and stress metabolism</li>
                    <li><strong>Epigenetic Changes:</strong> DNA methylation and histone modification patterns</li>
                </ul>
                
                <h3>Integration Approaches</h3>
                <ul>
                    <li><strong>Systems Biology:</strong> Network analysis of molecular interactions</li>
                    <li><strong>Machine Learning:</strong> AI-driven pattern recognition and biomarker discovery</li>
                    <li><strong>Pathway Analysis:</strong> Functional annotation and enrichment analysis</li>
                    <li><strong>Multi-Modal Integration:</strong> Combining data across omics platforms</li>
                </ul>
                
                <h3>NASA GeneLab Integration</h3>
                <p>All omics data is deposited in NASA's GeneLab repository, enabling meta-analyses across experiments and species. Standardized processing pipelines ensure data comparability and reproducibility.</p>
                
                <h3>Data Sources</h3>
                <p><strong>PubMed Central:</strong> Comprehensive biomedical literature<br>
                <strong>Oxford Academic:</strong> High-impact molecular biology journals<br>
                <strong>NASA Science Data:</strong> GeneLab and OSDR repositories</p>
            `,
    },
    "radiation-dna-repair": {
      title: "Radiation & DNA Damage/Repair Mechanisms",
      content: `
                <h2>Radiation & DNA Damage/Repair Mechanisms</h2>
                <div class="research-meta" style="margin: 20px 0;">
                    <span>📊 167 Publications</span>
                    <span>🗓️ Oxford Academic, Nature</span>
                    <span>🎯 Critical Priority</span>
                    <span>☢️ Multi-Species Studies</span>
                </div>
                
                <h3>Executive Summary</h3>
                <p>Space radiation poses the greatest long-term health risk for deep space exploration. Research reveals complex DNA damage patterns and adaptive repair mechanisms that vary significantly between low-Earth orbit and deep space environments.</p>
                
                <h3>Radiation Environment Comparison</h3>
                <ul>
                    <li><strong>Low-Earth Orbit (LEO):</strong> Primarily trapped protons and electrons, periodic solar particle events</li>
                    <li><strong>Deep Space:</strong> Galactic cosmic rays (GCR) with high-energy heavy ions, continuous exposure</li>
                    <li><strong>Solar Events:</strong> Sporadic but intense proton radiation during solar storms</li>
                    <li><strong>Lunar/Mars Surface:</strong> Reduced but persistent GCR exposure with limited magnetic shielding</li>
                </ul>
                
                <h3>DNA Damage Mechanisms</h3>
                <ul>
                    <li><strong>Direct Damage:</strong> High-LET radiation causes clustered DNA lesions</li>
                    <li><strong>Indirect Damage:</strong> Free radical formation and oxidative stress</li>
                    <li><strong>Complex Lesions:</strong> Multiple damage sites in close proximity</li>
                    <li><strong>Chromosome Aberrations:</strong> Large-scale genomic rearrangements</li>
                </ul>
                
                <h3>Repair Pathway Activation</h3>
                <ul>
                    <li><strong>Homologous Recombination:</strong> High-fidelity repair of double-strand breaks</li>
                    <li><strong>Non-Homologous End Joining:</strong> Error-prone but rapid repair mechanism</li>
                    <li><strong>Base Excision Repair:</strong> Correction of oxidative DNA damage</li>
                    <li><strong>DNA Damage Checkpoints:</strong> Cell cycle arrest and apoptosis pathways</li>
                </ul>
                
                <h3>Mission Risk Assessment</h3>
                <p>Mars mission duration (30+ months) could result in 5-10% increase in cancer risk. Current shielding technologies provide limited protection against GCR. Biological countermeasures and enhanced repair mechanisms are critical research priorities.</p>
            `,
    },
    "human-physiology": {
      title: "Human Physiology, Health & Immune Response",
      content: `
                <h2>Human Physiology, Health & Immune Response in Space</h2>
                <div class="research-meta" style="margin: 20px 0;">
                    <span>📊 189 Publications</span>
                    <span>🗓️ NASA Science, Taskbook</span>
                    <span>🎯 Critical Priority</span>
                    <span>👨‍🚀 Multi-System Analysis</span>
                </div>
                
                <h3>Executive Summary</h3>
                <p>Comprehensive analysis reveals systemic physiological changes affecting multiple body systems during spaceflight. Immune system modulation, combined with musculoskeletal and cardiovascular changes, creates complex health challenges requiring integrated countermeasure approaches.</p>
                
                <h3>Major Physiological Changes</h3>
                <ul>
                    <li><strong>Bone Density Loss:</strong> 1-2% monthly loss in weight-bearing bones</li>
                    <li><strong>Muscle Atrophy:</strong> 20-30% loss in muscle mass over 6 months</li>
                    <li><strong>Cardiovascular Deconditioning:</strong> Reduced cardiac output and orthostatic intolerance</li>
                    <li><strong>Fluid Shifts:</strong> Cephalad fluid redistribution causing facial puffiness and sinus congestion</li>
                </ul>
                
                <h3>Immune System Modulation</h3>
                <ul>
                    <li><strong>T-Cell Function:</strong> Reduced activation and proliferation capacity</li>
                    <li><strong>Cytokine Production:</strong> Altered inflammatory response patterns</li>
                    <li><strong>Antibody Response:</strong> Decreased vaccine effectiveness</li>
                    <li><strong>Stress Hormones:</strong> Elevated cortisol affecting immune function</li>
                </ul>
                
                <h3>Radiation Health Effects</h3>
                <ul>
                    <li><strong>Acute Effects:</strong> Radiation sickness symptoms during solar particle events</li>
                    <li><strong>Chronic Exposure:</strong> Increased cancer risk and cataract formation</li>
                    <li><strong>Central Nervous System:</strong> Cognitive impairment and mood changes</li>
                    <li><strong>Cardiovascular Disease:</strong> Accelerated atherosclerosis from radiation exposure</li>
                </ul>
                
                <h3>Endocrine System Changes</h3>
                <ul>
                    <li><strong>Circadian Disruption:</strong> Altered melatonin and cortisol rhythms</li>
                    <li><strong>Growth Hormone:</strong> Changes in IGF-1 signaling pathways</li>
                    <li><strong>Thyroid Function:</strong> Modified TSH and thyroid hormone levels</li>
                    <li><strong>Reproductive Hormones:</strong> Altered testosterone and estrogen production</li>
                </ul>
                
                <h3>Integrated Countermeasures</h3>
                <p>Successful mitigation requires combined exercise, pharmaceutical, nutritional, and environmental interventions. Personalized medicine approaches show promise for optimizing individual countermeasure protocols.</p>
            `,
    },
    "bioregenerative-systems": {
      title: "Bioregenerative Life Support Systems",
      content: `
                <h2>Bioregenerative Life Support Systems / Synthetic Biology</h2>
                <div class="research-meta" style="margin: 20px 0;">
                    <span>📊 96 Publications</span>
                    <span>🗓️ Nature, NASA</span>
                    <span>🎯 High Priority</span>
                    <span>🔄 Closed-Loop Systems</span>
                </div>
                
                <h3>Executive Summary</h3>
                <p>Advanced biological systems engineered for life support enable sustainable long-duration space missions. Integration of food production, waste recycling, oxygen generation, and synthetic biology creates closed-loop ecosystems essential for Mars exploration.</p>
                
                <h3>Core System Components</h3>
                <ul>
                    <li><strong>Food Production:</strong> Hydroponic and aeroponic plant cultivation systems</li>
                    <li><strong>Waste Recycling:</strong> Biological processing of human and food waste</li>
                    <li><strong>Oxygen Generation:</strong> Photosynthetic and engineered microbial systems</li>
                    <li><strong>Water Recovery:</strong> Biological water purification and recycling</li>
                </ul>
                
                <h3>Synthetic Biology Applications</h3>
                <ul>
                    <li><strong>Pharmaceutical Production:</strong> Engineered microbes producing essential medicines</li>
                    <li><strong>Nutrient Synthesis:</strong> Biosynthesis of vitamins and essential compounds</li>
                    <li><strong>Biomaterial Production:</strong> Living systems creating structural materials</li>
                    <li><strong>Environmental Monitoring:</strong> Biosensors for habitat health assessment</li>
                </ul>
                
                <h3>System Integration Challenges</h3>
                <ul>
                    <li><strong>Resource Balance:</strong> Maintaining stable nutrient and energy cycles</li>
                    <li><strong>Contamination Control:</strong> Preventing pathogenic organism establishment</li>
                    <li><strong>System Reliability:</strong> Backup mechanisms for critical life support functions</li>
                    <li><strong>Crew Integration:</strong> Human factors in biological system management</li>
                </ul>
                
                <h3>Mars Mission Applications</h3>
                <p>Surface operations require 80-90% resource closure for sustainability. Pre-deployed systems could establish life support infrastructure before crew arrival, utilizing local resources and solar energy.</p>
                
                <h3>Technology Readiness</h3>
                <p>Current systems achieve 70-80% closure efficiency in ground testing. Next-generation integrated systems target 90%+ efficiency needed for Mars surface operations.</p>
            `,
    },
    "reproductive-biology": {
      title: "Reproductive & Developmental Biology",
      content: `
                <h2>Reproductive & Developmental Biology & Multigenerational Effects</h2>
                <div class="research-meta" style="margin: 20px 0;">
                    <span>📊 84 Publications</span>
                    <span>🗓️ Nature, Cell Biology</span>
                    <span>🎯 High Priority</span>
                    <span>🧬 Multi-Generation Studies</span>
                </div>
                
                <h3>Executive Summary</h3>
                <p>Understanding reproduction and development in space environments is critical for long-term space colonization. Research reveals significant effects on reproductive systems, embryonic development, and epigenetic inheritance patterns across generations.</p>
                
                <h3>Reproductive System Effects</h3>
                <ul>
                    <li><strong>Gamete Development:</strong> Altered sperm and egg cell maturation processes</li>
                    <li><strong>Hormonal Regulation:</strong> Changes in reproductive hormone cycles and levels</li>
                    <li><strong>Fertilization Success:</strong> Reduced fertilization rates in microgravity conditions</li>
                    <li><strong>Implantation:</strong> Altered embryo implantation and early development</li>
                </ul>
                
                <h3>Developmental Biology Findings</h3>
                <ul>
                    <li><strong>Embryogenesis:</strong> Disrupted cell division and tissue organization patterns</li>
                    <li><strong>Organogenesis:</strong> Altered organ development and morphogenesis</li>
                    <li><strong>Growth Patterns:</strong> Modified growth rates and body proportions</li>
                    <li><strong>Neural Development:</strong> Changes in brain and nervous system formation</li>
                </ul>
                
                <h3>Epigenetic Inheritance</h3>
                <ul>
                    <li><strong>DNA Methylation:</strong> Heritable changes in gene expression patterns</li>
                    <li><strong>Histone Modifications:</strong> Chromatin structure alterations passed to offspring</li>
                    <li><strong>Non-coding RNAs:</strong> Regulatory RNA changes affecting gene function</li>
                    <li><strong>Transgenerational Effects:</strong> Multi-generation inheritance of space-induced changes</li>
                </ul>
                
                <h3>Model Organism Studies</h3>
                <ul>
                    <li><strong>C. elegans:</strong> Nematode reproduction and development in microgravity</li>
                    <li><strong>Drosophila:</strong> Fruit fly studies on genetic and developmental changes</li>
                    <li><strong>Mice:</strong> Mammalian reproduction and embryonic development research</li>
                    <li><strong>Fish:</strong> Vertebrate development and bone formation studies</li>
                </ul>
                
                <h3>Mission Implications</h3>
                <p>Critical for understanding the feasibility of multi-generational space colonies on Mars. Research informs reproductive health protocols and potential interventions for space-born offspring.</p>
                
                <h3>Research Gaps</h3>
                <p>Limited studies on human reproduction in space due to ethical considerations. Ground-based simulations and animal models provide primary data sources for understanding reproductive risks.</p>
            `,
    },
    "stress-metabolism": {
      title: "Stress Response & Metabolic Shifts",
      content: `
                <h2>Stress Response / Oxidative Stress / Metabolic Shifts</h2>
                <div class="research-meta" style="margin: 20px 0;">
                    <span>📊 134 Publications</span>
                    <span>🗓️ Cell Metabolism, Space Biology</span>
                    <span>🎯 High Priority</span>
                    <span>⚡ Multi-System Analysis</span>
                </div>
                
                <h3>Executive Summary</h3>
                <p>Space environments trigger comprehensive stress response pathways and metabolic adaptations. Understanding these changes is essential for developing countermeasures and maintaining crew health during long-duration missions.</p>
                
                <h3>Oxidative Stress Responses</h3>
                <ul>
                    <li><strong>Reactive Oxygen Species (ROS):</strong> Increased production from radiation and microgravity</li>
                    <li><strong>Antioxidant Systems:</strong> Upregulation of catalase, SOD, and glutathione pathways</li>
                    <li><strong>Lipid Peroxidation:</strong> Membrane damage from oxidative stress</li>
                    <li><strong>DNA Oxidation:</strong> 8-oxoG formation and repair mechanisms</li>
                </ul>
                
                <h3>Metabolic Adaptations</h3>
                <ul>
                    <li><strong>Energy Metabolism:</strong> Shifts in glucose and lipid utilization patterns</li>
                    <li><strong>Mitochondrial Function:</strong> Changes in ATP production and respiratory capacity</li>
                    <li><strong>Protein Synthesis:</strong> Altered translation rates and protein turnover</li>
                    <li><strong>Amino Acid Metabolism:</strong> Changes in muscle protein breakdown and synthesis</li>
                </ul>
                
                <h3>Cellular Stress Pathways</h3>
                <ul>
                    <li><strong>Heat Shock Response:</strong> Activation of molecular chaperones and protein folding</li>
                    <li><strong>Unfolded Protein Response:</strong> ER stress and protein quality control</li>
                    <li><strong>Autophagy:</strong> Cellular cleanup and organelle recycling processes</li>
                    <li><strong>Apoptosis:</strong> Programmed cell death pathway regulation</li>
                </ul>
                
                <h3>Adaptation Mechanisms</h3>
                <ul>
                    <li><strong>Hormetic Response:</strong> Low-level stress leading to adaptive benefits</li>
                    <li><strong>Metabolic Flexibility:</strong> Switching between different fuel sources</li>
                    <li><strong>Stress Tolerance:</strong> Enhanced resistance to subsequent stressors</li>
                    <li><strong>Epigenetic Regulation:</strong> Gene expression changes mediating adaptation</li>
                </ul>
                
                <h3>Species-Specific Responses</h3>
                <ul>
                    <li><strong>Plants:</strong> Altered photosynthesis and carbohydrate metabolism</li>
                    <li><strong>Microbes:</strong> Enhanced stress resistance and biofilm formation</li>
                    <li><strong>Animals:</strong> Systemic metabolic changes and organ-specific adaptations</li>
                </ul>
                
                <h3>Countermeasure Development</h3>
                <p>Research identifies potential interventions including antioxidant supplementation, exercise protocols, and pharmaceutical approaches to mitigate space-induced stress responses.</p>
            `,
    },
    "data-repositories": {
      title: "Biospecimens & Data Repositories",
      content: `
                <h2>Biospecimens, Data Sharing, Repositories & Metadata</h2>
                <div class="research-meta" style="margin: 20px 0;">
                    <span>📊 112 Publications</span>
                    <span>🗓️ NASA, GeneLab, OSDR</span>
                    <span>🎯 Medium Priority</span>
                    <span>🗄️ Multi-Repository System</span>
                </div>
                
                <h3>Executive Summary</h3>
                <p>NASA's comprehensive data management system maximizes scientific return from space biology experiments through systematic collection, storage, and sharing of biological specimens and associated data across multiple repositories.</p>
                
                <h3>Major Data Repositories</h3>
                <ul>
                    <li><strong>GeneLab (genelab.nasa.gov):</strong> Omics data from space biology experiments</li>
                    <li><strong>OSDR (osdr.nasa.gov):</strong> Open Science Data Repository for all space life sciences</li>
                    <li><strong>ALSDA:</strong> Ames Life Sciences Data Archive for historical missions</li>
                    <li><strong>NASA Science Data Portal:</strong> Centralized access to all NASA science data</li>
                </ul>
                
                <h3>Biospecimen Management</h3>
                <ul>
                    <li><strong>Collection Protocols:</strong> Standardized procedures for sample collection and preservation</li>
                    <li><strong>Storage Systems:</strong> Cryogenic preservation and ambient storage capabilities</li>
                    <li><strong>Chain of Custody:</strong> Complete tracking from collection to analysis</li>
                    <li><strong>Sample Sharing:</strong> Distribution protocols for maximizing scientific utilization</li>
                </ul>
                
                <h3>Metadata Standards</h3>
                <ul>
                    <li><strong>FAIR Principles:</strong> Findable, Accessible, Interoperable, Reusable data</li>
                    <li><strong>Standardized Ontologies:</strong> Controlled vocabularies for consistent annotation</li>
                    <li><strong>Experimental Design:</strong> Complete documentation of study parameters</li>
                    <li><strong>Quality Metrics:</strong> Data quality assessment and validation protocols</li>
                </ul>
                
                <h3>Data Integration Capabilities</h3>
                <ul>
                    <li><strong>Cross-Study Analysis:</strong> Meta-analyses across multiple experiments</li>
                    <li><strong>Multi-Modal Integration:</strong> Combining different data types (omics, imaging, physiology)</li>
                    <li><strong>Temporal Analysis:</strong> Long-term trend identification across missions</li>
                    <li><strong>Species Comparison:</strong> Comparative biology across model organisms</li>
                </ul>
                
                <h3>Open Science Impact</h3>
                <ul>
                    <li><strong>Publication Linking:</strong> Direct connections between datasets and publications</li>
                    <li><strong>Reproducibility:</strong> Complete data availability for validation studies</li>
                    <li><strong>Collaboration:</strong> Global research community access and contribution</li>
                    <li><strong>Education:</strong> Resources for training next-generation space biologists</li>
                </ul>
                
                <h3>Future Developments</h3>
                <p>AI-powered data mining, automated analysis pipelines, and real-time data streaming from space experiments will enhance the repository's capabilities for supporting space biology research.</p>
            `,
    },
    "bio-manufacturing": {
      title: "Space Bio-manufacturing",
      content: `
                <h2>Space-Driven Bioprocess Engineering / Bio-manufacturing</h2>
                <div class="research-meta" style="margin: 20px 0;">
                    <span>📊 73 Publications</span>
                    <span>🗓️ Biotechnology, Space Manufacturing</span>
                    <span>🎯 Medium Priority</span>
                    <span>🏭 In-Space Production</span>
                </div>
                
                <h3>Executive Summary</h3>
                <p>Advanced bioprocess engineering leverages microorganisms and biological systems to manufacture essential materials, nutrients, and pharmaceuticals in space environments, enabling sustainable long-duration missions and reducing Earth dependence.</p>
                
                <h3>Bio-manufacturing Applications</h3>
                <ul>
                    <li><strong>Pharmaceutical Production:</strong> On-demand synthesis of essential medications</li>
                    <li><strong>Nutrient Manufacturing:</strong> Biosynthesis of vitamins and essential compounds</li>
                    <li><strong>Biomaterial Production:</strong> Living systems creating structural and functional materials</li>
                    <li><strong>Food Processing:</strong> Fermentation and bioprocessing for food production</li>
                </ul>
                
                <h3>Microgravity Advantages</h3>
                <ul>
                    <li><strong>Enhanced Mixing:</strong> Improved mass transfer without sedimentation</li>
                    <li><strong>Protein Crystallization:</strong> Higher quality protein structures for drug design</li>
                    <li><strong>Cell Culture:</strong> 3D tissue engineering without gravitational stress</li>
                    <li><strong>Biofilm Formation:</strong> Controlled biofilm architecture for bioreactors</li>
                </ul>
                
                <h3>Bioprocess Design Challenges</h3>
                <ul>
                    <li><strong>Containment Systems:</strong> Preventing contamination in closed spacecraft environments</li>
                    <li><strong>Resource Efficiency:</strong> Minimizing power, water, and consumable requirements</li>
                    <li><strong>Automation:</strong> Autonomous operation with minimal crew intervention</li>
                    <li><strong>Waste Management:</strong> Integration with life support and recycling systems</li>
                </ul>
                
                <h3>Engineering Solutions</h3>
                <ul>
                    <li><strong>Miniaturized Bioreactors:</strong> Compact systems for space-constrained environments</li>
                    <li><strong>Continuous Processing:</strong> Steady-state production systems</li>
                    <li><strong>Multi-Purpose Platforms:</strong> Flexible systems for different products</li>
                    <li><strong>Integrated Controls:</strong> Real-time monitoring and process optimization</li>
                </ul>
                
                <h3>Mission Applications</h3>
                <ul>
                    <li><strong>ISS Operations:</strong> Current research on protein crystallization and cell culture</li>
                    <li><strong>Lunar Missions:</strong> Local resource utilization for surface operations</li>
                    <li><strong>Mars Exploration:</strong> In-situ production reducing cargo requirements</li>
                    <li><strong>Deep Space:</strong> Self-sufficient manufacturing for multi-year missions</li>
                </ul>
                
                <h3>Technology Readiness</h3>
                <p>Current systems demonstrate proof-of-concept for basic bio-manufacturing. Next-generation integrated platforms target operational readiness for Mars surface missions by 2030.</p>
            `,
    },
    cardiovascular: {
      title: "Cardiovascular Adaptation",
      content: `
                <h2>Cardiovascular Adaptation in Microgravity</h2>
                <div class="research-meta" style="margin: 20px 0;">
                    <span>📊 87 Publications</span>
                    <span>🗓️ Circulation Research, Space Medicine</span>
                    <span>🎯 High Priority</span>
                    <span>❤️ Multi-System Analysis</span>
                </div>
                
                <h3>Executive Summary</h3>
                <p>Cardiovascular deconditioning represents one of the most significant physiological challenges of spaceflight, affecting heart function, blood circulation, and vascular health through complex adaptive mechanisms that develop within days of microgravity exposure.</p>
                
                <h3>Hemodynamic Changes</h3>
                <ul>
                    <li><strong>Fluid Redistribution:</strong> Cephalad fluid shift causing facial puffiness and sinus congestion</li>
                    <li><strong>Blood Volume:</strong> 15-20% plasma volume loss within first week</li>
                    <li><strong>Cardiac Output:</strong> 25-30% reduction due to decreased preload</li>
                    <li><strong>Stroke Volume:</strong> Significant reduction in ventricular filling</li>
                </ul>
                
                <h3>Cardiac Adaptations</h3>
                <ul>
                    <li><strong>Left Ventricular Mass:</strong> Reduction in heart muscle mass over time</li>
                    <li><strong>Heart Rate Variability:</strong> Altered autonomic nervous system regulation</li>
                    <li><strong>Contractility:</strong> Changes in cardiac muscle function</li>
                    <li><strong>Electrical Activity:</strong> Modifications in ECG patterns and arrhythmia risk</li>
                </ul>
                
                <h3>Vascular Changes</h3>
                <ul>
                    <li><strong>Arterial Stiffness:</strong> Increased vascular resistance and reduced compliance</li>
                    <li><strong>Endothelial Function:</strong> Impaired vasodilation and nitric oxide production</li>
                    <li><strong>Orthostatic Intolerance:</strong> 80% of astronauts experience symptoms upon return</li>
                    <li><strong>Carotid Artery:</strong> Structural and functional changes in major vessels</li>
                </ul>
                
                <h3>Regulatory Mechanisms</h3>
                <ul>
                    <li><strong>Baroreceptor Function:</strong> Altered blood pressure regulation</li>
                    <li><strong>Neurohumoral Control:</strong> Changes in catecholamine and renin-angiotensin systems</li>
                    <li><strong>Vestibular Integration:</strong> Disrupted balance and spatial orientation</li>
                    <li><strong>Exercise Response:</strong> Modified cardiovascular response to physical activity</li>
                </ul>
                
                <h3>Countermeasure Strategies</h3>
                <ul>
                    <li><strong>Exercise Protocols:</strong> COLPA and treadmill training showing 60-70% effectiveness</li>
                    <li><strong>Lower Body Negative Pressure:</strong> Simulating gravitational effects on circulation</li>
                    <li><strong>Fluid Loading:</strong> Pre-return protocols to restore blood volume</li>
                    <li><strong>Compression Garments:</strong> G-suits and thigh cuffs for orthostatic protection</li>
                </ul>
                
                <h3>Mission Duration Effects</h3>
                <p>Mars mission duration (30+ months) may result in severe cardiovascular deconditioning requiring advanced countermeasures and potentially pharmaceutical interventions for crew safety and mission success.</p>
            `,
    },
    "bone-muscle": {
      title: "Bone & Muscle Systems",
      content: `
                <h2>Bone & Muscle Systems in Microgravity</h2>
                <div class="research-meta" style="margin: 20px 0;">
                    <span>📊 145 Publications</span>
                    <span>🗓️ Bone Research, Muscle Biology</span>
                    <span>🎯 High Priority</span>
                    <span>🦴 Musculoskeletal Focus</span>
                </div>
                
                <h3>Executive Summary</h3>
                <p>Musculoskeletal deconditioning represents the most severe physiological consequence of long-duration spaceflight, with significant implications for crew health, mission performance, and post-flight recovery. Integrated bone and muscle loss creates complex challenges requiring multi-modal countermeasures.</p>
                
                <h3>Bone Loss Mechanisms</h3>
                <ul>
                    <li><strong>Remodeling Imbalance:</strong> Increased bone resorption, decreased formation</li>
                    <li><strong>Osteocyte Response:</strong> Mechanosensing cell adaptation to microgravity</li>
                    <li><strong>Hormonal Changes:</strong> Altered parathyroid hormone and calcitonin levels</li>
                    <li><strong>Calcium Metabolism:</strong> Negative calcium balance and hypercalciuria</li>
                </ul>
                
                <h3>Regional Bone Loss Patterns</h3>
                <ul>
                    <li><strong>Hip/Femur:</strong> 1.5-2.5% monthly loss in weight-bearing regions</li>
                    <li><strong>Lumbar Spine:</strong> 1.2-2.0% monthly vertebral bone loss</li>
                    <li><strong>Tibia:</strong> Significant trabecular and cortical bone changes</li>
                    <li><strong>Skull:</strong> Minimal changes in non-weight-bearing bones</li>
                </ul>
                
                <h3>Muscle Atrophy Characteristics</h3>
                <ul>
                    <li><strong>Fiber Type Changes:</strong> Slow-twitch to fast-twitch conversion</li>
                    <li><strong>Protein Synthesis:</strong> Decreased muscle protein synthesis rates</li>
                    <li><strong>Mitochondrial Function:</strong> Reduced oxidative capacity and enzyme activity</li>
                    <li><strong>Cross-Sectional Area:</strong> 20-30% reduction in muscle mass over 6 months</li>
                </ul>
                
                <h3>Functional Consequences</h3>
                <ul>
                    <li><strong>Strength Loss:</strong> 40-50% reduction in lower extremity strength</li>
                    <li><strong>Power Decline:</strong> Disproportionate loss of explosive power</li>
                    <li><strong>Endurance Capacity:</strong> Reduced aerobic and anaerobic performance</li>
                    <li><strong>Motor Control:</strong> Altered movement patterns and coordination</li>
                </ul>
                
                <h3>Exercise Countermeasures</h3>
                <ul>
                    <li><strong>ARED Protocol:</strong> Advanced Resistive Exercise Device showing 70-80% bone preservation</li>
                    <li><strong>Treadmill Training:</strong> Combined with harness system for locomotor patterns</li>
                    <li><strong>Cycle Ergometry:</strong> Cardiovascular and lower limb muscle maintenance</li>
                    <li><strong>Vibration Therapy:</strong> Whole-body vibration for bone stimulation</li>
                </ul>
                
                <h3>Pharmaceutical Interventions</h3>
                <ul>
                    <li><strong>Bisphosphonates:</strong> 40-60% reduction in bone loss with zoledronic acid</li>
                    <li><strong>PTH Analogs:</strong> Anabolic agents for bone formation stimulation</li>
                    <li><strong>Myostatin Inhibitors:</strong> Experimental treatments for muscle preservation</li>
                    <li><strong>Vitamin D/Calcium:</strong> Nutritional supplementation protocols</li>
                </ul>
                
                <h3>Recovery Timeline</h3>
                <p>Complete bone recovery requires 2-3 years post-flight, while muscle recovery occurs within 6-12 months. Mars mission duration may require pre-flight conditioning and in-flight pharmaceutical interventions.</p>
            `,
    },
    "plant-growth": {
      title: "Plant Growth Systems for Space Agriculture",
      content: `
                <h2>Plant Growth Systems for Space Agriculture</h2>
                <div class="research-meta" style="margin: 20px 0;">
                    <span>📊 34 Publications</span>
                    <span>🗓️ 2015-2024</span>
                    <span>🎯 Critical Need</span>
                    <span>🌱 12 Plant Species</span>
                </div>
                
                <h3>Executive Summary</h3>
                <p>Space agriculture research focuses on sustainable food production for long-duration missions. Advanced LED systems, hydroponic cultivation, and closed-loop nutrient cycling show promising results for Mars surface operations.</p>
                
                <h3>Key Technologies</h3>
                <ul>
                    <li><strong>LED Growth Systems:</strong> Spectrum-optimized lighting reduces power by 40%</li>
                    <li><strong>Hydroponic Cultivation:</strong> 95% water recovery efficiency achieved</li>
                    <li><strong>Automated Monitoring:</strong> AI-driven health assessment and intervention</li>
                    <li><strong>Genetic Selection:</strong> Dwarf cultivars optimized for space environments</li>
                </ul>
                
                <h3>Mission Critical Crops</h3>
                <ul>
                    <li>Lettuce - 30-day growth cycle, high vitamin content</li>
                    <li>Radishes - Fast growth, good caloric density</li>
                    <li>Tomatoes - Long-term psychological benefits</li>
                    <li>Wheat - Staple crop for Mars surface operations</li>
                </ul>
                
                <h3>Future Development</h3>
                <p>Focus on scaling systems for Mars habitats, developing robust seed storage, and creating closed-loop ecosystems with integrated waste recycling.</p>
            `,
    },
    "bone-density": {
      title: "Bone Density Loss in Long-Duration Spaceflight",
      content: `
                <h2>Bone Density Loss in Long-Duration Spaceflight</h2>
                <div class="research-meta" style="margin: 20px 0;">
                    <span>📊 Johnson et al. 2023</span>
                    <span>🗓️ Nature Microgravity</span>
                    <span>⭐ Impact: High</span>
                    <span>👥 ISS Study</span>
                </div>
                
                <h3>Study Overview</h3>
                <p>Six-month ISS study with 12 astronauts using advanced DXA scanning and biochemical markers to track bone mineral density changes and evaluate countermeasure effectiveness.</p>
                
                <h3>Critical Findings</h3>
                <ul>
                    <li><strong>Bone Loss Rate:</strong> 1.5% monthly loss in weight-bearing bones</li>
                    <li><strong>Regional Variation:</strong> Hip and spine most affected (up to 2.5% monthly)</li>
                    <li><strong>Recovery Time:</strong> 2-3 years for complete restoration</li>
                    <li><strong>Countermeasure Efficacy:</strong> Exercise reduces loss by 60-70%</li>
                </ul>
                
                <h3>Novel Treatment Protocols</h3>
                <p>Bisphosphonate treatment showed 40% reduction in bone loss rates when combined with exercise protocols. Weekly zoledronic acid administration proved most effective.</p>
                
                <h3>Mars Mission Implications</h3>
                <p>30-month mission duration could result in 45-50% bone loss without countermeasures. Combination therapy (exercise + pharmaceuticals + nutrition) essential for crew safety.</p>
                
                <h3>Recommendations</h3>
                <ul>
                    <li>Pre-flight bone density optimization</li>
                    <li>Daily 2.5-hour exercise protocols</li>
                    <li>Pharmaceutical intervention for missions >6 months</li>
                    <li>Enhanced calcium and vitamin D supplementation</li>
                </ul>
            `,
    },
  };

  const details = researchDetails[researchId] || {
    title: "Research Details",
    content: "<p>Detailed research information would be displayed here.</p>",
  };

  if (modalContent) {
    modalContent.innerHTML = details.content;
  }

  if (modal) {
    modal.style.display = "block";
  }
}

function closeModal() {
  const modal = document.getElementById("researchModal");
  if (modal) {
    modal.style.display = "none";
  }
}

// Initialize everything when page loads
document.addEventListener("DOMContentLoaded", function () {
  createStars();

  // Add filter functionality
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from other filters in the same group
      const group = this.parentElement;
      group
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));

      // Add active class to clicked filter
      this.classList.add("active");

      // Apply filter (could be expanded to actually filter content)
      console.log("Filter applied:", this.dataset.filter);
    });
  });

  // Close modal when clicking outside
  window.addEventListener("click", function (event) {
    const modal = document.getElementById("researchModal");
    if (event.target === modal) {
      closeModal();
    }
  });

  // Handle search box enter key
  const searchBox = document.getElementById("searchBox");
  if (searchBox) {
    searchBox.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        performSearch();
      }
    });
  }
});

// Search functionality
function performSearch() {
  const searchBox = document.getElementById("searchBox");
  const searchLoader = document.getElementById("searchLoader");

  if (!searchBox || !searchLoader) return;

  const query = searchBox.value.trim();

  if (!query) {
    alert("Please enter a search term");
    return;
  }

  searchLoader.style.display = "inline-block";

  // Simulate search delay
  setTimeout(() => {
    searchLoader.style.display = "none";

    // Switch to research tab and show results
    showTab("research");

    // Update results based on search
    updateSearchResults(query);
  }, 1500);
}

function updateSearchResults(query) {
  const resultsContainer = document.getElementById("research-results");
  if (!resultsContainer) return;

  resultsContainer.innerHTML = `
        <div style="padding: 20px; text-align: center; color: #4fc3f7;">
            <h3>Search Results for "${query}"</h3>
            <p style="margin: 15px 0; color: #b0bec5;">Found 23 relevant publications</p>
        </div>
        
        <div class="research-card" onclick="showResearchDetails('search-result-1')">
            <div class="research-title">Microgravity Effects on ${
              query.charAt(0).toUpperCase() + query.slice(1)
            } Metabolism</div>
            <div class="research-meta">
                <span>📊 Smith et al. 2024</span>
                <span>🗓️ Space Biology Journal</span>
                <span>⭐ Relevance: 95%</span>
            </div>
            <div class="research-summary">
                Comprehensive study examining the impact of microgravity on ${query} processes, revealing significant metabolic changes and potential countermeasures for long-duration space missions.
            </div>
            <div class="tags">
                <span class="tag">High Relevance</span>
                <span class="tag">${
                  query.charAt(0).toUpperCase() + query.slice(1)
                }</span>
                <span class="tag">Recent</span>
            </div>
        </div>
        
        <div class="research-card" onclick="showResearchDetails('search-result-2')">
            <div class="research-title">${
              query.charAt(0).toUpperCase() + query.slice(1)
            } Adaptation Strategies for Mars Missions</div>
            <div class="research-meta">
                <span>📊 Chen et al. 2023</span>
                <span>🗓️ Astrobiology Research</span>
                <span>⭐ Relevance: 87%</span>
            </div>
            <div class="research-summary">
                Novel approaches to ${query} challenges in deep space environments, including pharmaceutical interventions and environmental modifications for sustained human presence on Mars.
            </div>
            <div class="tags">
                <span class="tag">Mars Mission</span>
                <span class="tag">${
                  query.charAt(0).toUpperCase() + query.slice(1)
                }</span>
                <span class="tag">Countermeasures</span>
            </div>
        </div>
        
        <div class="research-card" onclick="showResearchDetails('search-result-3')">
            <div class="research-title">AI-Driven Analysis of ${
              query.charAt(0).toUpperCase() + query.slice(1)
            } Data from ISS Experiments</div>
            <div class="research-meta">
                <span>📊 Rodriguez et al. 2024</span>
                <span>🗓️ Space Medicine AI</span>
                <span>⭐ Relevance: 82%</span>
            </div>
            <div class="research-summary">
                Machine learning approaches to ${query} research analysis, identifying patterns and predictive models for crew health monitoring and intervention strategies.
            </div>
            <div class="tags">
                <span class="tag">AI/ML</span>
                <span class="tag">${
                  query.charAt(0).toUpperCase() + query.slice(1)
                }</span>
                <span class="tag">Predictive Models</span>
            </div>
        </div>
    `;
}
