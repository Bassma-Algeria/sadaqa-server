-- CreateTable
CREATE TABLE "PostShare" (
    "postId" TEXT NOT NULL,
    "postType" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostShare_pkey" PRIMARY KEY ("postId","postType","createdAt")
);
