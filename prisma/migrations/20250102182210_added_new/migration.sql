/*
  Warnings:

  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TimeFrame" AS ENUM ('HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "url" TEXT,
    "image" TEXT,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectMetrics" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "timeframe" "TimeFrame" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "uniqueViews" INTEGER NOT NULL DEFAULT 0,
    "bounceRate" DOUBLE PRECISION,
    "sessionDuration" DOUBLE PRECISION,
    "avgTimeOnPage" DOUBLE PRECISION,
    "exitRate" DOUBLE PRECISION,
    "pageViews" INTEGER NOT NULL DEFAULT 0,
    "pageBounceRate" DOUBLE PRECISION,
    "avgPageLoadTime" DOUBLE PRECISION,
    "timeOnSite" DOUBLE PRECISION,
    "actions" INTEGER NOT NULL DEFAULT 0,
    "transactions" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProjectMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralMetrics" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "timeframe" "TimeFrame" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "twitter" INTEGER NOT NULL DEFAULT 0,
    "facebook" INTEGER NOT NULL DEFAULT 0,
    "instagram" INTEGER NOT NULL DEFAULT 0,
    "website" INTEGER NOT NULL DEFAULT 0,
    "email" INTEGER NOT NULL DEFAULT 0,
    "google" INTEGER NOT NULL DEFAULT 0,
    "linkedin" INTEGER NOT NULL DEFAULT 0,
    "youtube" INTEGER NOT NULL DEFAULT 0,
    "reddit" INTEGER NOT NULL DEFAULT 0,
    "pinterest" INTEGER NOT NULL DEFAULT 0,
    "tiktok" INTEGER NOT NULL DEFAULT 0,
    "snapchat" INTEGER NOT NULL DEFAULT 0,
    "telegram" INTEGER NOT NULL DEFAULT 0,
    "whatsapp" INTEGER NOT NULL DEFAULT 0,
    "github" INTEGER NOT NULL DEFAULT 0,
    "wechat" INTEGER NOT NULL DEFAULT 0,
    "other" INTEGER NOT NULL DEFAULT 0,
    "direct" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ReferralMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectMetrics_projectId_timeframe_timestamp_idx" ON "ProjectMetrics"("projectId", "timeframe", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMetrics_projectId_timeframe_timestamp_key" ON "ProjectMetrics"("projectId", "timeframe", "timestamp");

-- CreateIndex
CREATE INDEX "ReferralMetrics_projectId_timeframe_timestamp_idx" ON "ReferralMetrics"("projectId", "timeframe", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralMetrics_projectId_timeframe_timestamp_key" ON "ReferralMetrics"("projectId", "timeframe", "timestamp");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMetrics" ADD CONSTRAINT "ProjectMetrics_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralMetrics" ADD CONSTRAINT "ReferralMetrics_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
