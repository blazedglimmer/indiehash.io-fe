import { ApiRequestOptions, ApiResponse } from '@/types';

function buildQueryString(params?: Record<string, any>): string {
  if (!params) return '';
  const esc = encodeURIComponent;
  return (
    '?' +
    Object.keys(params)
      .map(k => esc(k) + '=' + esc(params[k]))
      .join('&')
  );
}

export async function apiRequest<T = any>(
  url: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', headers = {}, params, body, signal } = options;
  let fullUrl = url;
  if (params && method === 'GET') {
    fullUrl += buildQueryString(params);
  }
  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    signal,
  };
  if (body && method !== 'GET') {
    fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
  }
  const res = await fetch(fullUrl, fetchOptions);
  const contentType = res.headers.get('content-type');
  let data: any;
  if (contentType && contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }
  return {
    data,
    status: res.status,
    statusText: res.statusText,
    headers: res.headers,
  };
}

// Convenience methods
export const apiGet = <T = any>(url: string, options: ApiRequestOptions = {}) =>
  apiRequest<T>(url, { ...options, method: 'GET' });

export const apiPost = <T = any>(
  url: string,
  body: any,
  options: ApiRequestOptions = {}
) => apiRequest<T>(url, { ...options, method: 'POST', body });
