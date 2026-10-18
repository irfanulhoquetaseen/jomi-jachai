import { supabaseServer } from '@/lib/supabase';
import { isOfficerAuthenticated } from '@/lib/auth';

/**
 * GET /api/officer/next-deed
 * Suggests the next sequential deed number (e.g. DEED-1010).
 */
export async function GET() {
  try {
    const isAuthed = await isOfficerAuthenticated();
    if (!isAuthed) {
      return Response.json({ success: false, message: 'অননুমোদিত' }, { status: 401 });
    }

    const { data } = await supabaseServer
      .from('deed')
      .select('deed_no')
      .order('id', { ascending: false })
      .limit(1);

    let nextNumber = 1010;
    if (data && data.length > 0 && data[0].deed_no) {
      const match = data[0].deed_no.match(/\d+/);
      if (match) {
        nextNumber = parseInt(match[0], 10) + 1;
      }
    }

    return Response.json({
      success: true,
      nextDeedNo: `DEED-${nextNumber}`,
    });
  } catch (error) {
    console.error('Next deed calculation error:', error);
    return Response.json({ success: true, nextDeedNo: 'DEED-1010' });
  }
}
