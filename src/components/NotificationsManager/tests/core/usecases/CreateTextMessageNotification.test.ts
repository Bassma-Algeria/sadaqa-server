import { expect } from 'chai';

import { aNotificationsManager } from './base/aNotificationsManager';
import { aCreateTextMessageNotificationRequest } from './base/requests/aCreateTextMessageNotificationRequest';
import { spy } from 'sinon';
import { EventBus } from '../../../../_shared_/event-bus/EventBus';

describe('Create Text Message Notification', () => {
    const notificationManager = aNotificationsManager();

    it('given a create text message notification request, then should send a notification to the receiver of that message', async () => {
        const textMessage = aCreateTextMessageNotificationRequest();
        await notificationManager.createTextMessageNotification(textMessage);

        const { list } = await notificationManager.getNotifications({
            receiverId: textMessage.receiverId,
        });

        expect(list[0].type).to.equal('NEW_TEXT_MESSAGE');
        expect(list[0].notification).to.have.property('messageContent', textMessage.content);
        expect(list[0].notification).to.have.property('messageSenderId', textMessage.senderId);
    });

    it('given a create text message notification request, when creating a new notification, then register the creation time', async () => {
        const textMessage = aCreateTextMessageNotificationRequest();
        await notificationManager.createTextMessageNotification(textMessage);

        const { list } = await notificationManager.getNotifications({
            receiverId: textMessage.receiverId,
        });

        const ONE_SECOND = 1000;
        expect(new Date().getTime() - list[0].notification.createdAt.getTime()).to.be.lessThan(
            ONE_SECOND,
        );
    });

    it('given a create text message notification request, when creating a new notification, then initialize the clicked and read to be false', async () => {
        const textMessage = aCreateTextMessageNotificationRequest();
        await notificationManager.createTextMessageNotification(textMessage);

        const { list } = await notificationManager.getNotifications({
            receiverId: textMessage.receiverId,
        });

        expect(list[0].notification.read).to.equal(false);
        expect(list[0].notification.clicked).to.equal(false);
    });

    it('given a create text message notification request, when creating the notification, should publish an event to the global event bus', async () => {
        const mockFn = spy();
        EventBus.getInstance().subscribeTo('NEW_TEXT_MESSAGE_NOTIFICATION').by(mockFn);

        const textMessage = aCreateTextMessageNotificationRequest();
        await notificationManager.createTextMessageNotification(textMessage);

        expect(mockFn.calledOnce).to.equal(true);

        expect(mockFn.args[0][0]).to.have.property('receiverId', textMessage.receiverId);
    });
});
