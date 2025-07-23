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
      video: { tags: string[]; duration: number } | null;
      content_type: string;
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

export interface QuickStartQuestion {
  category: string;
  icon: string;
  questions: string[];
}

export interface ProductInfo {
  name: string;
  tagline: string;
  description: string;
  features: string[];
  domains: string[];
}

export interface UsageTip {
  title: string;
  description: string;
  example: string;
}

export interface SystemInfo {
  status: string;
  total_documents: number;
  indexed_vectors: number;
  knowledge_domains: number;
  response_time: string;
  last_updated: string;
}

export interface SampleConversation {
  user_question: string;
  preview_response: string;
  follow_up_suggestions: string[];
}

export interface FeaturedContent {
  recent_additions: string[];
  popular_topics: string[];
}

export interface LandingPageData {
  chat_id: string;
  product_info: ProductInfo;
  quick_start_questions: QuickStartQuestion[];
  featured_content: FeaturedContent;
  usage_tips: UsageTip[];
  system_info: SystemInfo;
  sample_conversation: SampleConversation;
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

// Client-side function to get landing page data
export async function getLandingPageData(
  signal?: AbortSignal
): Promise<ApiResponse<LandingPageData>> {
  return apiRequest<LandingPageData>('/api/landing-page', {
    method: 'GET',
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
        'Here are some excellent YouTube videos and resources to help you explore and learn about your topic. Our curated collection includes the best content from trusted creators.',
      similar_results: [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          text: 'Curated video content from top creators and educators in the field',
          score: 0.892,
          relevance_percent: 100.0,
          created_at: '2025-01-21T16:30:00Z',
          dimensions: 384,
          processing_time_ms: 45.2,
          metadata: {
            category: 'educational',
            domain: 'video-content',
            tags: ['youtube', 'tutorials', 'educational', 'curated'],
          },
          all_payload: {
            text: 'Curated video content from top creators and educators in the field',
            created_at: '2025-01-21T16:30:00Z',
            metadata: {
              category: 'educational',
              domain: 'video-content',
              video: { tags: [''], duration: 1900 },
              content_type: 'video',
            },
          },
        },
      ],
      enriched_content: `Here are some great YouTube videos to get you inspired for an unforgettable journey:

**Featured Video Picks**

- **"Ultimate Travel Guide | Best Destinations 2024"**  
  Experience stunning visuals and expert travel tips from seasoned adventurers — perfect if you're planning your next getaway.  
  [Watch here](https://www.youtube.com/watch?v=dQw4w9WgXcQ)

- **"Complete Beginner's Tutorial | Step by Step Guide"**  
  A comprehensive walkthrough covering everything you need to know, explained in simple terms with practical examples.  
  [Watch here](https://www.youtube.com/watch?v=dQw4w9WgXcQ)

- **"Pro Tips & Advanced Techniques | Expert Insights"**  
  Learn advanced strategies and insider secrets from industry professionals who share their years of experience.  
  [Watch here](https://www.youtube.com/watch?v=dQw4w9WgXcQ)

**Additional Resources**

- **Community Forums & Discussion**  
  Join active communities where you can ask questions, share experiences, and connect with like-minded individuals.

- **Recommended Tools & Equipment**  
  Discover the essential tools and gear recommended by experts to enhance your experience and achieve better results.`,
      total_results: 3,
      request_id: '550e8400-e29b-41d4-a716-446655440001',
    },
    request_id: '550e8400-e29b-41d4-a716-446655440001',
  };
}

// Mock function for landing page data
export function getMockLandingPageData(): ApiResponse<LandingPageData> {
  return {
    success: true,
    message: 'Landing page data retrieved successfully',
    data: {
      chat_id: 'chat_mock_id',
      product_info: {
        name: 'IndieHash',
        tagline: 'RAG engine on top of a curated database.',
        description:
          'IndieHash is a next-generation RAG (Retrieval-Augmented Generation) server that transforms curated knowledge into intelligent conversations.',
        features: [
          "🧠 Advanced Vector Search - Find exactly what you're looking for",
          '🎯 Domain-Specific Expertise - Curated content in programming, travel, lifestyle & more',
          '⚡ Real-time Knowledge Retrieval - Instant access to relevant information',
        ],
        domains: [
          'Programming & Technology',
          'Travel & Adventure',
          'Lifestyle & Wellness',
          'Business & Entrepreneurship',
        ],
      },
      quick_start_questions: [
        {
          category: 'Programming',
          icon: '💻',
          questions: [
            'I want to learn about Arcs in Rust programming',
            'What are the best practices for error handling in Go?',
            'How do I optimize React performance for large applications?',
          ],
        },
        {
          category: 'Travel',
          icon: '🌍',
          questions: [
            'What are some hidden gems to visit in Southeast Asia?',
            'Best budget-friendly destinations for digital nomads',
            'How to plan a perfect road trip through Europe?',
          ],
        },
        {
          category: 'Lifestyle',
          icon: '✨',
          questions: [
            'How to build a productive morning routine?',
            'What are some effective stress management techniques?',
            'Best meal prep strategies for busy professionals',
          ],
        },
        {
          category: 'Business',
          icon: '🚀',
          questions: [
            'How to validate a startup idea before building?',
            'What are the key metrics every SaaS founder should track?',
            'Best strategies for building an audience on social media',
          ],
        },
      ],
      featured_content: {
        recent_additions: [
          'Latest programming tutorials from top developers',
          'Travel vlogs from adventure seekers',
          'Entrepreneurship insights from successful founders',
        ],
        popular_topics: [
          'Rust programming fundamentals',
          'Digital nomad destinations',
          'Productivity hacks',
        ],
      },
      usage_tips: [
        {
          title: 'Ask Specific Questions',
          description:
            'The more specific your question, the better the response.',
          example:
            '❓ How do I implement error handling in Rust using Result types?',
        },
        {
          title: 'Explore Different Domains',
          description:
            "IndieHash covers multiple niches. Don't hesitate to ask about travel, lifestyle, business, or creative topics",
          example: '❓ What are the best places to visit in Bali?',
        },
      ],
      system_info: {
        status: 'active',
        total_documents: 1250,
        indexed_vectors: 45000,
        knowledge_domains: 5,
        response_time: '150ms',
        last_updated: '2025-01-21T16:30:00Z',
      },
      sample_conversation: {
        user_question: 'I want to learn about Arcs in Rust programming',
        preview_response:
          'Arcs (Atomically Reference Counted) in Rust are a powerful tool for shared ownership in concurrent programming...',
        follow_up_suggestions: [
          'Show me code examples of Arc usage',
          "What's the difference between Arc and Rc?",
          'When should I use Arc vs other smart pointers?',
        ],
      },
    },
    request_id: 'mock_landing_request_id',
  };
}
