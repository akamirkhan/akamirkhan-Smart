import type {
  Standard,
  Laboratory,
  CertificationScheme,
  HallmarkingInformation,
  ConsumerQuery,
  AssistantMessage,
  SourceReference,
  CertificationAssessment,
} from '@/types';

// ============================================================
// Mock / Demo Data
// ============================================================
// IMPORTANT: All data below is clearly DEMO data for UI/UX
// demonstration only. It does NOT represent real BIS standards,
// laboratories, certification requirements or official information.
// Phase 2 will replace this with real data from BIS knowledge base.
// ============================================================

const DEMO_NOTE = 'This is demonstration data for UI purposes only.';

// ---- Demo Standards ----

export const DEMO_STANDARDS: Standard[] = [
  {
    id: 'std-001',
    identifier: 'IS-DEMO-001',
    title: 'Demo: Safety requirements for electrical household appliances',
    description: `${DEMO_NOTE} Placeholder record representing a product safety standard for electrical appliances.`,
    category: 'Electrical & Electronics',
    industry: 'Manufacturing',
    type: 'safety',
    status: 'active',
    publishedYear: 2023,
    lastUpdated: '2024-01-15',
    scope: 'Demo scope: Covers general safety requirements for electrical appliances intended for household use.',
    keyRequirements: [
      'Demo requirement: Insulation and dielectric strength',
      'Demo requirement: Temperature rise limits',
      'Demo requirement: Mechanical strength and stability',
    ],
    relatedStandards: ['IS-DEMO-002', 'IS-DEMO-003'],
    certificationRelevant: true,
    testingRelevant: true,
    isDemo: true,
  },
  {
    id: 'std-002',
    identifier: 'IS-DEMO-002',
    title: 'Demo: Test methods for electrical safety of appliances',
    description: `${DEMO_NOTE} Placeholder record representing a test method standard.`,
    category: 'Electrical & Electronics',
    industry: 'Manufacturing',
    type: 'test-method',
    status: 'active',
    publishedYear: 2022,
    lastUpdated: '2023-08-10',
    scope: 'Demo scope: Describes standardized test methods for verifying electrical safety.',
    keyRequirements: [
      'Demo test: Dielectric strength test procedure',
      'Demo test: Leakage current measurement',
      'Demo test: Temperature rise test',
    ],
    relatedStandards: ['IS-DEMO-001'],
    certificationRelevant: true,
    testingRelevant: true,
    isDemo: true,
  },
  {
    id: 'std-003',
    identifier: 'IS-DEMO-003',
    title: 'Demo: Food safety management system requirements',
    description: `${DEMO_NOTE} Placeholder record representing a management system standard for food safety.`,
    category: 'Food & Agriculture',
    industry: 'Food Processing',
    type: 'management-system',
    status: 'active',
    publishedYear: 2021,
    lastUpdated: '2023-11-20',
    scope: 'Demo scope: Outlines requirements for a food safety management system.',
    keyRequirements: [
      'Demo requirement: Hazard analysis and risk control',
      'Demo requirement: Process documentation and traceability',
      'Demo requirement: Continuous improvement framework',
    ],
    relatedStandards: ['IS-DEMO-004'],
    certificationRelevant: true,
    testingRelevant: false,
    isDemo: true,
  },
  {
    id: 'std-004',
    identifier: 'IS-DEMO-004',
    title: 'Demo: Packaging and labeling requirements for food products',
    description: `${DEMO_NOTE} Placeholder record representing a packaging and labeling standard.`,
    category: 'Food & Agriculture',
    industry: 'Food Processing',
    type: 'product',
    status: 'under-revision',
    publishedYear: 2020,
    lastUpdated: '2023-06-05',
    scope: 'Demo scope: Covers packaging material, labeling, and declaration requirements.',
    keyRequirements: [
      'Demo requirement: Nutritional information declaration',
      'Demo requirement: Allergen labeling',
      'Demo requirement: Date marking and storage conditions',
    ],
    relatedStandards: ['IS-DEMO-003'],
    certificationRelevant: true,
    testingRelevant: false,
    isDemo: true,
  },
  {
    id: 'std-005',
    identifier: 'IS-DEMO-005',
    title: 'Demo: Building materials — cement specification',
    description: `${DEMO_NOTE} Placeholder record representing a building material specification standard.`,
    category: 'Building & Construction',
    industry: 'Construction',
    type: 'product',
    status: 'active',
    publishedYear: 2019,
    lastUpdated: '2023-03-12',
    scope: 'Demo scope: Specifies requirements and test methods for cement used in construction.',
    keyRequirements: [
      'Demo requirement: Compressive strength at various ages',
      'Demo requirement: Setting time and fineness',
      'Demo requirement: Chemical composition limits',
    ],
    relatedStandards: ['IS-DEMO-006'],
    certificationRelevant: true,
    testingRelevant: true,
    isDemo: true,
  },
  {
    id: 'std-006',
    identifier: 'IS-DEMO-006',
    title: 'Demo: Methods of test for cement',
    description: `${DEMO_NOTE} Placeholder record representing a test method standard for cement.`,
    category: 'Building & Construction',
    industry: 'Construction',
    type: 'test-method',
    status: 'active',
    publishedYear: 2018,
    lastUpdated: '2022-12-01',
    scope: 'Demo scope: Describes test procedures for evaluating cement properties.',
    keyRequirements: [
      'Demo test: Sampling and preparation',
      'Demo test: Physical property determination',
      'Demo test: Chemical analysis procedures',
    ],
    relatedStandards: ['IS-DEMO-005'],
    certificationRelevant: false,
    testingRelevant: true,
    isDemo: true,
  },
  {
    id: 'std-007',
    identifier: 'IS-DEMO-007',
    title: 'Demo: Textile fabric — quality and testing requirements',
    description: `${DEMO_NOTE} Placeholder record representing a textile quality standard.`,
    category: 'Textiles',
    industry: 'Textiles',
    type: 'product',
    status: 'active',
    publishedYear: 2022,
    lastUpdated: '2024-02-01',
    scope: 'Demo scope: Covers quality parameters and testing for textile fabrics.',
    keyRequirements: [
      'Demo requirement: Fiber composition declaration',
      'Demo requirement: Colorfastness requirements',
      'Demo requirement: Dimensional stability limits',
    ],
    relatedStandards: [],
    certificationRelevant: true,
    testingRelevant: true,
    isDemo: true,
  },
  {
    id: 'std-008',
    identifier: 'IS-DEMO-008',
    title: 'Demo: Plastic materials — safety and performance',
    description: `${DEMO_NOTE} Placeholder record representing a plastic materials standard.`,
    category: 'Chemicals & Plastics',
    industry: 'Manufacturing',
    type: 'safety',
    status: 'draft',
    publishedYear: 2024,
    lastUpdated: '2024-05-15',
    scope: 'Demo scope: Addresses safety and performance requirements for plastic materials.',
    keyRequirements: [
      'Demo requirement: Migration limits for food contact',
      'Demo requirement: Mechanical performance thresholds',
      'Demo requirement: Environmental resistance',
    ],
    relatedStandards: [],
    certificationRelevant: false,
    testingRelevant: true,
    isDemo: true,
  },
];

// ---- Demo Laboratories ----

export const DEMO_LABORATORIES: Laboratory[] = [
  {
    id: 'lab-001',
    name: 'Demo Testing Laboratory — North',
    location: 'New Delhi, Delhi NCR',
    state: 'Delhi NCR',
    capabilities: ['Electrical Safety Testing', 'Performance Testing', 'Environmental Testing'],
    productCategories: ['Electrical & Electronics', 'Consumer Goods'],
    recognition: 'demo',
    recognitionLabel: 'Demo Data',
    contact: 'contact@demo-lab-north.example',
    isDemo: true,
  },
  {
    id: 'lab-002',
    name: 'Demo Analytical Laboratory — West',
    location: 'Mumbai, Maharashtra',
    state: 'Maharashtra',
    capabilities: ['Chemical Analysis', 'Microbiological Testing', 'Food Testing'],
    productCategories: ['Food & Agriculture', 'Chemicals & Plastics'],
    recognition: 'demo',
    recognitionLabel: 'Demo Data',
    contact: 'info@demo-lab-west.example',
    isDemo: true,
  },
  {
    id: 'lab-003',
    name: 'Demo Materials Testing Lab — South',
    location: 'Bengaluru, Karnataka',
    state: 'Karnataka',
    capabilities: ['Mechanical Testing', 'Building Material Testing', 'Thermal Analysis'],
    productCategories: ['Building & Construction', 'Mechanical Engineering'],
    recognition: 'demo',
    recognitionLabel: 'Demo Data',
    contact: 'lab@demo-lab-south.example',
    isDemo: true,
  },
  {
    id: 'lab-004',
    name: 'Demo Textile Testing Centre',
    location: 'Surat, Gujarat',
    state: 'Gujarat',
    capabilities: ['Textile Testing', 'Colorfastness Testing', 'Fiber Analysis'],
    productCategories: ['Textiles'],
    recognition: 'demo',
    recognitionLabel: 'Demo Data',
    contact: 'textiles@demo-lab-gujarat.example',
    isDemo: true,
  },
  {
    id: 'lab-005',
    name: 'Demo Automotive Testing Facility',
    location: 'Chennai, Tamil Nadu',
    state: 'Tamil Nadu',
    capabilities: ['Automotive Testing', 'Emissions Testing', 'Mechanical Testing'],
    productCategories: ['Automotive', 'Mechanical Engineering'],
    recognition: 'demo',
    recognitionLabel: 'Demo Data',
    contact: 'auto@demo-lab-chennai.example',
    isDemo: true,
  },
  {
    id: 'lab-006',
    name: 'Demo Electrical Safety Lab',
    location: 'Hyderabad, Telangana',
    state: 'Telangana',
    capabilities: ['Electrical Safety Testing', 'EMC Testing', 'Performance Testing'],
    productCategories: ['Electrical & Electronics'],
    recognition: 'demo',
    recognitionLabel: 'Demo Data',
    contact: 'safety@demo-lab-hyderabad.example',
    isDemo: true,
  },
];

// ---- Demo Certification Schemes ----

export const DEMO_SCHEMES: CertificationScheme[] = [
  {
    id: 'scheme-001',
    name: 'Demo: Product Certification Scheme',
    description: `${DEMO_NOTE} Placeholder description of a general product certification scheme.`,
    applicability: 'Demo: Applicable to a range of manufactured products requiring conformity assessment.',
    isDemo: true,
  },
  {
    id: 'scheme-002',
    name: 'Demo: Mandatory Certification Scheme',
    description: `${DEMO_NOTE} Placeholder description of a mandatory certification scheme for specific product categories.`,
    applicability: 'Demo: Applicable to products where certification is legally required.',
    isDemo: true,
  },
  {
    id: 'scheme-003',
    name: 'Demo: Eco Mark Scheme',
    description: `${DEMO_NOTE} Placeholder description of an environmental-friendly product marking scheme.`,
    applicability: 'Demo: Applicable to products meeting environmental criteria.',
    isDemo: true,
  },
];

// ---- Demo Hallmarking Information ----

export const DEMO_HALLMARKING_INFO: HallmarkingInformation[] = [
  {
    id: 'hm-001',
    title: 'Understand Hallmarking',
    description: `${DEMO_NOTE} Learn what hallmarking is and why it matters for precious metal articles.`,
    category: 'Education',
    isDemo: true,
  },
  {
    id: 'hm-002',
    title: 'Check Hallmark Information',
    description: `${DEMO_NOTE} Find out how to check hallmark details on your precious metal purchases.`,
    category: 'Verification',
    isDemo: true,
  },
  {
    id: 'hm-003',
    title: 'Hallmarking Services',
    description: `${DEMO_NOTE} Understand the hallmarking service infrastructure and how it works.`,
    category: 'Services',
    isDemo: true,
  },
  {
    id: 'hm-004',
    title: 'Ask a Question',
    description: `${DEMO_NOTE} Get answers to your hallmarking-related questions through the AI Assistant.`,
    category: 'Support',
    isDemo: true,
  },
];

// ---- Demo Consumer Help Topics ----

export const DEMO_CONSUMER_QUERIES: ConsumerQuery[] = [
  {
    id: 'cq-001',
    category: 'Product Quality',
    title: 'Product Quality',
    description: `${DEMO_NOTE} Understand quality expectations for products bearing the BIS mark.`,
    isDemo: true,
  },
  {
    id: 'cq-002',
    category: 'BIS Mark',
    title: 'BIS Mark Questions',
    description: `${DEMO_NOTE} Learn about the BIS standard mark and what it indicates.`,
    isDemo: true,
  },
  {
    id: 'cq-003',
    category: 'Complaints',
    title: 'Complaint Guidance',
    description: `${DEMO_NOTE} Guidance on how to raise product quality complaints.`,
    isDemo: true,
  },
  {
    id: 'cq-004',
    category: 'Standards',
    title: 'Product Standards',
    description: `${DEMO_NOTE} Understand how product standards protect consumer interests.`,
    isDemo: true,
  },
  {
    id: 'cq-005',
    category: 'Hallmarking',
    title: 'Hallmarking',
    description: `${DEMO_NOTE} Consumer guidance on hallmarking of precious metal articles.`,
    isDemo: true,
  },
  {
    id: 'cq-006',
    category: 'Awareness',
    title: 'Consumer Awareness',
    description: `${DEMO_NOTE} General consumer awareness about product safety and standards.`,
    isDemo: true,
  },
];

// ---- Demo Sources ----

export const DEMO_SOURCES: SourceReference[] = [
  {
    id: 'src-001',
    type: 'standard',
    title: 'Demo: Indian Standard — Product Safety',
    identifier: 'IS-DEMO-001',
    section: 'Clause 4',
    clause: '4.2',
    page: '12',
    url: undefined,
    verificationStatus: 'demo',
    description: 'Demo source reference for UI demonstration.',
  },
  {
    id: 'src-002',
    type: 'document',
    title: 'Demo: BIS Certification Guidelines',
    identifier: 'BIS-DOC-DEMO',
    section: 'Section 3',
    clause: '3.1',
    page: '8',
    url: undefined,
    verificationStatus: 'demo',
    description: 'Demo document reference for UI demonstration.',
  },
];

// ---- Demo Assistant Messages ----

export function createDemoAssistantResponse(userQuery: string): AssistantMessage {
  return {
    id: `msg-${Date.now()}-assistant`,
    role: 'assistant',
    content: `Based on the available information, here is a demonstration response to your query: "${userQuery}".`,
    timestamp: new Date().toISOString(),
    status: 'demo',
    isDemo: true,
    helpful: null,
    sections: [
      {
        id: 'sec-info',
        label: 'Relevant Information',
        type: 'info',
        items: [
          'This is a demo response — the AI knowledge service is not connected yet.',
          'In Phase 2, this section will contain source-backed information relevant to your query.',
          'All information presented here is for UI demonstration only.',
        ],
      },
      {
        id: 'sec-standard',
        label: 'Applicable Standard',
        type: 'standard',
        items: [
          'IS-DEMO-001 — Demo: Safety requirements for electrical household appliances',
        ],
      },
      {
        id: 'sec-certification',
        label: 'Certification',
        type: 'certification',
        items: [
          'Demo: Certification status requires verification against official BIS information.',
        ],
      },
      {
        id: 'sec-testing',
        label: 'Testing',
        type: 'testing',
        items: [
          'Demo: Testing requirements will be identified from the applicable standard.',
        ],
      },
    ],
    sources: DEMO_SOURCES,
  };
}

// ---- Demo Certification Assessment ----

export function createDemoAssessment(): CertificationAssessment {
  return {
    id: `assessment-${Date.now()}`,
    input: {
      productName: '',
      productCategory: '',
      manufacturerType: '',
      intendedMarket: '',
      existingStandard: '',
      testingStatus: '',
    },
    status: 'awaiting-verification',
    summary:
      'Your certification assessment has been recorded. The actual determination requires AI and BIS knowledge base verification, which will be available in Phase 2.',
    suggestedSteps: [
      'Identify the applicable Indian Standard(s) for your product using the Standards Finder.',
      'Review the certification guide steps to understand the process.',
      'Prepare your product for testing at a recognized laboratory.',
      'Gather required documentation for the certification application.',
    ],
    isDemo: true,
    createdAt: new Date().toISOString(),
  };
}
