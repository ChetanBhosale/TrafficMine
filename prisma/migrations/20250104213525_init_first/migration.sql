/*
  Warnings:

  - You are about to drop the column `locationInfoId` on the `VisitorSession` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "VisitorSession" DROP CONSTRAINT "VisitorSession_locationInfoId_fkey";

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
ALTER TABLE "VisitorSession" DROP COLUMN "locationInfoId",
ALTER COLUMN "id" SET DEFAULT substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8);

-- CreateTable
CREATE TABLE "_LocationInfoToVisitorSession" (
    "A" CHAR(8) NOT NULL,
    "B" CHAR(8) NOT NULL,

    CONSTRAINT "_LocationInfoToVisitorSession_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_LocationInfoToVisitorSession_B_index" ON "_LocationInfoToVisitorSession"("B");

-- AddForeignKey
ALTER TABLE "_LocationInfoToVisitorSession" ADD CONSTRAINT "_LocationInfoToVisitorSession_A_fkey" FOREIGN KEY ("A") REFERENCES "LocationInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LocationInfoToVisitorSession" ADD CONSTRAINT "_LocationInfoToVisitorSession_B_fkey" FOREIGN KEY ("B") REFERENCES "VisitorSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
