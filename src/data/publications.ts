import { Publication } from '../types';

// Sample subset of hypothetical NASA bioscience publications (publicly oriented mock data)
export const publications: Publication[] = [
  {
    id: 'pub-root-iss',
    title: 'Root Morphogenesis Adaptations in Microgravity aboard ISS',
    authors: ['Nguyen T', 'Hart M', 'Lopez A'],
    journal: 'Space Plant Biology',
    year: 2023,
    doi: '10.1000/mock.iss.root',
    category: 'plant biology',
    abstract: 'Plant root growth study aboard ISS reveals adaptive growth pattern modulation, stress attenuation mechanisms, and altered auxin gradient signaling in microgravity.'
  },
  {
    id: 'pub-muscle-artemis',
    title: 'Projected Skeletal Muscle Atrophy Trajectories for Lunar Gateway Missions',
    authors: ['Patel R', 'Chen L'],
    journal: 'Journal of Space Physiology',
    year: 2024,
    doi: '10.1000/mock.muscle.gateway',
    category: 'human physiology',
    abstract: 'Microgravity induced muscle atrophy risk assessment for Artemis transit phases using combined resistance exercise countermeasure models and metabolic profiling.'
  },
  {
    id: 'pub-microbe-radiation',
    title: 'Radiation Resilience Signatures in Spaceflight-Exposed Microbial Consortia',
    authors: ['Singh D', 'Garcia P'],
    journal: 'AstroMicro Reports',
    year: 2022,
    doi: '10.1000/mock.microbe.rad',
    category: 'microbiology',
    abstract: 'Space radiation stress responses in microbial biofilm consortia indicate emergent resistance pathways, DNA repair enhancement, and metabolic network plasticity under combined microgravity and radiation exposure.'
  },
  {
    id: 'pub-bone-loss',
    title: 'Long-Duration Bone Density Decline Patterns and Countermeasure Integration',
    authors: ['Khan A', 'Ortiz J'],
    journal: 'Frontiers in Space Medicine',
    year: 2024,
    doi: '10.1000/mock.bone.long',
    category: 'human physiology',
    abstract: 'Long-duration spaceflight bone density decline modeling integrating nutritional, exercise, and pharmacological countermeasure layers for predictive mission health planning.'
  }
];
