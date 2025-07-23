// app/api/query-enhanced/route.ts (App Router - Next.js 13+)

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_URL || 'http://localhost:8080';
const API_SECRET = process.env.API_SECRET;

export async function POST(request: NextRequest) {
  try {
    const { question, limit } = await request.json();

    // Basic validation
    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        {
          success: false,
          message: 'Question is required and must be a string',
          data: null,
          request_id: '',
        },
        { status: 400 }
      );
    }

    // Validate API secret exists
    if (!API_SECRET) {
      console.error('API_SECRET environment variable is not set');
      return NextResponse.json(
        {
          success: false,
          message: 'Server configuration error',
          data: null,
          request_id: '',
        },
        { status: 500 }
      );
    }

    // Call external API with secret from server-side
    const response = await fetch(`${API_BASE_URL}/api/v1/query/enhanced`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_SECRET}`,
      },
      body: JSON.stringify({
        question,
        limit: limit || 3,
      }),
    });

    if (!response.ok) {
      throw new Error(`External API error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        data: null,
        request_id: '',
      },
      { status: 500 }
    );
  }
}
