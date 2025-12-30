-- Add isPinNav flag to notices
ALTER TABLE "notices" ADD COLUMN IF NOT EXISTS "isPinNav" BOOLEAN NOT NULL DEFAULT false;
