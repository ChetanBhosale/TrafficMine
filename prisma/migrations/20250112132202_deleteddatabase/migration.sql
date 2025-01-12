-- AlterTable
ALTER TABLE "BrowserInfo" ALTER COLUMN "id" SET DEFAULT substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8);

-- AlterTable
ALTER TABLE "DeviceInfo" ALTER COLUMN "id" SET DEFAULT substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8);

-- AlterTable
ALTER TABLE "LocationInfo" ALTER COLUMN "id" SET DEFAULT substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8);

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "id" SET DEFAULT substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8);

-- AlterTable
ALTER TABLE "VisitorEvent" ALTER COLUMN "id" SET DEFAULT substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8);

-- AlterTable
ALTER TABLE "VisitorSession" ALTER COLUMN "id" SET DEFAULT substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8);
