import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_URL || 'http://localhost:8080';
const API_SECRET = process.env.API_SECRET;

export async function GET() {
  try {
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
    const response = await fetch(`${API_BASE_URL}/api/v1/landing-page`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Secret-Key': API_SECRET, // Include secret in headers
      },
    });

    if (!response.ok) {
      throw new Error(`External API error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Landing Page API Route Error:', error);
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
