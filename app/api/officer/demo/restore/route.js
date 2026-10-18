import { supabaseServer } from '@/lib/supabase';
import { isOfficerAuthenticated } from '@/lib/auth';
import { normalizeSearchInput } from '@/lib/verify';

const SAFE_DEEDS = ['DEED-1001', 'DEED-1002', 'DEED-1003'];

const DEFAULT_SEED_AREAS = {
  'DEED-1001': 10,
  'DEED-1002': 5,
  'DEED-1003': 8,
};

/**
 * POST /api/officer/demo/restore
 * Restores deed.area back to original_area:
 * - Refuses any deed not in DEED-1001, DEED-1002, DEED-1003
 * - Sets area back to original_area (or default seed area if original_area was null)
 * - Resets original_area to null
 */
export async function POST(request) {
  try {
    const isAuthed = await isOfficerAuthenticated();
    if (!isAuthed) {
      return Response.json(
        { success: false, message: 'অননুমোদিত প্রবেশ। অনুগ্রহ করে লগইন করুন।' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const deed_no = normalizeSearchInput(body?.deed_no || '');

    // Refuse any deed not in the 3 safe demo deeds
    if (!SAFE_DEEDS.includes(deed_no)) {
      return Response.json(
        {
          success: false,
          message: 'অননুমোদিত দলিল। শুধুমাত্র নিরাপদ ডেমো দলিলের (DEED-1001, DEED-1002, DEED-1003) ক্ষেত্রে এই পরীক্ষা করা যাবে।',
        },
        { status: 400 }
      );
    }

    // Try fetching with original_area
    let deed = null;
    let hasOriginalAreaCol = true;

    const selectWithCol = await supabaseServer
      .from('deed')
      .select('deed_no, dag_no, area, original_area')
      .eq('deed_no', deed_no)
      .maybeSingle();

    if (selectWithCol.error && selectWithCol.error.code === '42703') {
      hasOriginalAreaCol = false;
      const selectWithoutCol = await supabaseServer
        .from('deed')
        .select('deed_no, dag_no, area')
        .eq('deed_no', deed_no)
        .maybeSingle();

      if (selectWithoutCol.error || !selectWithoutCol.data) {
        return Response.json(
          { success: false, message: 'দলিলের তথ্য পাওয়া যায়নি।' },
          { status: 404 }
        );
      }
      deed = selectWithoutCol.data;
    } else if (selectWithCol.error || !selectWithCol.data) {
      return Response.json(
        { success: false, message: 'দলিলের তথ্য পাওয়া যায়নি।' },
        { status: 404 }
      );
    } else {
      deed = selectWithCol.data;
    }

    const defaultOrig = DEFAULT_SEED_AREAS[deed_no];
    const targetArea = (deed.original_area !== null && deed.original_area !== undefined)
      ? Number(deed.original_area)
      : defaultOrig;

    if (hasOriginalAreaCol) {
      const { error: updateError } = await supabaseServer
        .from('deed')
        .update({
          area: targetArea,
          original_area: null,
        })
        .eq('deed_no', deed_no);

      if (updateError) {
        console.error('Restore update error:', updateError);
        return Response.json(
          { success: false, message: 'দলিল পূর্বাবস্থায় ফিরিয়ে আনতে সমস্যা হয়েছে।' },
          { status: 500 }
        );
      }
    } else {
      const { error: updateError } = await supabaseServer
        .from('deed')
        .update({ area: targetArea })
        .eq('deed_no', deed_no);

      if (updateError) {
        console.error('Restore update error (fallback):', updateError);
        return Response.json(
          { success: false, message: 'দলিল পূর্বাবস্থায় ফিরিয়ে আনতে সমস্যা হয়েছে।' },
          { status: 500 }
        );
      }
    }

    return Response.json({
      success: true,
      message: `দলিল নম্বর "${deed_no}"-এর জমির পরিমাণ সফলভাবে পূর্বের মূল অবস্থায় (${targetArea} শতক) ফিরিয়ে আনা হয়েছে। ডিজিটাল হ্যাশের সাথে এখন পুরোপুরি মিল রয়েছে।`,
      deed_no,
      restored_area: targetArea,
    });
  } catch (error) {
    console.error('Demo restore error:', error);
    return Response.json(
      { success: false, message: 'দলিল পূর্বাবস্থায় ফেরাতে অনাকাঙ্ক্ষিত ত্রুটি হয়েছে।' },
      { status: 500 }
    );
  }
}
