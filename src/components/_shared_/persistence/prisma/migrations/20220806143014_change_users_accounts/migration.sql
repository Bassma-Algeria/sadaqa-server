/*
  Warnings:

  - You are about to drop the `Association` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Association";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "RegularUserAccount" (
    "accountId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "wilayaNumber" INTEGER NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegularUserAccount_pkey" PRIMARY KEY ("accountId")
);

-- CreateTable
CREATE TABLE "AssociationAccount" (
    "accountId" TEXT NOT NULL,
    "associationName" TEXT NOT NULL,
    "wilayaNumber" INTEGER NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssociationAccount_pkey" PRIMARY KEY ("accountId")
);

-- CreateIndex
CREATE UNIQUE INDEX "RegularUserAccount_phoneNumber_key" ON "RegularUserAccount"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "RegularUserAccount_email_key" ON "RegularUserAccount"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AssociationAccount_phoneNumber_key" ON "AssociationAccount"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "AssociationAccount_email_key" ON "AssociationAccount"("email");
