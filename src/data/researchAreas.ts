import { ResearchArea } from '../types';

export const researchAreas: ResearchArea[] = [
  {
    id: 'plant-growth',
    title: 'Plant Growth in Microgravity',
    description: 'Understanding how plants grow and develop in the unique conditions of space, including altered gravity, radiation exposure, and confined growing environments.',
    category: 'Botany',
    publications: 156,
    keyResearchers: ['Dr. Anna-Lisa Paul', 'Dr. Robert Ferl', 'Dr. Gioia Massa'],
    link: '/research/plant-growth',
    detailedDescription: 'Plant growth in microgravity represents one of the most critical research areas for long-duration space missions. The absence of gravitational cues fundamentally alters how plants orient themselves, distribute resources, and respond to environmental stimuli. This research encompasses everything from basic cellular processes to complex plant architecture and reproduction systems.',
    keyFindings: [
      'Plants can complete full life cycles in microgravity environments',
      'Root growth patterns are significantly altered without gravitational guidance',
      'Gene expression changes affect cell wall formation and stress responses',
      'Water and nutrient distribution requires specialized delivery systems',
      'Light direction becomes the primary growth orientation cue'
    ],
    futureDirections: [
      'Development of closed-loop life support systems',
      'Optimization of plant varieties for space cultivation',
      'Investigation of multi-generational effects',
      'Integration with bioregenerative agricultural systems'
    ],
    relevantMissions: ['Veggie', 'Advanced Plant Habitat', 'Plant Habitat-04']
  },
  {
    id: 'microbial-behavior',
    title: 'Microbial Behavior in Space',
    description: 'Investigating how microorganisms adapt to the space environment and their potential applications in biotechnology and life support systems.',
    category: 'Microbiology',
    publications: 203,
    keyResearchers: ['Dr. Cheryl Nickerson', 'Dr. Sarah Castro', 'Dr. Mark Ott'],
    link: '/research/microbial-behavior',
    detailedDescription: 'The behavior of microorganisms in space environments provides crucial insights into fundamental biological processes and has significant implications for crew health, contamination control, and biotechnology applications. Microgravity affects bacterial growth rates, biofilm formation, antibiotic resistance, and metabolic pathways.',
    keyFindings: [
      'Enhanced virulence in certain pathogenic bacteria under microgravity',
      'Altered biofilm formation patterns affect surface colonization',
      'Changes in antibiotic susceptibility pose challenges for crew health',
      'Modified metabolic pathways offer biotechnology opportunities',
      'Quorum sensing mechanisms are disrupted in space conditions'
    ],
    futureDirections: [
      'Development of space-specific antimicrobial strategies',
      'Harnessing beneficial microbial processes for life support',
      'Understanding long-term microbial evolution in space',
      'Microbiome maintenance for crew health'
    ],
    relevantMissions: ['Micro-15', 'Antimicrobial Resistance', 'Microbes in Space']
  },
  {
    id: 'omics-studies',
    title: 'Omics Studies in Space Biology',
    description: 'Comprehensive molecular analysis including genomics, proteomics, and metabolomics to understand space-induced biological changes.',
    category: 'Molecular Biology',
    publications: 89,
    keyResearchers: ['Dr. Jeffrey Richards', 'Dr. Sylvain Costes', 'Dr. Anil Menon'],
    link: '/research/omics-studies',
    detailedDescription: 'Omics technologies provide unprecedented insights into how space environments affect biological systems at the molecular level. These studies examine changes in gene expression, protein production, and metabolic pathways across various organisms exposed to microgravity, radiation, and other space stressors.',
    keyFindings: [
      'Significant alterations in gene expression patterns within hours of spaceflight',
      'Protein folding and stability affected by microgravity conditions',
      'Metabolic pathway shifts indicate cellular stress responses',
      'Epigenetic modifications may have long-lasting effects',
      'Species-specific responses vary widely across organisms'
    ],
    futureDirections: [
      'Multi-omics integration for systems-level understanding',
      'Real-time molecular monitoring during spaceflight',
      'Development of space-specific biomarkers',
      'Personalized medicine approaches for astronauts'
    ],
    relevantMissions: ['Twins Study', 'Tissue Chips in Space', 'Cell Science experiments']
  },
  {
    id: 'human-physiology',
    title: 'Human Physiology in Space',
    description: 'Studying the effects of microgravity and radiation on human physiological systems during spaceflight.',
    category: 'Human Biology',
    publications: 312,
    keyResearchers: ['Dr. Scott Kelly', 'Dr. Jessica Meir', 'Dr. Luca Parmitano'],
    link: '/research/human-physiology',
    detailedDescription: 'Human physiological adaptation to space represents one of the most complex and critical areas of space biology research. The human body undergoes numerous changes during spaceflight, affecting virtually every organ system and presenting significant challenges for long-duration missions.',
    keyFindings: [
      'Bone density loss occurs at rates of 1-2% per month',
      'Cardiovascular deconditioning affects exercise capacity',
      'Muscle atrophy and strength loss impact crew performance',
      'Vision changes (SANS) affect significant percentage of crew',
      'Immune system dysregulation increases infection risk'
    ],
    futureDirections: [
      'Development of effective countermeasures',
      'Understanding individual variation in responses',
      'Long-term health monitoring protocols',
      'Optimization of crew selection criteria'
    ],
    relevantMissions: ['ISS Medical Monitoring', 'Twins Study', 'Cardinal Muscle']
  },
  {
    id: 'reproductive-biology',
    title: 'Reproductive Biology in Space',
    description: 'Examining the effects of space environments on reproductive systems and developmental biology.',
    category: 'Developmental Biology',
    publications: 67,
    keyResearchers: ['Dr. April Ronca', 'Dr. Ruth Globus', 'Dr. Virginia Ferguson'],
    link: '/research/reproductive-biology',
    detailedDescription: 'Understanding reproductive biology in space is crucial for long-term human space exploration and colonization. This research examines how microgravity and radiation affect fertility, embryonic development, and reproductive health across multiple species.',
    keyFindings: [
      'Successful mammalian reproduction possible in simulated microgravity',
      'Embryonic development shows altered patterns in space conditions',
      'Hormonal regulation may be affected by space environments',
      'Radiation exposure poses risks to reproductive cells',
      'Multi-generational studies show adaptive responses'
    ],
    futureDirections: [
      'Investigation of human reproductive health in space',
      'Development of reproductive countermeasures',
      'Study of multi-generational space populations',
      'Optimization of assisted reproductive technologies'
    ],
    relevantMissions: ['Rodent Research', 'Cell Biology Experiment Facility']
  },
  {
    id: 'radiation-dna-repair',
    title: 'Radiation Effects & DNA Repair',
    description: 'Understanding how cosmic radiation affects living organisms and the biological mechanisms of DNA repair.',
    category: 'Radiation Biology',
    publications: 134,
    keyResearchers: ['Dr. Honglu Wu', 'Dr. Lisa Simonsen', 'Dr. Janice Huff'],
    link: '/research/radiation-dna-repair',
    detailedDescription: 'Space radiation represents one of the most significant hazards for long-duration spaceflight and planetary exploration. This research focuses on understanding how galactic cosmic rays and solar particle events affect biological systems and the cellular mechanisms that repair radiation damage.',
    keyFindings: [
      'High-energy particles cause complex DNA damage patterns',
      'DNA repair mechanisms show varying efficiency across species',
      'Chronic low-dose exposure effects differ from acute exposure',
      'Radiation sensitivity varies by cell type and age',
      'Shielding effectiveness depends on particle type and energy'
    ],
    futureDirections: [
      'Development of biological radioprotectors',
      'Personalized radiation risk assessment',
      'Advanced shielding material research',
      'Real-time radiation exposure monitoring'
    ],
    relevantMissions: ['Space Radiation Laboratory experiments', 'ISS Radiation studies']
  },
  {
    id: 'bioregenerative-life-support',
    title: 'Bioregenerative Life Support Systems',
    description: 'Developing biological systems for air, water, and food production during long-duration space missions.',
    category: 'Life Support',
    publications: 98,
    keyResearchers: ['Dr. Raymond Wheeler', 'Dr. Cary Mitchell', 'Dr. Bruce Bugbee'],
    link: '/research/bioregenerative-life-support',
    detailedDescription: 'Bioregenerative life support systems represent the future of sustainable space exploration, using biological processes to recycle air, water, and waste while producing food. These closed-loop systems are essential for long-duration missions to Mars and beyond.',
    keyFindings: [
      'Plants can effectively recycle CO2 and produce oxygen',
      'Waste processing through biological systems reduces resupply needs',
      'Integrated plant-microbe systems enhance nutrient cycling',
      'System reliability requires redundancy and monitoring',
      'Crew psychological benefits from fresh food production'
    ],
    futureDirections: [
      'Optimization of crop selection for space conditions',
      'Integration with physical-chemical life support',
      'Automation and autonomous system management',
      'Scaling systems for different mission durations'
    ],
    relevantMissions: ['Vegetable Production System', 'Advanced Plant Habitat']
  },
  {
    id: 'stress-response',
    title: 'Cellular Stress Response Mechanisms',
    description: 'Investigating how cells respond to the unique stressors of the space environment.',
    category: 'Cell Biology',
    publications: 176,
    keyResearchers: ['Dr. Ye Zhang', 'Dr. Nathaniel Szewczyk', 'Dr. Candice Limoli'],
    link: '/research/stress-response',
    detailedDescription: 'Cellular stress response mechanisms are fundamental to understanding how life adapts to space environments. These studies examine how cells detect, respond to, and adapt to various space-related stressors including microgravity, radiation, and altered atmospheric conditions.',
    keyFindings: [
      'Heat shock protein expression increases under space conditions',
      'Oxidative stress markers elevated in spaceflight',
      'Cellular autophagy processes are altered',
      'Stress granule formation patterns change in microgravity',
      'Cross-resistance between different stressors observed'
    ],
    futureDirections: [
      'Development of stress response biomarkers',
      'Therapeutic targeting of stress pathways',
      'Understanding adaptive vs. maladaptive responses',
      'Species comparison of stress resistance mechanisms'
    ],
    relevantMissions: ['Cell Biology experiments', 'Tissue Chips in Space']
  },
  {
    id: 'data-repositories',
    title: 'Space Biology Data Repositories',
    description: 'Comprehensive databases and computational resources for space biology research data and analysis.',
    category: 'Bioinformatics',
    publications: 45,
    keyResearchers: ['Dr. Sylvain Costes', 'Dr. Sharmila Bhattacharya', 'Dr. Simon Gilroy'],
    link: '/research/data-repositories',
    detailedDescription: 'Space biology generates vast amounts of complex data requiring specialized repositories and analytical tools. These resources enable researchers worldwide to access, analyze, and integrate space biology datasets for accelerated discovery.',
    keyFindings: [
      'Standardized data formats improve cross-study comparisons',
      'Machine learning approaches reveal hidden patterns',
      'Meta-analyses increase statistical power of findings',
      'Open data policies accelerate scientific progress',
      'Integrated omics datasets provide systems-level insights'
    ],
    futureDirections: [
      'Real-time data streaming from space experiments',
      'AI-powered analysis and prediction tools',
      'Standardization of experimental protocols',
      'Enhanced data visualization and exploration tools'
    ],
    relevantMissions: ['GeneLab Data System', 'Life Sciences Data Archive']
  },
  {
    id: 'bio-manufacturing',
    title: 'Biomanufacturing in Space',
    description: 'Exploring the potential for producing pharmaceuticals, materials, and other products using biological systems in space.',
    category: 'Biotechnology',
    publications: 52,
    keyResearchers: ['Dr. Sharmila Bhattacharya', 'Dr. Timothy Hammond', 'Dr. Liz Warren'],
    link: '/research/bio-manufacturing',
    detailedDescription: 'Biomanufacturing in space takes advantage of unique microgravity conditions to produce high-value products that cannot be made on Earth. This includes protein crystallization, cell culture systems, and novel material production using biological processes.',
    keyFindings: [
      'Protein crystals grow larger and more perfect in microgravity',
      '3D tissue constructs develop differently without gravity',
      'Pharmaceutical production may benefit from space conditions',
      'Microbial production systems adapt to space environments',
      'Novel materials possible through space-based bioprocessing'
    ],
    futureDirections: [
      'Commercial viability assessment of space manufacturing',
      'Automated bioreactor systems for space',
      'Integration with space-based supply chains',
      'Regulatory framework development for space products'
    ],
    relevantMissions: ['Protein Crystal Growth experiments', 'Tissue Chips in Space']
  },
  {
    id: 'cardiovascular',
    title: 'Cardiovascular System Research',
    description: 'Studying how the cardiovascular system adapts to microgravity and develops countermeasures.',
    category: 'Human Biology',
    publications: 187,
    keyResearchers: ['Dr. Benjamin Levine', 'Dr. Lori Ploutz-Snyder', 'Dr. Michael Bungo'],
    link: '/research/cardiovascular',
    detailedDescription: 'The cardiovascular system undergoes significant adaptation to microgravity, including fluid shifts, cardiac deconditioning, and altered blood pressure regulation. Understanding these changes is crucial for maintaining crew health and performance.',
    keyFindings: [
      'Rapid fluid shift from legs to head upon entering microgravity',
      'Cardiac muscle atrophy occurs during long-duration flights',
      'Orthostatic intolerance common upon return to Earth',
      'Exercise countermeasures partially effective',
      'Individual variation in cardiovascular adaptation significant'
    ],
    futureDirections: [
      'Personalized exercise prescriptions',
      'Pharmacological countermeasure development',
      'Real-time cardiovascular monitoring systems',
      'Long-term cardiovascular health assessment'
    ],
    relevantMissions: ['Cardiovascular Health Consequences', 'Integrated Cardiovascular']
  },
  {
    id: 'bone-muscle',
    title: 'Bone & Muscle Systems',
    description: 'Research on musculoskeletal changes in microgravity and development of exercise countermeasures.',
    category: 'Human Biology',
    publications: 228,
    keyResearchers: ['Dr. Scott Smith', 'Dr. Jean Sibonga', 'Dr. Lori Ploutz-Snyder'],
    link: '/research/bone-muscle',
    detailedDescription: 'The musculoskeletal system experiences some of the most dramatic changes during spaceflight, with rapid bone loss and muscle atrophy presenting significant challenges for crew health and mission success.',
    keyFindings: [
      'Bone loss rates of 1-2% per month in weight-bearing bones',
      'Muscle mass decreases rapidly without gravitational loading',
      'Exercise equipment effectiveness varies by body region',
      'Nutrition plays critical role in bone metabolism',
      'Recovery time on Earth exceeds flight duration'
    ],
    futureDirections: [
      'Advanced exercise countermeasure protocols',
      'Pharmaceutical interventions for bone loss',
      'Real-time bone density monitoring',
      'Personalized countermeasure approaches'
    ],
    relevantMissions: ['Advanced Resistive Exercise Device', 'Bone Densitometry']
  }
];