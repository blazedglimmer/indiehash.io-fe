export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

// Generic API request options
export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  params?: Record<string, any>; // For query params
  body?: any; // For POST/PUT/PATCH
  signal?: AbortSignal;
}

// Generic API response type
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}