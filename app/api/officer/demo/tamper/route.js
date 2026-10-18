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
 * POST /api/officer/demo/tamper
 * Tampering simulation:
 * - Refuses any deed not in DEED-1001, DEED-1002, DEED-1003
 * - Changes ONLY deed.area to area + 1 without touching hash
 * - Saves original_area (only if it is currently null)
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
      .select('deed_no, dag_no, seller, buyer, area, original_area, hash')
      .eq('deed_no', deed_no)
      .maybeSingle();

    if (selectWithCol.error && selectWithCol.error.code === '42703') {
      hasOriginalAreaCol = false;
      const selectWithoutCol = await supabaseServer
        .from('deed')
        .select('deed_no, dag_no, seller, buyer, area, hash')
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

    const currentArea = Number(deed.area);
    const newArea = currentArea + 1;
    const defaultOrig = DEFAULT_SEED_AREAS[deed_no] || currentArea;
    const origArea = (deed.original_area !== null && deed.original_area !== undefined)
      ? Number(deed.original_area)
      : defaultOrig;

    // Update in database
    if (hasOriginalAreaCol) {
      const updatePayload = { area: newArea };
      if (deed.original_area === null || deed.original_area === undefined) {
        updatePayload.original_area = origArea;
      }

      const { error: updateError } = await supabaseServer
        .from('deed')
        .update(updatePayload)
        .eq('deed_no', deed_no);

      if (updateError) {
        console.error('Tamper update error:', updateError);
        return Response.json(
          { success: false, message: 'দলিলের জমির পরিমাণ পরিবর্তন করতে সমস্যা হয়েছে।' },
          { status: 500 }
        );
      }
    } else {
      // Column not yet in DB; update area only
      const { error: updateError } = await supabaseServer
        .from('deed')
        .update({ area: newArea })
        .eq('deed_no', deed_no);

      if (updateError) {
        console.error('Tamper update error (fallback):', updateError);
        return Response.json(
          { success: false, message: 'দলিলের জমির পরিমাণ পরিবর্তন করতে সমস্যা হয়েছে।' },
          { status: 500 }
        );
      }
    }

    return Response.json({
      success: true,
      message: `দলিল নম্বর "${deed_no}"-এর জমির পরিমাণ ১ শতক বাড়িয়ে ${newArea} শতক করা হয়েছে। ডিজিটাল হ্যাশ অপরিবর্তিত রাখা হয়েছে (যার ফলে দলিলের তথ্যে পরিবর্তন শনাক্ত হবে)।`,
      deed_no,
      old_area: currentArea,
      new_area: newArea,
      original_area: origArea,
    });
  } catch (error) {
    console.error('Demo tamper error:', error);
    return Response.json(
      { success: false, message: 'দলিল জালকরণ সিমুলেশনে অনাকাঙ্ক্ষিত ত্রুটি হয়েছে।' },
      { status: 500 }
    );
  }
}
