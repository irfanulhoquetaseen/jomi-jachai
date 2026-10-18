-- Add original_area column to deed table for demo tampering and restoration
alter table deed add column if not exists original_area numeric;
