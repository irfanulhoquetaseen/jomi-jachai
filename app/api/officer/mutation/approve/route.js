import { supabaseServer } from '@/lib/supabase';
import { isOfficerAuthenticated } from '@/lib/auth';
import { normalizeSearchInput } from '@/lib/verify';

/**
 * POST /api/officer/mutation/approve
 * Approves mutation for a deed:
 * 1. Sets deed.mutation_done = true
 * 2. Updates khatian for that dag:
 *    - owner_name = deed.buyer
 *    - remaining_area = total_area - deed.area (never below 0)
 *    - mutation_status = 'done'
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

    if (!deed_no) {
      return Response.json(
        { success: false, message: 'দলিল নম্বর প্রদান করুন।' },
        { status: 400 }
      );
    }

    // 1. Fetch deed
    const { data: deed, error: deedError } = await supabaseServer
      .from('deed')
      .select('deed_no, dag_no, seller, buyer, area, status, mutation_done')
      .eq('deed_no', deed_no)
      .eq('status', 'active')
      .maybeSingle();

    if (deedError) {
      console.error('Error finding deed for mutation:', deedError);
      return Response.json(
        { success: false, message: 'ডাটাবেস থেকে দলিলের তথ্য যাচাই করা যায়নি।' },
        { status: 500 }
      );
    }

    if (!deed) {
      return Response.json(
        { success: false, message: `দলিল নম্বর "${deed_no}" খুঁজে পাওয়া যায়নি বা এটি সক্রিয় নয়।` },
        { status: 404 }
      );
    }

    // 2. Fetch khatian for that dag_no
    const { data: khatian, error: khatianError } = await supabaseServer
      .from('khatian')
      .select('dag_no, total_area, remaining_area, owner_name, mutation_status')
      .eq('dag_no', deed.dag_no)
      .maybeSingle();

    if (khatianError) {
      console.error('Error finding khatian for mutation:', khatianError);
      return Response.json(
        { success: false, message: 'খতিয়ান তথ্য অনুসন্ধান করতে সমস্যা হয়েছে।' },
        { status: 500 }
      );
    }

    if (!khatian) {
      return Response.json(
        { success: false, message: `দাগ নম্বর ${deed.dag_no}-এর কোনো খতিয়ান পাওয়া যায়নি।` },
        { status: 404 }
      );
    }

    // 3. Compute remaining area: total_area - deed.area (never below 0)
    const totalAreaNum = Number(khatian.total_area) || 0;
    const deedAreaNum = Number(deed.area) || 0;
    const newRemainingArea = Math.max(0, totalAreaNum - deedAreaNum);

    // 4. Update deed: mutation_done = true
    const { error: deedUpdateError } = await supabaseServer
      .from('deed')
      .update({ mutation_done: true })
      .eq('deed_no', deed.deed_no);

    if (deedUpdateError) {
      console.error('Error updating deed mutation_done:', deedUpdateError);
      return Response.json(
        { success: false, message: 'দলিলের নামজারি স্ট্যাটাস হালনাগাদ করতে ব্যর্থ হয়েছে।' },
        { status: 500 }
      );
    }

    // 5. Update khatian for that dag: owner_name = deed.buyer, remaining_area = newRemainingArea, mutation_status = 'done'
    const { error: khatianUpdateError } = await supabaseServer
      .from('khatian')
      .update({
        owner_name: deed.buyer,
        remaining_area: newRemainingArea,
        mutation_status: 'done',
      })
      .eq('dag_no', deed.dag_no);

    if (khatianUpdateError) {
      console.error('Error updating khatian after mutation:', khatianUpdateError);
      return Response.json(
        { success: false, message: 'খতিয়ানে মালিকানা ও জমির তথ্য হালনাগাদ করতে ব্যর্থ হয়েছে।' },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: `দলিল নম্বর ${deed.deed_no}-এর নামজারি সফলভাবে অনুমোদিত হয়েছে এবং খতিয়ানে নতুন মালিক হিসেবে "${deed.buyer}" অন্তর্ভুক্ত করা হয়েছে।`,
      deed_no: deed.deed_no,
      dag_no: deed.dag_no,
      new_owner: deed.buyer,
      remaining_area: newRemainingArea,
    });
  } catch (error) {
    console.error('Mutation approve API error:', error);
    return Response.json(
      { success: false, message: 'অনাকাঙ্ক্ষিত ত্রুটি হয়েছে।' },
      { status: 500 }
    );
  }
}
