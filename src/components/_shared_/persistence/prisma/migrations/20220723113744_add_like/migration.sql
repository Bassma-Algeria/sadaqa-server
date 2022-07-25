-- CreateTable
CREATE TABLE "Like" (
    "likerId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "postType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("likerId","postId","postType")
);
