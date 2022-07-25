/*
  Warnings:

  - Added the required column `likesCount` to the `CallForHelpPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `likesCount` to the `DonationPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `likesCount` to the `DonationRequestPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `likesCount` to the `FamilyInNeedPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CallForHelpPost" ADD COLUMN     "likesCount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "DonationPost" ADD COLUMN     "likesCount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "DonationRequestPost" ADD COLUMN     "likesCount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "FamilyInNeedPost" ADD COLUMN     "likesCount" INTEGER NOT NULL;
