import { supabaseServer } from '@/lib/supabase';
import { isOfficerAuthenticated } from '@/lib/auth';

/**
 * GET /api/officer/mutation
 * Fetches all deeds where mutation_done = false and status = 'active'.
 * Excludes nothing else.
 */
export async function GET() {
  try {
    const isAuthed = await isOfficerAuthenticated();
    if (!isAuthed) {
      return Response.json(
        { success: false, message: 'অননুমোদিত প্রবেশ। অনুগ্রহ করে লগইন করুন।' },
        { status: 401 }
      );
    }

    const { data: deeds, error } = await supabaseServer
      .from('deed')
      .select('deed_no, dag_no, seller, buyer, area, deed_date, status, mutation_done')
      .eq('mutation_done', false)
      .eq('status', 'active')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching pending mutations:', error);
      return Response.json(
        { success: false, message: 'ডাটাবেস থেকে নামজারি তালিকা আনা যায়নি।' },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      deeds: deeds || [],
    });
  } catch (error) {
    console.error('Pending mutation API error:', error);
    return Response.json(
      { success: false, message: 'অনাকাঙ্ক্ষিত ত্রুটি হয়েছে।' },
      { status: 500 }
    );
  }
}
