-- CreateTable
CREATE TABLE "Wilaya" (
    "wilayaNumber" INTEGER NOT NULL,
    "arabicName" TEXT NOT NULL,
    "englishName" TEXT NOT NULL,

    CONSTRAINT "Wilaya_pkey" PRIMARY KEY ("wilayaNumber")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wilaya_wilayaNumber_key" ON "Wilaya"("wilayaNumber");
