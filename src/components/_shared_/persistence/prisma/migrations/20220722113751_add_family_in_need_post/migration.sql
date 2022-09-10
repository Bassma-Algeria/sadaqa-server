-- CreateTable
CREATE TABLE "FamilyInNeed" (
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

    CONSTRAINT "FamilyInNeed_pkey" PRIMARY KEY ("postId")
);
