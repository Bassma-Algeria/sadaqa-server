-- CreateTable
CREATE TABLE "FamilyInNeedPostNotification" (
    "notificationId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "clicked" BOOLEAN NOT NULL,
    "read" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FamilyInNeedPostNotification_pkey" PRIMARY KEY ("notificationId")
);

-- CreateTable
CREATE TABLE "CallForHelpPostNotification" (
    "notificationId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "clicked" BOOLEAN NOT NULL,
    "read" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CallForHelpPostNotification_pkey" PRIMARY KEY ("notificationId")
);
