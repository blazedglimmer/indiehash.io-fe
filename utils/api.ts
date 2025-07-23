export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  request_id: string;
}

export interface SimilarResult {
  id: string;
  text: string;
  score: number;
  relevance_percent: number;
  created_at: string;
  dimensions: number;
  processing_time_ms: number;
  metadata: {
    category: string;
    domain: string;
    tags: string[];
  };
  all_payload: {
    text: string;
    created_at: string;
    metadata: {
      category: string;
      domain: string;
    };
  };
}

export interface EnhancedQueryData {
  question: string;
  summary: string;
  similar_results: SimilarResult[];
  enriched_content: string;
  total_results: number;
  request_id: string;
}

export interface QueryRequest {
  question: string;
  limit?: number;
}

// For client-side API calls to Next.js API routes, use relative paths
// For server-side calls to external APIs, use full URLs

// Helper function to build query string
function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString() ? `?${searchParams.toString()}` : '';
}

// Generic API client function with proper TypeScript handling
async function apiRequest<T>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: any;
    params?: Record<string, any>;
    signal?: AbortSignal;
  } = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, params, signal } = options;

  // For Next.js API routes, use relative paths (no base URL)
  let fullUrl = endpoint;
  if (params && method === 'GET') {
    fullUrl += buildQueryString(params);
  }

  // Create fetch options without signal first
  const baseRequestInit: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Add body if needed
  if (body && method !== 'GET') {
    baseRequestInit.body = JSON.stringify(body);
  }

  // Handle signal properly for exactOptionalPropertyTypes
  let finalRequestInit: RequestInit;
  if (signal) {
    finalRequestInit = {
      ...baseRequestInit,
      signal: signal, // TypeScript knows this is AbortSignal, not undefined
    };
  } else {
    finalRequestInit = baseRequestInit; // No signal property at all
  }

  try {
    const response = await fetch(fullUrl, finalRequestInit);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Client-side function that calls your secure API route
export async function queryEnhanced(
  request: QueryRequest,
  signal?: AbortSignal
): Promise<ApiResponse<EnhancedQueryData>> {
  // Call your Next.js API route instead of external API directly
  return apiRequest<EnhancedQueryData>('/api/query-enhanced', {
    method: 'POST',
    body: {
      question: request.question,
      limit: request.limit || 3,
    },
    ...(signal && { signal }),
  });
}

// Mock function for development/fallback
export function getMockResponse(
  question: string
): ApiResponse<EnhancedQueryData> {
  return {
    success: true,
    message: 'Enhanced query processed successfully',
    data: {
      question,
      summary:
        'Based on the available context, here are some curated resources to help you learn effectively.',
      similar_results: [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          text: 'Comprehensive learning resources for modern development',
          score: 0.892,
          relevance_percent: 100.0,
          created_at: '2025-01-21T16:30:00Z',
          dimensions: 384,
          processing_time_ms: 45.2,
          metadata: {
            category: 'educational',
            domain: 'programming',
            tags: ['learning', 'resources', 'development'],
          },
          all_payload: {
            text: 'Comprehensive learning resources for modern development',
            created_at: '2025-01-21T16:30:00Z',
            metadata: {
              category: 'educational',
              domain: 'programming',
            },
          },
        },
      ],
      enriched_content: `Here are some excellent resources to help you learn:

**Online Courses & Tutorials**
- Interactive coding platforms with hands-on exercises
- Video tutorials from industry experts
- Structured learning paths for beginners to advanced

**Documentation & Guides**
- Official documentation with examples
- Community-driven guides and best practices
- Step-by-step tutorials for practical projects

**Practice & Projects**
- Coding challenges and exercises
- Real-world project ideas
- Open source contributions

**Community & Support**
- Developer forums and communities
- Mentorship programs
- Study groups and meetups`,
      total_results: 3,
      request_id: '550e8400-e29b-41d4-a716-446655440001',
    },
    request_id: '550e8400-e29b-41d4-a716-446655440001',
  };
}
