/*
  Warnings:

  - You are about to drop the column `likesCount` on the `CallForHelpPost` table. All the data in the column will be lost.
  - You are about to drop the column `likesCount` on the `DonationPost` table. All the data in the column will be lost.
  - You are about to drop the column `likesCount` on the `DonationRequestPost` table. All the data in the column will be lost.
  - You are about to drop the column `likesCount` on the `FamilyInNeedPost` table. All the data in the column will be lost.
  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "CallForHelpPost" DROP COLUMN "likesCount";

-- AlterTable
ALTER TABLE "DonationPost" DROP COLUMN "likesCount";

-- AlterTable
ALTER TABLE "DonationRequestPost" DROP COLUMN "likesCount";

-- AlterTable
ALTER TABLE "FamilyInNeedPost" DROP COLUMN "likesCount";

-- DropTable
DROP TABLE "Like";
