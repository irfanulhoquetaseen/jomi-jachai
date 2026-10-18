import { NextResponse } from 'next/server';

/**
 * Next.js 16 Proxy (renamed from middleware).
 * Protects all /officer and /api/officer routes, except login.
 */
export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Allow unrestricted access to login endpoints
  if (pathname === '/officer/login' || pathname === '/api/officer/login') {
    return NextResponse.next();
  }

  // Check for officer authentication session cookie
  const sessionToken = request.cookies.get('officer_session')?.value;

  if (!sessionToken) {
    // If accessing protected officer API, return 401 JSON
    if (pathname.startsWith('/api/officer')) {
      return NextResponse.json(
        {
          success: false,
          message: 'অননুমোদিত প্রবেশ। অনুগ্রহ করে পাসকোড দিয়ে প্রবেশ করুন।',
        },
        { status: 401 }
      );
    }

    // If accessing protected officer UI page, redirect to login
    const loginUrl = new URL('/officer/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/officer', '/officer/:path*', '/api/officer/:path*'],
};
