-- ==============================================================================
-- JOMI JACHAI DATABASE SCHEMA
-- ==============================================================================

-- Clean up existing tables if recreating
DROP TABLE IF EXISTS deed CASCADE;
DROP TABLE IF EXISTS land_status CASCADE;
DROP TABLE IF EXISTS khatian CASCADE;

-- 1. KHATIAN TABLE (Record of Rights / Record Book)
CREATE TABLE IF NOT EXISTS khatian (
    id SERIAL PRIMARY KEY,
    mouza TEXT NOT NULL,
    dag_no TEXT UNIQUE NOT NULL,
    owner_name TEXT NOT NULL,
    total_area NUMERIC NOT NULL,
    remaining_area NUMERIC NOT NULL,
    land_type TEXT NOT NULL CHECK (land_type IN ('normal', 'khas')),
    mutation_status TEXT NOT NULL CHECK (mutation_status IN ('none', 'pending', 'done'))
);

-- 2. DEED TABLE (Land Sale Deeds / Registration Chain)
CREATE TABLE IF NOT EXISTS deed (
    id SERIAL PRIMARY KEY,
    deed_no TEXT UNIQUE NOT NULL,
    dag_no TEXT NOT NULL,
    seller TEXT NOT NULL,
    buyer TEXT NOT NULL,
    area NUMERIC NOT NULL,
    deed_date DATE NOT NULL,
    hash TEXT NOT NULL,
    prev_hash TEXT NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL,
    mutation_done BOOLEAN DEFAULT FALSE NOT NULL
);

-- 3. LAND STATUS TABLE (Disputes & Encumbrance Status)
CREATE TABLE IF NOT EXISTS land_status (
    dag_no TEXT PRIMARY KEY,
    mortgaged BOOLEAN DEFAULT FALSE NOT NULL,
    court_case BOOLEAN DEFAULT FALSE NOT NULL
);

-- Helpful Indexes
CREATE INDEX IF NOT EXISTS idx_khatian_dag_no ON khatian(dag_no);
CREATE INDEX IF NOT EXISTS idx_deed_dag_no ON deed(dag_no);
CREATE INDEX IF NOT EXISTS idx_deed_deed_no ON deed(deed_no);

-- 4. PERMISSIONS & ROLES
-- Grant table and sequence permissions to service_role, postgres, anon, and authenticated
GRANT ALL ON TABLE khatian, deed, land_status TO postgres, service_role, anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, service_role, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, service_role, anon, authenticated;
