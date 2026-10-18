import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import process from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

// 1. Transparently re-execute with react-server condition so 'server-only' in lib/supabase.js works in plain Node
if (!process.execArgv.includes('--conditions=react-server') && !process.env._INSIDE_TEST_RUNNER) {
  const result = spawnSync(
    process.execPath,
    ['--conditions=react-server', ...process.argv.slice(1)],
    {
      stdio: 'inherit',
      env: { ...process.env, _INSIDE_TEST_RUNNER: '1' },
      cwd: projectRoot,
    }
  );
  process.exit(result.status ?? 0);
}

// 2. Load environment variables from .env.local safely without exposing secrets
const envPath = resolve(projectRoot, '.env.local');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf8');
  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

// 3. Import verification functions directly from production code (NO MOCKS, NO FIXTURES)
const { verifyLandRecord, normalizeSearchInput } = await import('../lib/verify.js');

// 4. Test specifications: 9 seeded database cases
const testCases = [
  {
    dag: '101',
    deed: 'DEED-1001',
    expected: 'green',
    title: 'Clean deed & mutated ownership (আব্দুল করিম -> রফিকুল ইসলাম)',
  },
  {
    dag: '102',
    deed: 'DEED-1002',
    expected: 'green',
    title: 'Clean deed & mutated ownership (নাসির উদ্দিন -> সুমি আক্তার)',
  },
  {
    dag: '103',
    deed: 'DEED-1003',
    expected: 'yellow',
    title: 'Name variation: buyer "মোঃ রহিম" vs khatian "মোহাম্মদ রহিম উদ্দিন"',
  },
  {
    dag: '104',
    deed: 'DEED-1004',
    expected: 'yellow',
    title: 'Mortgaged to bank (land_status.mortgaged = true)',
  },
  {
    dag: '105',
    deed: 'DEED-1005A',
    expected: 'red',
    title: 'Double sale attempt (DEED-1005A and DEED-1005B on Dag 105)',
  },
  {
    dag: '106',
    deed: 'DEED-1006',
    expected: 'red',
    title: 'Seller is not recorded owner (জাল বিক্রেতা vs আসল মালিক)',
  },
  {
    dag: '107',
    deed: 'DEED-1007',
    expected: 'red',
    title: 'Deed area (15) exceeds available khatian remaining area (10)',
  },
  {
    dag: '108',
    deed: 'DEED-1008',
    expected: 'red',
    title: 'Tampered deed (hash computed for area 5, but stored area is 8)',
  },
  {
    dag: '109',
    deed: 'DEED-1009',
    expected: 'red',
    title: 'Government Khas land (land_type = khas)',
  },
];

console.log('='.repeat(80));
console.log(' JOMI JACHAI LIVE DATABASE TEST SUITE');
console.log(' Directly querying Supabase tables without fixture fallbacks');
console.log('='.repeat(80));

let passCount = 0;
let failCount = 0;

for (const tc of testCases) {
  let result;
  try {
    // Query directly against the live database
    result = await verifyLandRecord(tc.dag);
  } catch (err) {
    console.error(`\n❌ FATAL DATABASE ERROR on Dag ${tc.dag}:`, err.message);
    process.exit(1);
  }

  // If the record was unexpectedly not found in database, fail loudly
  if (!result || !result.found) {
    console.error(`\n❌ DATABASE READ FAILURE: Dag ${tc.dag} was not found in the database!`);
    console.error(`   Message: ${result?.message || 'No response'}`);
    console.error('   Ensure supabase/seed.sql has been executed in the Supabase SQL editor.');
    process.exit(1);
  }

  const actualVerdict = result.verdict;
  const isMatch = actualVerdict === tc.expected;

  if (isMatch) {
    passCount++;
    console.log(`\n DAG ${tc.dag} (${result.deed?.deed_no || tc.deed}) -> Expected: [${tc.expected.toUpperCase()}] | Actual: [${actualVerdict?.toUpperCase()}]`);
  } else {
    failCount++;
    console.log(`\n❌ VERDICT MISMATCH: DAG ${tc.dag} -> Expected: [${tc.expected.toUpperCase()}] | Actual: [${actualVerdict?.toUpperCase()}]`);
  }

  console.log(`   Case: ${tc.title}`);
  console.log(`   Verdict Title: "${result.verdictTitle}"`);
  console.log('   Checks:');
  result.checks.forEach((c) => {
    const symbol = c.status === 'pass' ? '✓' : c.status === 'warn' ? '▲' : '✗';
    console.log(`     [${symbol}] ${c.id.padEnd(12)} (${c.status.toUpperCase().padEnd(4)}): ${c.reason}`);
  });
}

// Additional Test 1: Query by Bangla numerals (e.g. ১০৩) against live DB
console.log('\n' + '-'.repeat(80));
console.log(' Testing Live Query with Bangla Numerals (query = "১০৩"):');
try {
  const banglaResult = await verifyLandRecord('১০৩');
  if (banglaResult.found && banglaResult.verdict === 'yellow') {
    console.log('  Live search for "১০৩" returned expected YELLOW verdict.');
    passCount++;
  } else {
    console.error('❌ Bangla numeral search failed on live DB:', banglaResult);
    failCount++;
  }
} catch (err) {
  console.error('❌ Fatal error during Bangla numeral query:', err.message);
  process.exit(1);
}

// Additional Test 2: Query by Deed Number (e.g. DEED-1008) against live DB
console.log(' Testing Live Query with Deed Number (query = "DEED-1008"):');
try {
  const deedResult = await verifyLandRecord('DEED-1008');
  if (deedResult.found && deedResult.verdict === 'red') {
    console.log('  Live search for "DEED-1008" returned expected RED verdict.');
    passCount++;
  } else {
    console.error('❌ Deed number search failed on live DB:', deedResult);
    failCount++;
  }
} catch (err) {
  console.error('❌ Fatal error during deed number query:', err.message);
  process.exit(1);
}

console.log('\n' + '='.repeat(80));
console.log(` SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
console.log('='.repeat(80));

if (failCount > 0) {
  console.error('\n❌ Test suite failed with mismatches.');
  process.exit(1);
} else {
  console.log(' All 9 seeded cases verified live against Supabase with 100% expected verdicts!\n');
  process.exit(0);
}
