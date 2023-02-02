/*
  Warnings:

  - Added the required column `addedAt` to the `Wilaya` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Wilaya" ADD COLUMN     "addedAt" TIMESTAMP(3) NOT NULL;
