ALTER TABLE gallery ADD COLUMN IF NOT EXISTS holo_effect boolean DEFAULT true;
ALTER TABLE relationships ADD COLUMN IF NOT EXISTS holo_effect boolean DEFAULT true;
ALTER TABLE character ADD COLUMN IF NOT EXISTS holo_effect boolean DEFAULT true;
