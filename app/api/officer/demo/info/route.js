import { supabaseServer } from '@/lib/supabase';
import { isOfficerAuthenticated } from '@/lib/auth';

const SAFE_DEEDS = ['DEED-1001', 'DEED-1002', 'DEED-1003'];

/**
 * GET /api/officer/demo/info
 * Returns the current live status of the 3 safe demo deeds
 */
export async function GET() {
  try {
    const isAuthed = await isOfficerAuthenticated();
    if (!isAuthed) {
      return Response.json(
        { success: false, message: 'অননুমোদিত প্রবেশ।' },
        { status: 401 }
      );
    }

    let deeds = [];
    const selectWithCol = await supabaseServer
      .from('deed')
      .select('deed_no, dag_no, seller, buyer, area, original_area, deed_date')
      .in('deed_no', SAFE_DEEDS)
      .order('deed_no', { ascending: true });

    if (selectWithCol.error && selectWithCol.error.code === '42703') {
      const selectWithoutCol = await supabaseServer
        .from('deed')
        .select('deed_no, dag_no, seller, buyer, area, deed_date')
        .in('deed_no', SAFE_DEEDS)
        .order('deed_no', { ascending: true });

      deeds = selectWithoutCol.data || [];
    } else {
      deeds = selectWithCol.data || [];
    }

    return Response.json({
      success: true,
      deeds,
    });
  } catch (error) {
    console.error('Demo info API error:', error);
    return Response.json(
      { success: false, message: 'অনাকাঙ্ক্ষিত ত্রুটি হয়েছে।' },
      { status: 500 }
    );
  }
}
