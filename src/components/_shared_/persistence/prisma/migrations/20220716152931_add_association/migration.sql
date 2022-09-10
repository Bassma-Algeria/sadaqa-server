-- CreateTable
CREATE TABLE "Association" (
    "associationId" TEXT NOT NULL,
    "associationName" TEXT NOT NULL,
    "wilayaNumber" INTEGER NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Association_pkey" PRIMARY KEY ("associationId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Association_phone_key" ON "Association"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Association_email_key" ON "Association"("email");
