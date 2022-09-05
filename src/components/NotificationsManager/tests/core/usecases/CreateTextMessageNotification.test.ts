import { expect } from 'chai';

import { aNotificationsManager } from './base/aNotificationsManager';
import { aCreateTextMessageNotificationRequest } from './base/requests/aCreateTextMessageNotificationRequest';

describe('Create Text Message Notification', () => {
    const notificationsManager = aNotificationsManager();

    it('given a create text message notification request, then should send a notification to the receiver of that message', async () => {
        const textMessage = aCreateTextMessageNotificationRequest();
        await notificationsManager.createTextMessageNotification(textMessage);

        const { list } = await notificationsManager.getNotifications({
            receiverId: textMessage.receiverId,
        });

        expect(list[0].type).to.equal('NEW_TEXT_MESSAGE');
        expect(list[0].notification).to.have.property('messageContent', textMessage.content);
        expect(list[0].notification).to.have.property('messageSenderId', textMessage.senderId);
    });

    it('given a create text message notification request, when creating a new notification, then register the creation time', async () => {
        const textMessage = aCreateTextMessageNotificationRequest();
        await notificationsManager.createTextMessageNotification(textMessage);

        const { list } = await notificationsManager.getNotifications({
            receiverId: textMessage.receiverId,
        });

        const ONE_SECOND = 1000;
        expect(new Date().getTime() - list[0].notification.createdAt.getTime()).to.be.lessThan(
            ONE_SECOND,
        );
    });

    it('given a create text message notification request, when creating a new notification, then initialize the clicked and read to be false', async () => {
        const textMessage = aCreateTextMessageNotificationRequest();
        await notificationsManager.createTextMessageNotification(textMessage);

        const { list } = await notificationsManager.getNotifications({
            receiverId: textMessage.receiverId,
        });

        expect(list[0].notification.read).to.equal(false);
        expect(list[0].notification.clicked).to.equal(false);
    });

    it('given a create text message notification request, when creating a new notification, then number of unread notification for the receiver should increase', async () => {
        const textMessage = aCreateTextMessageNotificationRequest();

        const { total: totalBefore } = await notificationsManager.getNumberOfUnreadNotification({
            receiverId: textMessage.receiverId,
        });

        await notificationsManager.createTextMessageNotification(textMessage);

        const { total: totalAfter } = await notificationsManager.getNumberOfUnreadNotification({
            receiverId: textMessage.receiverId,
        });

        expect(totalAfter).to.equal(totalBefore + 1);
    });
});
