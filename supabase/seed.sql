--
-- ==============================================================================--
-- JOMI JACHAI DEMO SEED DATA (DAG 101..109)
-- 100% Fictional Data for Land Verification Testing
-- ==============================================================================--
--
-- Grant permissions to Supabase service_role, postgres, anon, authenticated
GRANT ALL ON TABLE khatian, deed, land_status TO postgres, service_role, anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role, anon, authenticated;

-- Clear existing data (in dependency order)
TRUNCATE TABLE deed, land_status, khatian RESTART IDENTITY CASCADE;

-- ------------------------------------------------------------------------------
-- 1. SEED KHATIAN RECORDS
-- ------------------------------------------------------------------------------
INSERT INTO khatian (mouza, dag_no, owner_name, total_area, remaining_area, land_type, mutation_status) VALUES
  ('কাল্পনিক মৌজা', '101', 'রফিকুল ইসলাম', 10, 10, 'normal', 'done'), -- [101] 101 GREEN: Clean deed and mutated ownership
  ('কাল্পনিক মৌজা', '102', 'সুমি আক্তার', 5, 5, 'normal', 'done'), -- [102] 102 GREEN: Clean deed and mutated ownership
  ('কাল্পনিক মৌজা', '103', 'মোহাম্মদ রহিম উদ্দিন', 8, 8, 'normal', 'done'), -- [103] 103 YELLOW: Name variation (buyer: মোঃ রহিম vs khatian: মোহাম্মদ রহিম উদ্দিন)
  ('কাল্পনিক মৌজা', '104', 'কামাল হোসেন', 12, 12, 'normal', 'done'), -- [104] 104 YELLOW: Land is mortgaged to bank
  ('কাল্পনিক মৌজা', '105', 'মজিবুর রহমান', 10, 10, 'normal', 'none'), -- [105] 105 RED: Double sale attempt (DEED-1005A and DEED-1005B)
  ('কাল্পনিক মৌজা', '106', 'আসল মালিক খোন্দকার', 15, 15, 'normal', 'none'), -- [106] 106 RED: Seller is not the khatian owner (জাল বিক্রেতা)
  ('কাল্পনিক মৌজা', '107', 'জমির মালিক খন্দকার', 10, 10, 'normal', 'none'), -- [107] 107 RED: Deed area (15) exceeds available khatian area (10)
  ('কাল্পনিক মৌজা', '108', 'সোহেল চৌধুরী', 10, 10, 'normal', 'none'), -- [108] 108 RED: Tampered record (hash computed for area 5, but stored area is 8)
  ('কাল্পনিক মৌজা', '109', 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার', 20, 20, 'khas', 'none'); -- [109] 109 RED: Khas government land

-- ------------------------------------------------------------------------------
-- 2. SEED LAND STATUS RECORDS
-- ------------------------------------------------------------------------------
INSERT INTO land_status (dag_no, mortgaged, court_case) VALUES
  ('101', FALSE, FALSE), -- [101] Status: CLEAR
  ('102', FALSE, FALSE), -- [102] Status: CLEAR
  ('103', FALSE, FALSE), -- [103] Status: CLEAR
  ('104', TRUE, FALSE), -- [104] Status: MORTGAGED
  ('105', FALSE, FALSE), -- [105] Status: CLEAR
  ('106', FALSE, FALSE), -- [106] Status: CLEAR
  ('107', FALSE, FALSE), -- [107] Status: CLEAR
  ('108', FALSE, FALSE), -- [108] Status: CLEAR
  ('109', FALSE, FALSE); -- [109] Status: CLEAR

-- ------------------------------------------------------------------------------
-- 3. SEED DEED RECORDS (WITH SHA-256 BLOCKCHAIN HASHES)
-- Hash formula: sha256(deed_no|dag_no|seller|buyer|area|deed_date|prev_hash)
-- ------------------------------------------------------------------------------
INSERT INTO deed (deed_no, dag_no, seller, buyer, area, deed_date, hash, prev_hash, status, mutation_done) VALUES
  ('DEED-1001', '101', 'আব্দুল করিম', 'রফিকুল ইসলাম', 10, '2023-01-15', '1e08b7ca65419d6d89e903c44d4a0e0b443eea732a0381b205344ebf2011c77a', 'GENESIS', 'active', TRUE), -- [101] DEED-1001
  ('DEED-1002', '102', 'নাসির উদ্দিন', 'সুমি আক্তার', 5, '2023-02-20', 'f1b380e2b4ec0547d7d201f1ea59cdd42bed40b7276768b42a98f9bdfeb825e8', '1e08b7ca65419d6d89e903c44d4a0e0b443eea732a0381b205344ebf2011c77a', 'active', TRUE), -- [102] DEED-1002
  ('DEED-1003', '103', 'কাল্পনিক বিক্রেতা আনোয়ার', 'মোঃ রহিম', 8, '2023-03-12', '69b98083ad1826ab090760a8a004af30c47d3d19b242c9cfc704f140b009fcac', 'f1b380e2b4ec0547d7d201f1ea59cdd42bed40b7276768b42a98f9bdfeb825e8', 'active', TRUE), -- [103] DEED-1003
  ('DEED-1004', '104', 'জালাল উদ্দিন', 'কামাল হোসেন', 12, '2023-04-18', '2b5d42be4156be7be3b516348143e36c98e5e518d71bf387fb4a9f360be087c1', '69b98083ad1826ab090760a8a004af30c47d3d19b242c9cfc704f140b009fcac', 'active', TRUE), -- [104] DEED-1004
  ('DEED-1005A', '105', 'মজিবুর রহমান', 'তারেক আহমেদ', 10, '2023-05-02', '39daf85124187a863ed977bff89080b2368cc36295f26568ef234ef5b120a231', '2b5d42be4156be7be3b516348143e36c98e5e518d71bf387fb4a9f360be087c1', 'active', FALSE), -- [105] DEED-1005A
  ('DEED-1005B', '105', 'মজিবুর রহমান', 'সাকিব হাসান', 10, '2023-05-16', 'fc7dfb0c5b95e4a9b29c3ed68af212b7c560df55a74eb0b53f7777dca7bd3966', '39daf85124187a863ed977bff89080b2368cc36295f26568ef234ef5b120a231', 'active', FALSE), -- [105] DEED-1005B
  ('DEED-1006', '106', 'জাল বিক্রেতা', 'ভিকটিম ক্রেতা', 15, '2023-06-14', 'ff793ce72afc8c09d55a6cd1d8e95baff88eb2737b54a823c9fbfc0c434f9813', 'fc7dfb0c5b95e4a9b29c3ed68af212b7c560df55a74eb0b53f7777dca7bd3966', 'active', FALSE), -- [106] DEED-1006
  ('DEED-1007', '107', 'জমির মালিক খন্দকার', 'ক্রেতা মফিজ', 15, '2023-07-22', '0f2eea9fc7b716bf30a0e116ac8b7e5501e35ba4ccf22de2cb4eb6b5be8867af', 'ff793ce72afc8c09d55a6cd1d8e95baff88eb2737b54a823c9fbfc0c434f9813', 'active', FALSE), -- [107] DEED-1007
  ('DEED-1008', '108', 'সোহেল চৌধুরী', 'মামুনুর রশীদ', 8, '2023-08-10', 'ecc5adebf058065655ae716468680f414d1492ffe67c0b9131b55e584d271eb1', '0f2eea9fc7b716bf30a0e116ac8b7e5501e35ba4ccf22de2cb4eb6b5be8867af', 'active', FALSE), -- [108] DEED-1008 [TAMPERED: hash generated with area=5, stored area=8]
  ('DEED-1009', '109', 'অবৈধ দখলদার', 'প্রতারিত ক্রেতা', 20, '2023-09-25', '60a6652d875899c62d7619ce40c61099c39bf4bdba6662742c12ba9fd438d1ee', 'ecc5adebf058065655ae716468680f414d1492ffe67c0b9131b55e584d271eb1', 'active', FALSE); -- [109] DEED-1009
