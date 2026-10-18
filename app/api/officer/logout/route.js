import { clearOfficerSession } from '@/lib/auth';

/**
 * POST /api/officer/logout
 * Clears the officer session cookie.
 */
export async function POST() {
  try {
    await clearOfficerSession();
    return Response.json({ success: true, message: 'লগআউট সম্পন্ন হয়েছে।' }, { status: 200 });
  } catch (error) {
    console.error('Officer logout error:', error);
    return Response.json({ success: false, message: 'লগআউট ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}
