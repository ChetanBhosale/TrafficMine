/*
  Warnings:

  - You are about to drop the `ProjectMetrics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReferralMetrics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProjectMetrics" DROP CONSTRAINT "ProjectMetrics_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ReferralMetrics" DROP CONSTRAINT "ReferralMetrics_projectId_fkey";

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "id" SET DEFAULT substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8);

-- DropTable
DROP TABLE "ProjectMetrics";

-- DropTable
DROP TABLE "ReferralMetrics";

-- DropEnum
DROP TYPE "TimeFrame";

-- CreateTable
CREATE TABLE "VisitorSession" (
    "id" CHAR(8) NOT NULL DEFAULT substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8),
    "projectId" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "sessionStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionEnd" TIMESTAMP(3),
    "deviceInfoId" TEXT NOT NULL,
    "browserInfoId" TEXT NOT NULL,
    "locationInfoId" TEXT NOT NULL,
    "visitedPages" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isFinal" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT,
    "duration" DOUBLE PRECISION,
    "page" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisitorSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisitorEvent" (
    "id" CHAR(8) NOT NULL DEFAULT substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8),
    "visitorSessionId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pageUrl" TEXT,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisitorEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceInfo" (
    "id" CHAR(8) NOT NULL DEFAULT substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8),
    "deviceType" TEXT,
    "deviceModel" TEXT,
    "operatingSystem" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeviceInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrowserInfo" (
    "id" CHAR(8) NOT NULL DEFAULT substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8),
    "browserName" TEXT,
    "browserVersion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrowserInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocationInfo" (
    "id" CHAR(8) NOT NULL DEFAULT substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8),
    "country" TEXT,
    "region" TEXT,
    "city" TEXT,
    "timezone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LocationInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VisitorSession_visitorId_key" ON "VisitorSession"("visitorId");

-- AddForeignKey
ALTER TABLE "VisitorSession" ADD CONSTRAINT "VisitorSession_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitorSession" ADD CONSTRAINT "VisitorSession_deviceInfoId_fkey" FOREIGN KEY ("deviceInfoId") REFERENCES "DeviceInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitorSession" ADD CONSTRAINT "VisitorSession_browserInfoId_fkey" FOREIGN KEY ("browserInfoId") REFERENCES "BrowserInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitorSession" ADD CONSTRAINT "VisitorSession_locationInfoId_fkey" FOREIGN KEY ("locationInfoId") REFERENCES "LocationInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitorEvent" ADD CONSTRAINT "VisitorEvent_visitorSessionId_fkey" FOREIGN KEY ("visitorSessionId") REFERENCES "VisitorSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
