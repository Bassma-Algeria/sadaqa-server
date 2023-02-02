/*
  Warnings:

  - The primary key for the `Wilaya` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `arabicName` on the `Wilaya` table. All the data in the column will be lost.
  - You are about to drop the column `englishName` on the `Wilaya` table. All the data in the column will be lost.
  - You are about to drop the column `wilayaNumber` on the `Wilaya` table. All the data in the column will be lost.
  - Added the required column `code` to the `Wilaya` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Wilaya` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Wilaya" DROP CONSTRAINT "Wilaya_pkey",
DROP COLUMN "arabicName",
DROP COLUMN "englishName",
DROP COLUMN "wilayaNumber",
ADD COLUMN     "code" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD CONSTRAINT "Wilaya_pkey" PRIMARY KEY ("code");
