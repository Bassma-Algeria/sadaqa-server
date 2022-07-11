-- CreateTable
CREATE TABLE "DonationPost" (
    "postId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "wilayaNumber" INTEGER NOT NULL,
    "pictures" TEXT[],
    "publisherId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DonationPost_pkey" PRIMARY KEY ("postId")
);
