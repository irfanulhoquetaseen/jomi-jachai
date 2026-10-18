import { setOfficerSession } from '@/lib/auth';

/**
 * POST /api/officer/login
 * Validates officer passcode and sets an httpOnly session cookie.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const passcode = body?.passcode?.trim();

    const expectedPasscode = process.env.OFFICER_PASSCODE;
    if (!expectedPasscode) {
      return Response.json(
        { success: false, message: 'সার্ভারে পাসকোড কনফিগার করা নেই।' },
        { status: 500 }
      );
    }

    if (!passcode || passcode !== expectedPasscode) {
      return Response.json(
        { success: false, message: 'ভুল পাসকোড। অনুগ্রহ করে সঠিক পাসকোড দিন।' },
        { status: 401 }
      );
    }

    // Set secure httpOnly cookie
    await setOfficerSession();

    return Response.json(
      { success: true, message: 'প্রবেশ সফল হয়েছে।' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Officer login error:', error);
    return Response.json(
      { success: false, message: 'লগইন প্রক্রিয়ায় সমস্যা হয়েছে। আবার চেষ্টা করুন।' },
      { status: 500 }
    );
  }
}
