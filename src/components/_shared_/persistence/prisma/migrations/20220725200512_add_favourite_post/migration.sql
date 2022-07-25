-- CreateTable
CREATE TABLE "FavouritePost" (
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "postType" TEXT NOT NULL,

    CONSTRAINT "FavouritePost_pkey" PRIMARY KEY ("userId","postId","postType")
);
