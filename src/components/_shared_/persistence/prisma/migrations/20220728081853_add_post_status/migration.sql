/*
  Warnings:

  - Added the required column `status` to the `CallForHelpPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `DonationPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `DonationRequestPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `FamilyInNeedPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CallForHelpPost" ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DonationPost" ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DonationRequestPost" ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FamilyInNeedPost" ADD COLUMN     "status" TEXT NOT NULL;
