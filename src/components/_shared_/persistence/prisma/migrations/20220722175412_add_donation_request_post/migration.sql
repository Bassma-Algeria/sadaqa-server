/*
  Warnings:

  - You are about to drop the `FamilyInNeed` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "FamilyInNeed";

-- CreateTable
CREATE TABLE "DonationRequestPost" (
    "postId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "wilayaNumber" INTEGER NOT NULL,
    "pictures" TEXT[],
    "publisherId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DonationRequestPost_pkey" PRIMARY KEY ("postId")
);

-- CreateTable
CREATE TABLE "FamilyInNeedPost" (
    "postId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "wilayaNumber" INTEGER NOT NULL,
    "publisherId" TEXT NOT NULL,
    "pictures" TEXT[],
    "ccp" TEXT,
    "ccpKey" TEXT,
    "baridiMobNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FamilyInNeedPost_pkey" PRIMARY KEY ("postId")
);
