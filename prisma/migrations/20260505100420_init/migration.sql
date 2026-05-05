/*
  Warnings:

  - You are about to drop the column `area` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `managerEmail` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_managerId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "area",
DROP COLUMN "managerEmail",
DROP COLUMN "position",
ALTER COLUMN "managerId" DROP NOT NULL;
