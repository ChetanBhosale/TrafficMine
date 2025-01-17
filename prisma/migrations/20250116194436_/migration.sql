/*
  Warnings:

  - The primary key for the `Project` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `VerificationToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `VerificationToken` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `VisitorSession` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `VisitorSession` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `userId` on the `Project` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `projectId` on the `VisitorSession` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "VisitorSession" DROP CONSTRAINT "VisitorSession_projectId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP CONSTRAINT "Project_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" CHAR(12) NOT NULL DEFAULT encode(decode(replace(gen_random_uuid()::text, '-', ''), 'hex'), 'hex')::text,
DROP COLUMN "userId",
ADD COLUMN     "userId" CHAR(12) NOT NULL,
ADD CONSTRAINT "Project_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "emailVerified",
DROP COLUMN "updatedAt",
DROP COLUMN "id",
ADD COLUMN     "id" CHAR(12) NOT NULL DEFAULT encode(decode(replace(gen_random_uuid()::text, '-', ''), 'hex'), 'hex')::text,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "VerificationToken" DROP CONSTRAINT "VerificationToken_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" CHAR(12) NOT NULL DEFAULT encode(decode(replace(gen_random_uuid()::text, '-', ''), 'hex'), 'hex')::text,
ADD CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "VisitorSession" DROP CONSTRAINT "VisitorSession_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" CHAR(12) NOT NULL DEFAULT encode(decode(replace(gen_random_uuid()::text, '-', ''), 'hex'), 'hex')::text,
DROP COLUMN "projectId",
ADD COLUMN     "projectId" CHAR(12) NOT NULL,
ADD CONSTRAINT "VisitorSession_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Session";

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitorSession" ADD CONSTRAINT "VisitorSession_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
