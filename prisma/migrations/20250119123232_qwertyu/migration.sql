-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "id" SET DEFAULT substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8);

-- AlterTable
ALTER TABLE "visitor_sessions" ALTER COLUMN "id" SET DEFAULT substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8);
