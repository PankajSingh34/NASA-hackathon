export interface ResearchArea {
  id: string;
  title: string;
  description: string;
  category: string;
  publications: number;
  keyResearchers: string[];
  link: string;
  detailedDescription: string;
  keyFindings: string[];
  futureDirections: string[];
  relevantMissions: string[];
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi: string;
  category: string;
  abstract: string;
}

export interface Mission {
  id: string;
  name: string;
  year: number;
  description: string;
  experiments: string[];
  status: string;
}

export interface Researcher {
  id: string;
  name: string;
  institution: string;
  expertise: string[];
  publications: string[];
}

export interface KnowledgeNode {
  id: string;
  type: 'research' | 'publication' | 'mission' | 'researcher';
  title: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  connections: string[];
}

// Advanced AI Insight Structures
export interface InsightConfidence {
  score: number; // 0-1 normalized confidence
  tier: 'emerging' | 'supported' | 'robust' | 'anomalous';
  evidenceCount: number;
  contributors: string[]; // feature / parameter ids
  uncertainty: { lower: number; upper: number }; // 95% CI style bounds
}

export interface InsightProvenance {
  sessionId: string;
  derivedFrom: string[]; // simulation run ids or dataset hashes
  generatedAt: string; // ISO timestamp
  reproducibilitySeed: string;
  integrityHash?: string; // optional hash for tamper detection
}

export interface ExtendedAIInsight {
  id: string;
  category: string;
  title: string;
  narrative: string;
  type: 'prediction' | 'anomaly' | 'optimization' | 'warning' | 'discovery';
  confidence: InsightConfidence;
  provenance: InsightProvenance;
  metrics?: Record<string, number>;
  related?: string[]; // ids of related insights
  recommendations?: string[];
}

// Mission / Scenario System
export interface MissionStage {
  id: string;
  title: string;
  objective: string;
  successCriteria: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'extreme';
  dependencies?: string[]; // stage ids
  estimatedDurationHours?: number;
}

export interface GeneratedMission {
  id: string;
  seed: string;
  title: string;
  narrativeHook: string;
  stages: MissionStage[];
  difficulty: 'training' | 'standard' | 'advanced' | 'critical';
  tags: string[];
  createdAt: string;
}

// Ecosystem Simulation
export interface OrganismGenome {
  id: string;
  species: string;
  traits: {
    radiationResistance: number;
    growthRate: number;
    mutationRate: number;
    resourceEfficiency: number;
    stressTolerance: number;
  };
  lineage?: string[]; // ancestor genome ids
}

export interface EcosystemState {
  id: string;
  tick: number;
  timestamp: string;
  environment: {
    temperature: number;
    radiation: number;
    gravity: number;
    pressure: number;
    nutrients: number;
    lightIntensity: number;
  };
  populations: Array<{
    genomeId: string;
    count: number;
    healthIndex: number;
    diversityIndex: number;
  }>;
  stabilityScore: number;
  resilienceScore: number;
}

// Crew Agents
export interface CrewAgent {
  id: string;
  role: 'Engineer' | 'Botanist' | 'AI' | 'Commander' | 'Medic';
  competence: number; // 0-1
  stress: number; // 0-1
  fatigue: number; // 0-1
  morale: number; // 0-1
  specialization: string[];
  currentTask?: string;
  decisionLog?: string[];
}

// Replay Event Log
export interface EventLogEntry {
  id: string;
  type: string;
  timestamp: string;
  tick: number;
  summary: string;
  payload?: any;
}

// Optimization
export interface OptimizationResult {
  id: string;
  frontierPoints: Array<{ id: string; objectives: Record<string, number>; dominated: boolean }>;
  bestConfig: Record<string, any>;
  evaluated: number;
  seed: string;
  completedAt: string;
}

// Scenario Cartridge
export interface ScenarioCartridge {
  id: string;
  name: string;
  description: string;
  version: string;
  environmentPreset: Partial<EcosystemState['environment']>;
  startingGenomes: OrganismGenome[];
  mission?: Partial<GeneratedMission>;
  challenges: string[];
  author?: string;
  createdAt: string;
}

// Physiology & Human Simulation
export interface HumanState {
  time: number; // days
  boneDensity: number; // % baseline (0-1)
  muscleMass: number; // % baseline (0-1)
  bloodFlowIndex: number; // 0-1
  radiationDose: number; // mSv accumulated
  fatigue: number; // 0-1
  stressLoad: number; // 0-1
  recoveryPotential: number; // 0-1 predicted rebound factor
}

export interface EnvironmentState {
  gravity: number; // 0-1+ (1 = Earth)
  oxygen: number; // fraction 0-1
  radiation: number; // 0-1 scaled
  water: number; // 0-1 availability
  nutrition: number; // 0-1
}

export interface ScenarioProfile {
  id: string;
  label: string;
  durationDays: number;
  gravity: number;
  oxygen: number;
  radiation: number;
  water: number;
  nutrition: number;
  description: string;
  tags: string[];
}

export interface LedgerEntry {
  index: number;
  timestamp: string;
  snapshotHash: string;
  prevHash: string | null;
  payloadRef: string; // optional short summary
}

export interface TamperEvent {
  id: string;
  timestamp: string;
  field: string;
  expectedHash: string;
  actualHash: string;
  severity: 'low' | 'high' | 'critical';
}

export interface NewsItem {
  id: string;
  timestamp: string;
  headline: string;
  category: 'physiology' | 'botany' | 'mission' | 'security' | 'anomaly';
  severity: 'info' | 'warning' | 'alert' | 'critical';
  relatedIds?: string[];
}

// --- Publication Summaries & Knowledge Graph Extensions ---
export interface PublicationSummaryProvenance {
  publicationId: string;
  generatedAt: string; // ISO timestamp
  algorithmVersion: string;
  reproducibilitySeed: string;
  integrityHash?: string;
}

export interface PublicationSummary {
  id: string;
  publicationId: string;
  keyFindings: string[];
  methods: string[];
  organisms: string[];
  missionsReferenced: string[];
  riskFactors: string[];
  keywords: string[];
  provenance: PublicationSummaryProvenance;
}

export interface GraphEdgeConfidence {
  weight: number; // 0-1 normalized association strength
  evidenceCount: number;
  tier: 'low' | 'medium' | 'high';
}

export interface EntityRelation {
  id: string;
  a: string; // node id
  b: string; // node id
  relationType: string; // e.g. "co-occurs", "influences", "studied_in"
  confidence: GraphEdgeConfidence;
  provenanceRef?: string; // summary / dataset / run id
}

// --- Countermeasures & Predictive Modeling ---
export interface Countermeasure {
  id: string;
  name: string;
  category: 'exercise' | 'pharmaceutical' | 'nutrition' | 'behavioral' | 'radiation';
  description: string;
  efficacyTargets: Partial<Record<keyof HumanState, number>>; // fractional improvement factors
  evidenceLevel: 'emerging' | 'moderate' | 'strong';
  sideEffects?: string[];
  dosingGuidelines?: string;
  references?: string[]; // DOIs or internal ids
}

export interface InterventionScheduleEntry {
  day: number; // day index in simulation
  countermeasureId: string;
  dose?: string;
}

export interface InterventionPlan {
  id: string;
  schedule: InterventionScheduleEntry[];
  createdAt: string;
  label?: string;
}

export interface ProjectionResult {
  trajectory: HumanState[];
  insights: ExtendedAIInsight[];
  appliedPlan?: InterventionPlan;
  baselineComparison?: {
    metricDeltas: Record<string, number>; // final - baseline end value improvements
  };
}

// --- Life Support & Resource Systems ---
export interface LifeSupportModule {
  id: string;
  name: string;
  type: 'algae-bioreactor' | 'hydroponics' | 'water-recycler' | 'air-scrubber' | 'waste-processor' | 'fungal-reactor' | 'solar-array';
  oxygenGenRate?: number; // O2 units / hour
  waterRecycleRate?: number; // liters / hour
  co2ScrubRate?: number; // CO2 units / hour
  biomassOutputRate?: number; // edible biomass units / hour
  energyOutput?: number; // kWh / hour
  maintenanceLoad?: number; // crew time fraction / hour
  efficiency?: number; // 0-1
}

export interface ResourceState {
  timestamp: string;
  tick: number; // hours since start
  oxygen: number; // units
  carbonDioxide: number; // units
  water: number; // liters
  biomass: number; // edible mass units
  energy: number; // kWh stored
  waste: number; // units pending processing
  warnings?: ResourceWarning[];
}

export interface ResourceWarning {
  id: string;
  type: 'oxygen-low' | 'water-low' | 'energy-low' | 'co2-high' | 'waste-high';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  atTick: number;
}

export interface LifeSupportStepResult {
  state: ResourceState;
  sustainabilityIndex: number; // heuristic 0-1
  warningFlags: string[];
  moduleMetrics: Record<string, number>; // aggregated contributions
}
