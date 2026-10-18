// Central repository for all Bangla user-facing messages and labels in Jomi Jachai
export const messages = {
  // Verdict titles
  VERDICT_RED: 'কিনবেন না',
  VERDICT_YELLOW: 'সাবধান, আরও যাচাই করুন',
  VERDICT_GREEN: 'তুলনামূলক নিরাপদ',

  // Check 1: Integrity
  TITLE_INTEGRITY: 'দলিলের ডিজিটাল সততা ও হ্যাশ যাচাই',
  INTEGRITY_PASS: 'দলিলের তথ্যে কোনো পরিবর্তন করা হয়নি, হ্যাশ সঠিক আছে',
  INTEGRITY_FAIL: 'দলিলের তথ্য বদলানো হয়েছে',

  // Check 2: Double Sale
  TITLE_DOUBLE_SALE: 'দ্বৈত বিক্রয় যাচাই',
  DOUBLE_SALE_PASS: 'এই দাগে অন্য কোনো সক্রিয় বিক্রয় দলিল নেই',
  DOUBLE_SALE_FAIL: 'এই জমি আরও একজনের কাছে বিক্রির দলিল আছে',

  // Check 3: Owner
  TITLE_OWNER: 'মালিকানা ও বিক্রেতা যাচাই',
  OWNER_PASS: 'রেকর্ডকৃত মালিকের সাথে দলিলের তথ্য মিলেছে',
  OWNER_WARN: 'নামে সামান্য পার্থক্য আছে',
  OWNER_FAIL: 'বিক্রেতা জমির রেকর্ডকৃত মালিক নন',

  // Check 4: Area
  TITLE_AREA: 'জমির পরিমাণ যাচাই',
  AREA_PASS: 'বিক্রিত জমির পরিমাণ অনুমোদিত সীমার মধ্যে রয়েছে',
  AREA_FAIL: 'মালিকের কাছে যত জমি আছে তার চেয়ে বেশি বিক্রি দেখানো হয়েছে',

  // Check 5: Mutation
  TITLE_MUTATION: 'নামজারি বা খারিজ অবস্থা',
  MUTATION_PASS: 'নামজারি সম্পন্ন',
  MUTATION_WARN: 'নামজারি এখনো বাকি',

  // Check 6: Khas Land
  TITLE_KHAS: 'খাস বা সরকারি জমি যাচাই',
  KHAS_PASS: 'জমিটি সাধারণ মালিকানাধীন (খাস জমি নয়)',
  KHAS_FAIL: 'এটি সরকারি খাস জমি, বিক্রি করা যায় না',

  // Check 7: Encumbrance
  TITLE_ENCUMBRANCE: 'দায়বদ্ধতা ও মামলা যাচাই',
  ENCUMBRANCE_PASS: 'জমিটি ব্যাংক ঋণ বা মামলা মুক্ত',
  ENCUMBRANCE_MORTGAGED_WARN: 'জমি ব্যাংকে বন্ধক আছে',
  ENCUMBRANCE_COURT_CASE_WARN: 'জমি নিয়ে মামলা চলছে',
  ENCUMBRANCE_BOTH_WARN: 'জমি ব্যাংকে বন্ধক আছে এবং জমি নিয়ে মামলা চলছে',

  // General & Error states
  NOT_FOUND: 'কোনো দলিল বা খতিয়ানের তথ্য পাওয়া যায়নি। অনুগ্রহ করে সঠিক দাগ নম্বর বা দলিল নম্বর দিন।',
  ERROR_GENERIC: 'যাচাই প্রক্রিয়া সম্পন্ন করার সময় সাময়িক ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
};

export default messages;
