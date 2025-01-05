/*
  Warnings:

  - You are about to drop the column `city` on the `VisitorSession` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `VisitorSession` table. All the data in the column will be lost.
  - You are about to drop the column `ip` on the `VisitorSession` table. All the data in the column will be lost.
  - You are about to drop the column `loc` on the `VisitorSession` table. All the data in the column will be lost.
  - You are about to drop the column `org` on the `VisitorSession` table. All the data in the column will be lost.
  - You are about to drop the column `postal` on the `VisitorSession` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `VisitorSession` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `VisitorSession` table. All the data in the column will be lost.

*/
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
ALTER TABLE "VisitorSession" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "ip",
DROP COLUMN "loc",
DROP COLUMN "org",
DROP COLUMN "postal",
DROP COLUMN "region",
DROP COLUMN "timezone",
ALTER COLUMN "id" SET DEFAULT substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8);
