import { expect } from 'chai';
import { INestApplication } from '@nestjs/common';

import { startNestTestingApp } from './base/SetupNestE2E';

import { sendTextMessage } from './base/operations/messages/sendTextMessage';
import { registerRegularUser } from './base/operations/users/registerRegularUser';
import { getRegularUserByToken } from './base/operations/users/getRegularUserByToken';
import { getNotifications } from './base/operations/notifications/getNotifications';
import { makeNotificationRead } from './base/operations/notifications/makeNotificationRead';
import { makeNotificationClicked } from './base/operations/notifications/makeNotificationClicked';

describe('Change Notification Status (read & clicked)', () => {
    let app: INestApplication;
    let server: any;

    before(async () => {
        app = await startNestTestingApp();
        server = app.getHttpServer();
    });

    after(async () => {
        await app.close();
    });

    it('a user register, he receive a new notification, then he see it, and the notification become read', async () => {
        const { accessToken } = await registerRegularUser(server);
        const {
            info: { accountId },
        } = await getRegularUserByToken(server, accessToken);

        await sendNotificationTo(accountId);

        const { list } = await getNotifications(server, accessToken);

        await makeNotificationRead(server, accessToken, list[0].notification.notificationId);

        const { list: notificationsAfter } = await getNotifications(server, accessToken);

        expect(notificationsAfter[0].notification).to.have.property('read', true);
    });

    it('a user register, he receive a new notification, then he click on it, and the notification become clicked', async () => {
        const { accessToken } = await registerRegularUser(server);
        const {
            info: { accountId },
        } = await getRegularUserByToken(server, accessToken);

        await sendNotificationTo(accountId);

        const { list } = await getNotifications(server, accessToken);

        await makeNotificationClicked(server, accessToken, list[0].notification.notificationId);

        const { list: notificationsAfter } = await getNotifications(server, accessToken);

        expect(notificationsAfter[0].notification).to.have.property('clicked', true);
    });

    const sendNotificationTo = async (receiverId: string) => {
        const { accessToken: token2 } = await registerRegularUser(server);

        await sendTextMessage(server, token2, { receiverId });
        await delay(30);
    };

    const delay = async (period: number) => {
        return new Promise(resolve => {
            setTimeout(resolve, period);
        });
    };
});
