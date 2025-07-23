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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const API_SECRET = process.env.NEXT_PUBLIC_API_SECRET || 'my-api-secret';

export async function queryEnhanced(
  request: QueryRequest
): Promise<ApiResponse<EnhancedQueryData>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/query/enhanced`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_SECRET}`,
      },
      body: JSON.stringify({
        question: request.question,
        limit: request.limit || 3,
      }),
    });

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
