import { createHash } from 'node:crypto';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Calculates SHA-256 hash according to the specification:
 * sha256(deed_no|dag_no|seller|buyer|area|deed_date|prev_hash)
 */
function calculateDeedHash({ deed_no, dag_no, seller, buyer, area, deed_date, prev_hash }) {
  const data = `${deed_no}|${dag_no}|${seller}|${buyer}|${area}|${deed_date}|${prev_hash}`;
  return createHash('sha256').update(data, 'utf8').digest('hex');
}

// 9 Demo Khatian records (Dag 101..109)
const khatians = [
  {
    mouza: 'কাল্পনিক মৌজা',
    dag_no: '101',
    owner_name: 'রফিকুল ইসলাম',
    total_area: 10,
    remaining_area: 10,
    land_type: 'normal',
    mutation_status: 'done',
    note: '101 GREEN: Clean deed and mutated ownership',
  },
  {
    mouza: 'কাল্পনিক মৌজা',
    dag_no: '102',
    owner_name: 'সুমি আক্তার',
    total_area: 5,
    remaining_area: 5,
    land_type: 'normal',
    mutation_status: 'done',
    note: '102 GREEN: Clean deed and mutated ownership',
  },
  {
    mouza: 'কাল্পনিক মৌজা',
    dag_no: '103',
    owner_name: 'মোহাম্মদ রহিম উদ্দিন',
    total_area: 8,
    remaining_area: 8,
    land_type: 'normal',
    mutation_status: 'done',
    note: '103 YELLOW: Name variation (buyer: মোঃ রহিম vs khatian: মোহাম্মদ রহিম উদ্দিন)',
  },
  {
    mouza: 'কাল্পনিক মৌজা',
    dag_no: '104',
    owner_name: 'কামাল হোসেন',
    total_area: 12,
    remaining_area: 12,
    land_type: 'normal',
    mutation_status: 'done',
    note: '104 YELLOW: Land is mortgaged to bank',
  },
  {
    mouza: 'কাল্পনিক মৌজা',
    dag_no: '105',
    owner_name: 'মজিবুর রহমান',
    total_area: 10,
    remaining_area: 10,
    land_type: 'normal',
    mutation_status: 'none',
    note: '105 RED: Double sale attempt (DEED-1005A and DEED-1005B)',
  },
  {
    mouza: 'কাল্পনিক মৌজা',
    dag_no: '106',
    owner_name: 'আসল মালিক খোন্দকার',
    total_area: 15,
    remaining_area: 15,
    land_type: 'normal',
    mutation_status: 'none',
    note: '106 RED: Seller is not the khatian owner (জাল বিক্রেতা)',
  },
  {
    mouza: 'কাল্পনিক মৌজা',
    dag_no: '107',
    owner_name: 'জমির মালিক খন্দকার',
    total_area: 10,
    remaining_area: 10,
    land_type: 'normal',
    mutation_status: 'none',
    note: '107 RED: Deed area (15) exceeds available khatian area (10)',
  },
  {
    mouza: 'কাল্পনিক মৌজা',
    dag_no: '108',
    owner_name: 'সোহেল চৌধুরী',
    total_area: 10,
    remaining_area: 10,
    land_type: 'normal',
    mutation_status: 'none',
    note: '108 RED: Tampered record (hash computed for area 5, but stored area is 8)',
  },
  {
    mouza: 'কাল্পনিক মৌজা',
    dag_no: '109',
    owner_name: 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার',
    total_area: 20,
    remaining_area: 20,
    land_type: 'khas',
    mutation_status: 'none',
    note: '109 RED: Khas government land',
  },
];

// Land dispute & encumbrance status
const landStatuses = [
  { dag_no: '101', mortgaged: false, court_case: false },
  { dag_no: '102', mortgaged: false, court_case: false },
  { dag_no: '103', mortgaged: false, court_case: false },
  { dag_no: '104', mortgaged: true, court_case: false }, // Mortgaged
  { dag_no: '105', mortgaged: false, court_case: false },
  { dag_no: '106', mortgaged: false, court_case: false },
  { dag_no: '107', mortgaged: false, court_case: false },
  { dag_no: '108', mortgaged: false, court_case: false },
  { dag_no: '109', mortgaged: false, court_case: false },
];

// Deed raw specifications
const deedSpecs = [
  {
    deed_no: 'DEED-1001',
    dag_no: '101',
    seller: 'আব্দুল করিম',
    buyer: 'রফিকুল ইসলাম',
    area: 10,
    deed_date: '2023-01-15',
    status: 'active',
    mutation_done: true,
  },
  {
    deed_no: 'DEED-1002',
    dag_no: '102',
    seller: 'নাসির উদ্দিন',
    buyer: 'সুমি আক্তার',
    area: 5,
    deed_date: '2023-02-20',
    status: 'active',
    mutation_done: true,
  },
  {
    deed_no: 'DEED-1003',
    dag_no: '103',
    seller: 'কাল্পনিক বিক্রেতা আনোয়ার',
    buyer: 'মোঃ রহিম',
    area: 8,
    deed_date: '2023-03-12',
    status: 'active',
    mutation_done: true,
  },
  {
    deed_no: 'DEED-1004',
    dag_no: '104',
    seller: 'জালাল উদ্দিন',
    buyer: 'কামাল হোসেন',
    area: 12,
    deed_date: '2023-04-18',
    status: 'active',
    mutation_done: true,
  },
  {
    deed_no: 'DEED-1005A',
    dag_no: '105',
    seller: 'মজিবুর রহমান',
    buyer: 'তারেক আহমেদ',
    area: 10,
    deed_date: '2023-05-02',
    status: 'active',
    mutation_done: false,
  },
  {
    deed_no: 'DEED-1005B',
    dag_no: '105',
    seller: 'মজিবুর রহমান',
    buyer: 'সাকিব হাসান',
    area: 10,
    deed_date: '2023-05-16',
    status: 'active',
    mutation_done: false,
  },
  {
    deed_no: 'DEED-1006',
    dag_no: '106',
    seller: 'জাল বিক্রেতা',
    buyer: 'ভিকটিম ক্রেতা',
    area: 15,
    deed_date: '2023-06-14',
    status: 'active',
    mutation_done: false,
  },
  {
    deed_no: 'DEED-1007',
    dag_no: '107',
    seller: 'জমির মালিক খন্দকার',
    buyer: 'ক্রেতা মফিজ',
    area: 15,
    deed_date: '2023-07-22',
    status: 'active',
    mutation_done: false,
  },
  {
    deed_no: 'DEED-1008',
    dag_no: '108',
    seller: 'সোহেল চৌধুরী',
    buyer: 'মামুনুর রশীদ',
    area: 8, // Stored area is 8
    hashArea: 5, // Hash intentionally computed for area 5 (tampering simulation)
    deed_date: '2023-08-10',
    status: 'active',
    mutation_done: false,
  },
  {
    deed_no: 'DEED-1009',
    dag_no: '109',
    seller: 'অবৈধ দখলদার',
    buyer: 'প্রতারিত ক্রেতা',
    area: 20,
    deed_date: '2023-09-25',
    status: 'active',
    mutation_done: false,
  },
];

// Chain the hashes
let prevHash = 'GENESIS';
const deeds = deedSpecs.map((spec) => {
  const areaForHash = spec.hashArea !== undefined ? spec.hashArea : spec.area;
  const hash = calculateDeedHash({
    deed_no: spec.deed_no,
    dag_no: spec.dag_no,
    seller: spec.seller,
    buyer: spec.buyer,
    area: areaForHash,
    deed_date: spec.deed_date,
    prev_hash: prevHash,
  });

  const record = {
    ...spec,
    prev_hash: prevHash,
    hash: hash,
  };

  // Next deed chains from this deed's hash
  prevHash = hash;
  return record;
});

// Format SQL string escaping single quotes
function sqlVal(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'number') return val.toString();
  return `'${String(val).replace(/'/g, "''")}'`;
}

// Generate the SQL script content
function generateSql() {
  const lines = [
    '--',
    '-- ==============================================================================--',
    '-- JOMI JACHAI DEMO SEED DATA (DAG 101..109)',
    '-- 100% Fictional Data for Land Verification Testing',
    '-- ==============================================================================--',
    '--',
    '-- Grant permissions to Supabase service_role, postgres, anon, authenticated',
    'GRANT ALL ON TABLE khatian, deed, land_status TO postgres, service_role, anon, authenticated;',
    'GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role, anon, authenticated;',
    '',
    '-- Clear existing data (in dependency order)',
    'TRUNCATE TABLE deed, land_status, khatian RESTART IDENTITY CASCADE;',
    '',
    '-- ------------------------------------------------------------------------------',
    '-- 1. SEED KHATIAN RECORDS',
    '-- ------------------------------------------------------------------------------',
    'INSERT INTO khatian (mouza, dag_no, owner_name, total_area, remaining_area, land_type, mutation_status) VALUES',
  ];

  const khatianValues = khatians.map((k, idx) => {
    const isLast = idx === khatians.length - 1;
    const row = `  (${sqlVal(k.mouza)}, ${sqlVal(k.dag_no)}, ${sqlVal(k.owner_name)}, ${k.total_area}, ${k.remaining_area}, ${sqlVal(k.land_type)}, ${sqlVal(k.mutation_status)})`;
    return `${row}${isLast ? ';' : ','} -- [${k.dag_no}] ${k.note}`;
  });
  lines.push(...khatianValues);

  lines.push(
    '',
    '-- ------------------------------------------------------------------------------',
    '-- 2. SEED LAND STATUS RECORDS',
    '-- ------------------------------------------------------------------------------',
    'INSERT INTO land_status (dag_no, mortgaged, court_case) VALUES'
  );

  const statusValues = landStatuses.map((s, idx) => {
    const isLast = idx === landStatuses.length - 1;
    const desc = s.mortgaged ? 'MORTGAGED' : 'CLEAR';
    const row = `  (${sqlVal(s.dag_no)}, ${sqlVal(s.mortgaged)}, ${sqlVal(s.court_case)})`;
    return `${row}${isLast ? ';' : ','} -- [${s.dag_no}] Status: ${desc}`;
  });
  lines.push(...statusValues);

  lines.push(
    '',
    '-- ------------------------------------------------------------------------------',
    '-- 3. SEED DEED RECORDS (WITH SHA-256 BLOCKCHAIN HASHES)',
    '-- Hash formula: sha256(deed_no|dag_no|seller|buyer|area|deed_date|prev_hash)',
    '-- ------------------------------------------------------------------------------',
    'INSERT INTO deed (deed_no, dag_no, seller, buyer, area, deed_date, hash, prev_hash, status, mutation_done) VALUES'
  );

  const deedValues = deeds.map((d, idx) => {
    const isLast = idx === deeds.length - 1;
    const row = `  (${sqlVal(d.deed_no)}, ${sqlVal(d.dag_no)}, ${sqlVal(d.seller)}, ${sqlVal(d.buyer)}, ${d.area}, ${sqlVal(d.deed_date)}, ${sqlVal(d.hash)}, ${sqlVal(d.prev_hash)}, ${sqlVal(d.status)}, ${sqlVal(d.mutation_done)})`;
    const note = d.hashArea !== undefined ? ` [TAMPERED: hash generated with area=${d.hashArea}, stored area=${d.area}]` : '';
    return `${row}${isLast ? ';' : ','} -- [${d.dag_no}] ${d.deed_no}${note}`;
  });
  lines.push(...deedValues);

  lines.push('');
  return lines.join('\n');
}

// Write to supabase/seed.sql
const outputPath = resolve(__dirname, '../supabase/seed.sql');
mkdirSync(dirname(outputPath), { recursive: true });
const sqlContent = generateSql();
writeFileSync(outputPath, sqlContent, 'utf8');

console.log(' Successfully generated Supabase seed SQL file:');
console.log(`-> ${outputPath}`);
console.log('\nGenerated Deed Hashes summary:');
deeds.forEach((d) => {
  const flag = d.hashArea ? ' (TAMPERED)' : '';
  console.log(`- ${d.deed_no} [Dag ${d.dag_no}]: ${d.hash.substring(0, 16)}... (prev: ${d.prev_hash.substring(0, 10)}...)${flag}`);
});
