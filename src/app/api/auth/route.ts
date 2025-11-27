import { NextRequest, NextResponse } from 'next/server';
import { createSession, destroySession, validateCredentials } from '@/lib/auth';
import { AuthResponse } from '@/types';

// POST /api/auth - Login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, action } = body;

    // Handle logout
    if (action === 'logout') {
      await destroySession();
      return NextResponse.json<AuthResponse>({
        success: true,
        message: 'Logged out successfully',
      });
    }

    // Handle login
    if (!email || !password) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: 'Email and password are required',
        },
        { status: 400 }
      );
    }

    // Validate credentials
    const isValid = validateCredentials(email, password);

    if (!isValid) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: 'Invalid email or password',
        },
        { status: 401 }
      );
    }

    // Create session
    const name = email.split('@')[0]; // Simple name extraction
    await createSession(email, name);

    return NextResponse.json<AuthResponse>({
      success: true,
      user: {
        email,
        name,
      },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json<AuthResponse>(
      {
        success: false,
        message: 'An error occurred during authentication',
      },
      { status: 500 }
    );
  }
}

// GET /api/auth - Check authentication status
export async function GET(request: NextRequest) {
  try {
    const authCookie = request.cookies.get('auth_session');
    
    if (!authCookie?.value) {
      return NextResponse.json<AuthResponse>({
        success: false,
        message: 'Not authenticated',
      });
    }

    const session = JSON.parse(authCookie.value);
    
    return NextResponse.json<AuthResponse>({
      success: true,
      user: {
        email: session.email,
        name: session.name,
      },
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json<AuthResponse>(
      {
        success: false,
        message: 'Error checking authentication',
      },
      { status: 500 }
    );
  }
}

