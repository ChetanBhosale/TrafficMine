/*
  Warnings:

  - You are about to drop the `BrowserInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DeviceInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LocationInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VisitorEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VisitorSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LocationInfoToVisitorSession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_userId_fkey";

-- DropForeignKey
ALTER TABLE "VisitorEvent" DROP CONSTRAINT "VisitorEvent_visitorSessionId_fkey";

-- DropForeignKey
ALTER TABLE "VisitorSession" DROP CONSTRAINT "VisitorSession_browserInfoId_fkey";

-- DropForeignKey
ALTER TABLE "VisitorSession" DROP CONSTRAINT "VisitorSession_deviceInfoId_fkey";

-- DropForeignKey
ALTER TABLE "VisitorSession" DROP CONSTRAINT "VisitorSession_projectId_fkey";

-- DropForeignKey
ALTER TABLE "_LocationInfoToVisitorSession" DROP CONSTRAINT "_LocationInfoToVisitorSession_A_fkey";

-- DropForeignKey
ALTER TABLE "_LocationInfoToVisitorSession" DROP CONSTRAINT "_LocationInfoToVisitorSession_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" TIMESTAMP(3),
ALTER COLUMN "id" SET DEFAULT substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8);

-- DropTable
DROP TABLE "BrowserInfo";

-- DropTable
DROP TABLE "DeviceInfo";

-- DropTable
DROP TABLE "LocationInfo";

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "VisitorEvent";

-- DropTable
DROP TABLE "VisitorSession";

-- DropTable
DROP TABLE "_LocationInfoToVisitorSession";

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" CHAR(8) NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" CHAR(8) NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
