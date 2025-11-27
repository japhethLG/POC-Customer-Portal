import { cookies } from 'next/headers';

// Simple authentication utilities
// In production, replace with NextAuth.js or similar

const AUTH_COOKIE_NAME = 'auth_session';

export interface AuthSession {
  email: string;
  name: string;
  authenticated: boolean;
}

/**
 * Check if user is authenticated (server-side)
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);
  return !!authCookie?.value;
}

/**
 * Get current session (server-side)
 */
export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);
  
  if (!authCookie?.value) {
    return null;
  }

  try {
    const session = JSON.parse(authCookie.value);
    return session;
  } catch {
    return null;
  }
}

/**
 * Create a session (server-side)
 */
export async function createSession(email: string, name: string): Promise<void> {
  const cookieStore = await cookies();
  const session: AuthSession = {
    email,
    name,
    authenticated: true,
  };
  
  cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

/**
 * Destroy session (server-side)
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

/**
 * Simple login validation
 * In production, this should validate against a database
 */
export function validateCredentials(email: string, password: string): boolean {
  // Demo: Accept any email with password "password"
  return email.length > 0 && password === 'password';
}

