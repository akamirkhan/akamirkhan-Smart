import type {
  AssistantMessage,
  ChatSession,
  Standard,
  StandardSearchResult,
  StandardSearchFilters,
  CertificationAssessment,
  CertificationQuestionnaireInput,
  CertificationScheme,
  Laboratory,
  LaboratorySearchResult,
  LaboratorySearchFilters,
  HallmarkingInformation,
  ConsumerQuery,
  SourceReference,
  LanguageCode,
  ServiceResult,
} from '@/types';
import {
  DEMO_STANDARDS,
  DEMO_LABORATORIES,
  DEMO_SCHEMES,
  DEMO_HALLMARKING_INFO,
  DEMO_CONSUMER_QUERIES,
  createDemoAssistantResponse,
  createDemoAssessment,
} from '@/data/mockData';

// ============================================================
// Service Abstraction Layer — BIS AI Assistant
// ============================================================
// Phase 1: All services return mock/demo data.
// Phase 2: Replace these implementations with real API calls
// (RAG, BIS knowledge base, vector DB, real BIS APIs).
// The UI depends on these interfaces, NOT on mock data directly.
// ============================================================

// ---- Assistant Service ----

export interface AssistantService {
  sendMessage(query: string, language: LanguageCode): Promise<ServiceResult<AssistantMessage>>;
  getQuickPrompts(): { id: string; label: string; text: string }[];
  regenerateResponse(messageId: string, language: LanguageCode): Promise<ServiceResult<AssistantMessage>>;
  clearSession(): Promise<ServiceResult<null>>;
  saveSession(session: ChatSession): Promise<ServiceResult<null>>;
  loadSession(): Promise<ServiceResult<ChatSession | null>>;
}

class MockAssistantService implements AssistantService {
  async sendMessage(query: string, language: LanguageCode): Promise<ServiceResult<AssistantMessage>> {
    await simulateDelay(800);
    const response = createDemoAssistantResponse(query);
    response.language = language;
    return { data: response, error: null, isDemo: true };
  }

  getQuickPrompts() {
    return [
      { id: 'qp1', label: 'Which standard applies to my product?', text: 'Which standard applies to my product?' },
      { id: 'qp2', label: 'How do I get BIS certification?', text: 'How do I get BIS certification?' },
      { id: 'qp3', label: 'What testing is required?', text: 'What testing is required for my product?' },
      { id: 'qp4', label: 'Help me understand hallmarking', text: 'Help me understand hallmarking' },
      { id: 'qp5', label: 'Find a relevant laboratory', text: 'Find a relevant laboratory for my product' },
    ];
  }

  async regenerateResponse(_messageId: string, language: LanguageCode): Promise<ServiceResult<AssistantMessage>> {
    await simulateDelay(800);
    const response = createDemoAssistantResponse('Regenerated query');
    response.language = language;
    return { data: response, error: null, isDemo: true };
  }

  async clearSession(): Promise<ServiceResult<null>> {
    return { data: null, error: null, isDemo: false };
  }

  async saveSession(session: ChatSession): Promise<ServiceResult<null>> {
    try {
      localStorage.setItem('bis-ai-assistant-chat', JSON.stringify(session));
      return { data: null, error: null, isDemo: false };
    } catch {
      return { data: null, error: 'Failed to save session', isDemo: false };
    }
  }

  async loadSession(): Promise<ServiceResult<ChatSession | null>> {
    try {
      const stored = localStorage.getItem('bis-ai-assistant-chat');
      if (stored) {
        return { data: JSON.parse(stored) as ChatSession, error: null, isDemo: false };
      }
      return { data: null, error: null, isDemo: false };
    } catch {
      return { data: null, error: 'Failed to load session', isDemo: false };
    }
  }
}

// ---- Standards Service ----

export interface StandardsService {
  search(filters: StandardSearchFilters): Promise<ServiceResult<StandardSearchResult>>;
  getById(id: string): Promise<ServiceResult<Standard | null>>;
  getRelated(id: string): Promise<ServiceResult<Standard[]>>;
  getCategories(): string[];
  getIndustries(): string[];
}

class MockStandardsService implements StandardsService {
  async search(filters: StandardSearchFilters): Promise<ServiceResult<StandardSearchResult>> {
    await simulateDelay(500);
    let items = [...DEMO_STANDARDS];

    if (filters.query) {
      const q = filters.query.toLowerCase();
      items = items.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.identifier.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q),
      );
    }
    if (filters.category && filters.category !== 'All Categories') {
      items = items.filter((s) => s.category === filters.category);
    }
    if (filters.industry && filters.industry !== 'All Industries') {
      items = items.filter((s) => s.industry === filters.industry);
    }
    if (filters.type && filters.type !== 'all') {
      items = items.filter((s) => s.type === filters.type);
    }
    if (filters.status && filters.status !== 'all') {
      items = items.filter((s) => s.status === filters.status);
    }
    if (filters.yearFrom) {
      items = items.filter((s) => s.publishedYear >= filters.yearFrom!);
    }
    if (filters.yearTo) {
      items = items.filter((s) => s.publishedYear <= filters.yearTo!);
    }

    switch (filters.sortBy) {
      case 'year-desc':
        items.sort((a, b) => b.publishedYear - a.publishedYear);
        break;
      case 'year-asc':
        items.sort((a, b) => a.publishedYear - b.publishedYear);
        break;
      case 'title-asc':
        items.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'updated-desc':
        items.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
        break;
      default:
        break;
    }

    const total = items.length;
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 6;
    const start = (page - 1) * pageSize;
    const paged = items.slice(start, start + pageSize);

    return {
      data: { items: paged, total, page, pageSize },
      error: null,
      isDemo: true,
    };
  }

  async getById(id: string): Promise<ServiceResult<Standard | null>> {
    await simulateDelay(300);
    const found = DEMO_STANDARDS.find((s) => s.id === id || s.identifier === id);
    return { data: found || null, error: null, isDemo: true };
  }

  async getRelated(id: string): Promise<ServiceResult<Standard[]>> {
    await simulateDelay(200);
    const standard = DEMO_STANDARDS.find((s) => s.id === id);
    if (!standard || !standard.relatedStandards) {
      return { data: [], error: null, isDemo: true };
    }
    const related = DEMO_STANDARDS.filter((s) =>
      standard.relatedStandards!.includes(s.identifier),
    );
    return { data: related, error: null, isDemo: true };
  }

  getCategories(): string[] {
    return Array.from(new Set(DEMO_STANDARDS.map((s) => s.category)));
  }

  getIndustries(): string[] {
    return Array.from(new Set(DEMO_STANDARDS.map((s) => s.industry)));
  }
}

// ---- Certification Service ----

export interface CertificationService {
  getSchemes(): Promise<ServiceResult<CertificationScheme[]>>;
  submitAssessment(input: CertificationQuestionnaireInput): Promise<ServiceResult<CertificationAssessment>>;
}

class MockCertificationService implements CertificationService {
  async getSchemes(): Promise<ServiceResult<CertificationScheme[]>> {
    await simulateDelay(300);
    return { data: DEMO_SCHEMES, error: null, isDemo: true };
  }

  async submitAssessment(input: CertificationQuestionnaireInput): Promise<ServiceResult<CertificationAssessment>> {
    await simulateDelay(1000);
    const assessment = createDemoAssessment();
    assessment.input = input;
    return { data: assessment, error: null, isDemo: true };
  }
}

// ---- Laboratory Service ----

export interface LaboratoryService {
  search(filters: LaboratorySearchFilters): Promise<ServiceResult<LaboratorySearchResult>>;
  getById(id: string): Promise<ServiceResult<Laboratory | null>>;
  getStates(): string[];
  getTestTypes(): string[];
}

class MockLaboratoryService implements LaboratoryService {
  async search(filters: LaboratorySearchFilters): Promise<ServiceResult<LaboratorySearchResult>> {
    await simulateDelay(500);
    let items = [...DEMO_LABORATORIES];

    if (filters.query) {
      const q = filters.query.toLowerCase();
      items = items.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.location.toLowerCase().includes(q) ||
          l.capabilities.some((c) => c.toLowerCase().includes(q)) ||
          l.productCategories.some((c) => c.toLowerCase().includes(q)),
      );
    }
    if (filters.state && filters.state !== 'All States') {
      items = items.filter((l) => l.state === filters.state);
    }
    if (filters.productCategory && filters.productCategory !== 'All Categories') {
      items = items.filter((l) => l.productCategories.includes(filters.productCategory!));
    }
    if (filters.testType && filters.testType !== 'All Test Types') {
      items = items.filter((l) => l.capabilities.some((c) => c.toLowerCase().includes(filters.testType!.toLowerCase().replace(' testing', '').replace(' analysis', ''))));
    }
    if (filters.recognition && filters.recognition !== 'all') {
      items = items.filter((l) => l.recognition === filters.recognition);
    }

    return {
      data: { items, total: items.length, page: 1, pageSize: items.length },
      error: null,
      isDemo: true,
    };
  }

  async getById(id: string): Promise<ServiceResult<Laboratory | null>> {
    await simulateDelay(200);
    const found = DEMO_LABORATORIES.find((l) => l.id === id);
    return { data: found || null, error: null, isDemo: true };
  }

  getStates(): string[] {
    return Array.from(new Set(DEMO_LABORATORIES.map((l) => l.state)));
  }

  getTestTypes(): string[] {
    return Array.from(new Set(DEMO_LABORATORIES.flatMap((l) => l.capabilities)));
  }
}

// ---- Hallmarking Service ----

export interface HallmarkingService {
  getInfo(): Promise<ServiceResult<HallmarkingInformation[]>>;
}

class MockHallmarkingService implements HallmarkingService {
  async getInfo(): Promise<ServiceResult<HallmarkingInformation[]>> {
    await simulateDelay(300);
    return { data: DEMO_HALLMARKING_INFO, error: null, isDemo: true };
  }
}

// ---- Consumer Service ----

export interface ConsumerService {
  getTopics(): Promise<ServiceResult<ConsumerQuery[]>>;
}

class MockConsumerService implements ConsumerService {
  async getTopics(): Promise<ServiceResult<ConsumerQuery[]>> {
    await simulateDelay(300);
    return { data: DEMO_CONSUMER_QUERIES, error: null, isDemo: true };
  }
}

// ---- Helper ----

function simulateDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---- Exported service instances ----
// Phase 2: swap these implementations with real API-backed services.

export const assistantService: AssistantService = new MockAssistantService();
export const standardsService: StandardsService = new MockStandardsService();
export const certificationService: CertificationService = new MockCertificationService();
export const laboratoryService: LaboratoryService = new MockLaboratoryService();
export const hallmarkingService: HallmarkingService = new MockHallmarkingService();
export const consumerService: ConsumerService = new MockConsumerService();
