import { expect } from 'chai';
import { faker } from '@faker-js/faker';
import { anything, instance, mock, when } from 'ts-mockito';

import { aNotificationsManager } from './base/aNotificationsManager';
import { aCreateNewFamilyInNeedPostNotificationRequest } from './base/requests/aCreateNewFamiyInNeedPostNotificationRequest';

import { UserId } from '../../../main/core/domain/UserId';

import { UsersService } from '../../../main/core/domain/services/UsersService';

describe('New Family in Need Post Notification', () => {
    const usersServiceMock = mock<UsersService>();
    const notificationsManager = aNotificationsManager({
        usersService: instance(usersServiceMock),
    });

    beforeEach(() => {
        when(usersServiceMock.getIdsOfUsersInWilaya(anything())).thenResolve([]);
    });

    it('given a new family in need post notification creation request, when there is a user in the same wilaya as the post, then should send a notification to that user', async () => {
        const userId = faker.datatype.uuid();
        when(usersServiceMock.getIdsOfUsersInWilaya(anything())).thenResolve([new UserId(userId)]);

        const request = aCreateNewFamilyInNeedPostNotificationRequest();
        await notificationsManager.createNewFamilyInNeedPostNotification(request);

        const { list: notifications } = await notificationsManager.getNotifications({
            receiverId: userId,
        });

        expect(notifications).to.have.lengthOf(1);
        expect(notifications[0].type).to.equal('NEW_FAMILY_IN_NEED_POST');
        expect(notifications[0].notification).to.have.property('postId', request.postId);
        expect(notifications[0].notification).to.have.property('reason', 'POST_IN_RECEIVER_WILAYA');
    });

    it('given a new family in need post notification creation request, when creating a new notification, then register the creation time', async () => {
        const userId = faker.datatype.uuid();
        when(usersServiceMock.getIdsOfUsersInWilaya(anything())).thenResolve([new UserId(userId)]);

        const request = aCreateNewFamilyInNeedPostNotificationRequest();
        await notificationsManager.createNewFamilyInNeedPostNotification(request);

        const { list: notifications } = await notificationsManager.getNotifications({
            receiverId: userId,
        });

        const ONE_SECOND = 1000;
        expect(
            new Date().getTime() - notifications[0].notification.createdAt.getTime(),
        ).to.be.lessThan(ONE_SECOND);
    });

    it('given a new family in need post notification creation request, when creating a new notification, then initialize the clicked and read to be false', async () => {
        const userId = faker.datatype.uuid();
        when(usersServiceMock.getIdsOfUsersInWilaya(anything())).thenResolve([new UserId(userId)]);

        const request = aCreateNewFamilyInNeedPostNotificationRequest();
        await notificationsManager.createNewFamilyInNeedPostNotification(request);

        const { list: notifications } = await notificationsManager.getNotifications({
            receiverId: userId,
        });

        expect(notifications[0].notification.read).to.equal(false);
        expect(notifications[0].notification.clicked).to.equal(false);
    });

    it('given a new family in need post notification creation request, when creating a new notification, then number of unread notification for the receiver should increase', async () => {
        const userId = faker.datatype.uuid();
        when(usersServiceMock.getIdsOfUsersInWilaya(anything())).thenResolve([new UserId(userId)]);

        const { total: totalBefore } = await notificationsManager.getNumberOfUnreadNotification({
            receiverId: userId,
        });

        const request = aCreateNewFamilyInNeedPostNotificationRequest();
        await notificationsManager.createNewFamilyInNeedPostNotification(request);

        const { total: totalAfter } = await notificationsManager.getNumberOfUnreadNotification({
            receiverId: userId,
        });

        expect(totalAfter).to.equal(totalBefore + 1);
    });

    it('given a new family in need post notification creation request, when the publisher of that family in need is an user in the same wilaya, then should not notify him', async () => {
        const userId = faker.datatype.uuid();
        when(usersServiceMock.getIdsOfUsersInWilaya(anything())).thenResolve([new UserId(userId)]);

        const request = aCreateNewFamilyInNeedPostNotificationRequest({ publisherId: userId });
        await notificationsManager.createNewFamilyInNeedPostNotification(request);

        const { list: notifications } = await notificationsManager.getNotifications({
            receiverId: userId,
        });

        expect(notifications).to.have.lengthOf(0);
    });
});
