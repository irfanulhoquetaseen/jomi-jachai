import QRCode from 'qrcode';
import { supabaseServer } from '@/lib/supabase';
import { computeDeedHash, normalizeSearchInput } from '@/lib/verify';
import { isOfficerAuthenticated } from '@/lib/auth';

/**
 * POST /api/officer/register
 * Registers a new land deed with cryptographic blockchain hash and QR generation.
 */
export async function POST(request) {
  try {
    // 1. Authenticate officer
    const isAuthed = await isOfficerAuthenticated();
    if (!isAuthed) {
      return Response.json(
        { success: false, message: 'অননুমোদিত প্রবেশ। অনুগ্রহ করে লগইন করুন।' },
        { status: 401 }
      );
    }

    const body = await request.json();
    let { deed_no, dag_no, seller, buyer, area, deed_date } = body || {};

    // 2. Convert Bangla digits & normalize inputs
    deed_no = normalizeSearchInput(deed_no || '');
    dag_no = normalizeSearchInput(dag_no || '');
    seller = (seller || '').trim();
    buyer = (buyer || '').trim();
    const cleanAreaStr = normalizeSearchInput(String(area || ''));
    deed_date = normalizeSearchInput(deed_date || '');

    // 3. Validation
    if (!deed_no || !dag_no || !seller || !buyer || !cleanAreaStr || !deed_date) {
      return Response.json(
        { success: false, message: 'সবগুলো তথ্য সঠিকভাবে পূরণ করুন।' },
        { status: 400 }
      );
    }

    const numArea = Number(cleanAreaStr);
    if (isNaN(numArea) || numArea <= 0) {
      return Response.json(
        { success: false, message: 'জমির পরিমাণ শূন্যের চেয়ে বেশি হতে হবে।' },
        { status: 400 }
      );
    }

    // 4. Verify Dag exists in Khatian table
    const { data: khatian, error: khatianError } = await supabaseServer
      .from('khatian')
      .select('dag_no, owner_name, remaining_area, land_type')
      .eq('dag_no', dag_no)
      .maybeSingle();

    if (khatianError) {
      console.error('Khatian lookup error:', khatianError);
      return Response.json(
        { success: false, message: 'ডাটাবেস থেকে খতিয়ান যাচাই করা যায়নি।' },
        { status: 500 }
      );
    }

    if (!khatian) {
      return Response.json(
        {
          success: false,
          message: `দাগ নম্বর ${dag_no} খতিয়ানে পাওয়া যায়নি। প্রথমে বৈধ খতিয়ান থাকা আবশ্যক।`,
        },
        { status: 400 }
      );
    }

    // 5. Determine prev_hash: Hash of the latest deed on this dag_no, or "GENESIS"
    const { data: latestDeeds, error: deedError } = await supabaseServer
      .from('deed')
      .select('hash')
      .eq('dag_no', dag_no)
      .order('deed_date', { ascending: false })
      .order('id', { ascending: false })
      .limit(1);

    if (deedError) {
      console.error('Latest deed lookup error:', deedError);
      return Response.json(
        { success: false, message: 'পূর্ববর্তী দলিলের তথ্য যাচাই করতে সমস্যা হয়েছে।' },
        { status: 500 }
      );
    }

    const prev_hash = (latestDeeds && latestDeeds.length > 0) ? latestDeeds[0].hash : 'GENESIS';

    // 6. Compute SHA-256 hash using standard formula from lib/verify.js
    const hash = computeDeedHash({
      deed_no,
      dag_no,
      seller,
      buyer,
      area: numArea,
      deed_date,
      prev_hash,
    });

    // 7. Insert deed into Supabase
    const { data: insertedDeed, error: insertError } = await supabaseServer
      .from('deed')
      .insert({
        deed_no,
        dag_no,
        seller,
        buyer,
        area: numArea,
        deed_date,
        hash,
        prev_hash,
        status: 'active',
        mutation_done: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Deed insert error:', insertError);
      if (insertError.code === '23505') {
        return Response.json(
          { success: false, message: `দলিল নম্বর "${deed_no}" ইতিমধ্যে নিবন্ধিত রয়েছে। নতুন দলিল নম্বর দিন।` },
          { status: 400 }
        );
      }
      return Response.json(
        { success: false, message: 'দলিল সংরক্ষণ করতে ব্যর্থ হয়েছে।' },
        { status: 500 }
      );
    }

    // 8. Generate QR code with full URL to result page
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const resultUrl = `${protocol}://${host}/result?q=${encodeURIComponent(deed_no)}`;

    const qrDataUrl = await QRCode.toDataURL(resultUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#14532d',
        light: '#ffffff',
      },
    });

    return Response.json({
      success: true,
      message: 'দলিল সফলভাবে নিবন্ধিত হয়েছে।',
      deed: insertedDeed,
      resultUrl,
      qrDataUrl,
    });
  } catch (error) {
    console.error('Deed registration error:', error);
    return Response.json(
      { success: false, message: 'দলিল নিবন্ধন প্রক্রিয়ায় অনাকাঙ্ক্ষিত ত্রুটি হয়েছে।' },
      { status: 500 }
    );
  }
}
