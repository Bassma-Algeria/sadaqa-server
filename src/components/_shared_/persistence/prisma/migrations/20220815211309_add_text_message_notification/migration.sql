-- CreateTable
CREATE TABLE "TextMessageNotification" (
    "notificationId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "messageSenderId" TEXT NOT NULL,
    "messageContent" TEXT NOT NULL,
    "clicked" BOOLEAN NOT NULL,
    "read" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TextMessageNotification_pkey" PRIMARY KEY ("notificationId")
);
