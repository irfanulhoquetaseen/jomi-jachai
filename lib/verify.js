import { createHash } from 'node:crypto';
import { distance } from 'fastest-levenshtein';
import { supabaseServer } from './supabase.js';
import { messages } from './messages.js';

/**
 * Converts Bangla numerals (০-৯) to English numerals (0-9) and trims whitespace.
 * @param {string} input
 * @returns {string}
 */
export function normalizeSearchInput(input) {
  if (!input || typeof input !== 'string') return '';
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  let str = input.trim();
  for (let i = 0; i < banglaDigits.length; i++) {
    str = str.replaceAll(banglaDigits[i], String(i));
  }
  return str.trim();
}

/**
 * Normalizes Bangla names for accurate ownership comparison:
 * - Unifies title prefix variants ("মোঃ", "মো.", "মোহাম্মদ", "মুহাম্মদ", "মোহাম্মাদ") -> "মোহাম্মদ"
 * - Removes extra whitespace and punctuation
 * @param {string} name
 * @returns {string}
 */
export function normalizeBanglaName(name) {
  if (!name || typeof name !== 'string') return '';
  const words = name.trim().split(/\s+/);
  const normalizedWords = words.map((w) => {
    const cleaned = w.replace(/[.:]/g, '');
    if (
      cleaned === 'মোঃ' ||
      cleaned === 'মো' ||
      cleaned === 'মোহাম্মদ' ||
      cleaned === 'মুহাম্মদ' ||
      cleaned === 'মোহাম্মাদ'
    ) {
      return 'মোহাম্মদ';
    }
    return w;
  });
  return normalizedWords.join(' ').trim();
}

/**
 * Server-side land record verification engine.
 * Reads directly from the live database. Never uses fake/mock fallback data.
 * Optimized to fetch deed, khatian, and land_status concurrently using Promise.all.
 *
 * If the queried deed/dag does not exist in the database, returns { found: false, message }.
 * If the database cannot be read or queries fail, throws an Error loudly.
 *
 * @param {string} query - Deed number (e.g. DEED-1003) or Dag number (e.g. 103)
 * @returns {Promise<{
 *   found: boolean,
 *   verdict?: 'red' | 'yellow' | 'green',
 *   verdictTitle?: string,
 *   checks?: Array<{ id: string, status: 'pass' | 'warn' | 'fail', title: string, reason: string }>,
 *   deed?: { deed_no: string, dag_no: string, seller: string, buyer: string, area: number },
 *   mouza?: string,
 *   message?: string
 * }>}
 */
export async function verifyLandRecord(query) {
  const q = normalizeSearchInput(query);
  if (!q) {
    return { found: false, message: messages.NOT_FOUND };
  }

  // 1. Fetch deed (by deed_no & by dag_no), khatian, land_status, and active deeds concurrently via Promise.all
  const [
    deedByNoRes,
    deedsByDagRes,
    khatianByQRes,
    statusByQRes,
    activeDeedsByQRes,
  ] = await Promise.all([
    supabaseServer.from('deed').select('*').ilike('deed_no', q).maybeSingle(),
    supabaseServer
      .from('deed')
      .select('*')
      .eq('dag_no', q)
      .order('deed_date', { ascending: false })
      .order('id', { ascending: false })
      .limit(1),
    supabaseServer.from('khatian').select('*').eq('dag_no', q).maybeSingle(),
    supabaseServer.from('land_status').select('*').eq('dag_no', q).maybeSingle(),
    supabaseServer.from('deed').select('deed_no').eq('dag_no', q).eq('status', 'active'),
  ]);

  if (deedByNoRes.error) {
    throw new Error(`Database error querying deed by deed_no "${q}": ${deedByNoRes.error.message}`);
  }
  if (deedsByDagRes.error) {
    throw new Error(`Database error querying deed by dag_no "${q}": ${deedsByDagRes.error.message}`);
  }

  // Identify matching deed: direct deed_no match takes priority, else latest deed on dag_no
  let deed = null;
  if (deedByNoRes.data) {
    deed = deedByNoRes.data;
  } else if (deedsByDagRes.data && deedsByDagRes.data.length > 0) {
    deed = deedsByDagRes.data[0];
  }

  // Legitimate not-found scenario (searched deed/dag does not exist)
  if (!deed) {
    return { found: false, message: messages.NOT_FOUND };
  }

  // 2. Resolve Khatian, Land Status, and other active deeds
  let khatian = null;
  let landStatus = null;
  let otherActiveDeeds = [];

  if (deed.dag_no === q) {
    // If queried by dag_no, khatian, status, and active deeds were already fetched in the parallel Promise.all above
    if (khatianByQRes.error) {
      throw new Error(`Database error fetching khatian for dag ${deed.dag_no}: ${khatianByQRes.error.message}`);
    }
    if (statusByQRes.error) {
      throw new Error(`Database error fetching land_status for dag ${deed.dag_no}: ${statusByQRes.error.message}`);
    }
    if (activeDeedsByQRes.error) {
      throw new Error(`Database error fetching active deeds for dag ${deed.dag_no}: ${activeDeedsByQRes.error.message}`);
    }

    khatian = khatianByQRes.data;
    landStatus = statusByQRes.data;
    otherActiveDeeds = (activeDeedsByQRes.data || []).filter(
      (d) => d.deed_no !== deed.deed_no
    );
  } else {
    // If queried by deed_no (and deed.dag_no !== q), fetch khatian, land_status, and other active deeds for deed.dag_no in parallel
    const [khatianRes, statusRes, otherDeedsRes] = await Promise.all([
      supabaseServer.from('khatian').select('*').eq('dag_no', deed.dag_no).maybeSingle(),
      supabaseServer.from('land_status').select('*').eq('dag_no', deed.dag_no).maybeSingle(),
      supabaseServer
        .from('deed')
        .select('deed_no')
        .eq('dag_no', deed.dag_no)
        .eq('status', 'active')
        .neq('deed_no', deed.deed_no),
    ]);

    if (khatianRes.error) {
      throw new Error(`Database error fetching khatian for dag ${deed.dag_no}: ${khatianRes.error.message}`);
    }
    if (statusRes.error) {
      throw new Error(`Database error fetching land_status for dag ${deed.dag_no}: ${statusRes.error.message}`);
    }
    if (otherDeedsRes.error) {
      throw new Error(`Database error fetching active deeds for dag ${deed.dag_no}: ${otherDeedsRes.error.message}`);
    }

    khatian = khatianRes.data;
    landStatus = statusRes.data;
    otherActiveDeeds = otherDeedsRes.data || [];
  }

  if (!khatian) {
    throw new Error(`Missing khatian record in database for dag ${deed.dag_no}`);
  }

  if (!landStatus) {
    throw new Error(`Missing land_status record in database for dag ${deed.dag_no}`);
  }

  const checks = [];

  // ============================================================================
  // CHECK 1: INTEGRITY (ডিজিটাল সততা যাচাই)
  // Recomputes SHA-256 of deed_no|dag_no|seller|buyer|area|deed_date|prev_hash
  // and compares it with stored hash.
  // ============================================================================
  const deedDateStr = String(deed.deed_date).split('T')[0];
  const hashPayload = `${deed.deed_no}|${deed.dag_no}|${deed.seller}|${deed.buyer}|${Number(deed.area)}|${deedDateStr}|${deed.prev_hash}`;
  const computedHash = createHash('sha256').update(hashPayload, 'utf8').digest('hex');

  const isHashValid = computedHash === deed.hash;
  checks.push({
    id: 'integrity',
    status: isHashValid ? 'pass' : 'fail',
    title: messages.TITLE_INTEGRITY,
    reason: isHashValid ? messages.INTEGRITY_PASS : messages.INTEGRITY_FAIL,
  });

  // ============================================================================
  // CHECK 2: DOUBLE SALE (দ্বৈত বিক্রয় যাচাই)
  // Another active deed exists on the same dag number with a different deed number -> fail.
  // ============================================================================
  const hasDoubleSale = otherActiveDeeds.length > 0;
  checks.push({
    id: 'double_sale',
    status: hasDoubleSale ? 'fail' : 'pass',
    title: messages.TITLE_DOUBLE_SALE,
    reason: hasDoubleSale ? messages.DOUBLE_SALE_FAIL : messages.DOUBLE_SALE_PASS,
  });

  // ============================================================================
  // CHECK 3: OWNER (মালিকানা ও বিক্রেতা যাচাই)
  // If mutation_done is true, expected owner = buyer; else expected owner = seller.
  // Compare with khatian.owner_name after normalization.
  // Exact match -> pass. Small Levenshtein distance or string containment -> warn; else -> fail.
  // ============================================================================
  const expectedOwner = deed.mutation_done ? deed.buyer : deed.seller;
  const normExpected = normalizeBanglaName(expectedOwner);
  const normKhatianOwner = normalizeBanglaName(khatian.owner_name);

  let ownerStatus = 'pass';
  let ownerReason = messages.OWNER_PASS;

  if (normExpected === normKhatianOwner) {
    ownerStatus = 'pass';
    ownerReason = messages.OWNER_PASS;
  } else {
    const levDist = distance(normExpected, normKhatianOwner);
    const maxLen = Math.max(normExpected.length, normKhatianOwner.length);
    const isSmallDiff = maxLen > 0 && (levDist / maxLen <= 0.25 || levDist <= 2);
    const hasContainment =
      normExpected.length > 0 &&
      normKhatianOwner.length > 0 &&
      (normExpected.includes(normKhatianOwner) || normKhatianOwner.includes(normExpected));

    if (hasContainment || isSmallDiff) {
      ownerStatus = 'warn';
      ownerReason = messages.OWNER_WARN;
    } else {
      ownerStatus = 'fail';
      ownerReason = messages.OWNER_FAIL;
    }
  }

  checks.push({
    id: 'owner',
    status: ownerStatus,
    title: messages.TITLE_OWNER,
    reason: ownerReason,
  });

  // ============================================================================
  // CHECK 4: AREA (জমির পরিমাণ যাচাই)
  // If mutation_done is false and deed area exceeds khatian remaining area -> fail. Else pass.
  // ============================================================================
  const isAreaExceeded = !deed.mutation_done && Number(deed.area) > Number(khatian.remaining_area);
  checks.push({
    id: 'area',
    status: isAreaExceeded ? 'fail' : 'pass',
    title: messages.TITLE_AREA,
    reason: isAreaExceeded ? messages.AREA_FAIL : messages.AREA_PASS,
  });

  // ============================================================================
  // CHECK 5: MUTATION (নামজারি যাচাই)
  // mutation_done true -> pass; false -> warn.
  // ============================================================================
  const isMutated = Boolean(deed.mutation_done);
  checks.push({
    id: 'mutation',
    status: isMutated ? 'pass' : 'warn',
    title: messages.TITLE_MUTATION,
    reason: isMutated ? messages.MUTATION_PASS : messages.MUTATION_WARN,
  });

  // ============================================================================
  // CHECK 6: KHAS LAND (সরকারি খাস জমি যাচাই)
  // land_type 'khas' -> fail.
  // ============================================================================
  const isKhas = khatian.land_type === 'khas';
  checks.push({
    id: 'khas',
    status: isKhas ? 'fail' : 'pass',
    title: messages.TITLE_KHAS,
    reason: isKhas ? messages.KHAS_FAIL : messages.KHAS_PASS,
  });

  // ============================================================================
  // CHECK 7: ENCUMBRANCE (দায়বদ্ধতা ও মামলা যাচাই)
  // mortgaged -> warn; court_case -> warn. Else pass.
  // ============================================================================
  let encumbranceStatus = 'pass';
  let encumbranceReason = messages.ENCUMBRANCE_PASS;

  if (landStatus.mortgaged && landStatus.court_case) {
    encumbranceStatus = 'warn';
    encumbranceReason = messages.ENCUMBRANCE_BOTH_WARN;
  } else if (landStatus.mortgaged) {
    encumbranceStatus = 'warn';
    encumbranceReason = messages.ENCUMBRANCE_MORTGAGED_WARN;
  } else if (landStatus.court_case) {
    encumbranceStatus = 'warn';
    encumbranceReason = messages.ENCUMBRANCE_COURT_CASE_WARN;
  }

  checks.push({
    id: 'encumbrance',
    status: encumbranceStatus,
    title: messages.TITLE_ENCUMBRANCE,
    reason: encumbranceReason,
  });

  // ============================================================================
  // VERDICT: any 'fail' -> 'red'; else any 'warn' -> 'yellow'; else 'green'
  // ============================================================================
  const hasFail = checks.some((c) => c.status === 'fail');
  const hasWarn = checks.some((c) => c.status === 'warn');

  let verdict = 'green';
  let verdictTitle = messages.VERDICT_GREEN;

  if (hasFail) {
    verdict = 'red';
    verdictTitle = messages.VERDICT_RED;
  } else if (hasWarn) {
    verdict = 'yellow';
    verdictTitle = messages.VERDICT_YELLOW;
  }

  return {
    found: true,
    verdict,
    verdictTitle,
    checks,
    deed: {
      deed_no: deed.deed_no,
      dag_no: deed.dag_no,
      seller: deed.seller,
      buyer: deed.buyer,
      area: Number(deed.area),
    },
    mouza: khatian.mouza || '',
  };
}

export default verifyLandRecord;
