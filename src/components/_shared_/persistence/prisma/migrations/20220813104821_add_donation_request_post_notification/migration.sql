-- CreateTable
CREATE TABLE "DonationRequestPostNotification" (
    "notificationId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "clicked" BOOLEAN NOT NULL,
    "read" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DonationRequestPostNotification_pkey" PRIMARY KEY ("notificationId")
);
