/*
  Warnings:

  - You are about to drop the column `brand` on the `visitor_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `browser` on the `visitor_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `visitor_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `visitor_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `device` on the `visitor_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `pages` on the `visitor_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `visitor_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `visitor_sessions` table. All the data in the column will be lost.
  - Added the required column `page` to the `visitor_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "id" SET DEFAULT substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8);

-- AlterTable
ALTER TABLE "visitor_sessions" DROP COLUMN "brand",
DROP COLUMN "browser",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "device",
DROP COLUMN "pages",
DROP COLUMN "region",
DROP COLUMN "timezone",
ADD COLUMN     "isBot" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "page" TEXT NOT NULL,
ADD COLUMN     "referrer" TEXT,
ADD COLUMN     "screenResolution" TEXT,
ADD COLUMN     "sessionId" TEXT,
ADD COLUMN     "userMetadata" JSONB,
ADD COLUMN     "utmCampaign" TEXT,
ADD COLUMN     "utmMedium" TEXT,
ADD COLUMN     "utmSource" TEXT,
ADD COLUMN     "visitedPages" TEXT[],
ALTER COLUMN "id" SET DEFAULT substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8);

-- CreateIndex
CREATE INDEX "visitor_sessions_visitorId_idx" ON "visitor_sessions"("visitorId");

-- CreateIndex
CREATE INDEX "visitor_sessions_projectId_idx" ON "visitor_sessions"("projectId");

-- CreateIndex
CREATE INDEX "visitor_sessions_sessionStart_idx" ON "visitor_sessions"("sessionStart");
