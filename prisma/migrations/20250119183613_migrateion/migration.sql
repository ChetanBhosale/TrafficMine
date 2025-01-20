/*
  Warnings:

  - You are about to drop the column `isBot` on the `visitor_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `visitor_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `screenResolution` on the `visitor_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `visitor_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `utmCampaign` on the `visitor_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `utmMedium` on the `visitor_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `utmSource` on the `visitor_sessions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "id" SET DEFAULT substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8);

-- AlterTable
ALTER TABLE "visitor_sessions" DROP COLUMN "isBot",
DROP COLUMN "language",
DROP COLUMN "screenResolution",
DROP COLUMN "sessionId",
DROP COLUMN "utmCampaign",
DROP COLUMN "utmMedium",
DROP COLUMN "utmSource",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "timezone" TEXT,
ALTER COLUMN "id" SET DEFAULT substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8);
