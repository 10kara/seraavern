-- Переключатель голопроекции для всех визуальных записей.
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS holo_effect boolean DEFAULT true;
ALTER TABLE relationships ADD COLUMN IF NOT EXISTS holo_effect boolean DEFAULT true;
ALTER TABLE character ADD COLUMN IF NOT EXISTS holo_effect boolean DEFAULT true;
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS holo_effect boolean DEFAULT true;
