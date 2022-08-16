import { spy } from 'sinon';
import { expect } from 'chai';
import { faker } from '@faker-js/faker';
import { anything, instance, mock, when } from 'ts-mockito';

import { aNotificationsManager } from './base/aNotificationsManager';
import { aCreateNewCallForHelpPostNotificationRequest } from './base/requests/aCreateNewCallForHelpPostNotificationRequest';

import { UserId } from '../../../main/core/domain/UserId';

import { UsersService } from '../../../main/core/domain/services/UsersService';

import { EventBus } from '../../../../_shared_/event-bus/EventBus';

describe('New Call for Help Post Notification', () => {
    const usersServiceMock = mock<UsersService>();
    const notificationsManager = aNotificationsManager({
        usersService: instance(usersServiceMock),
    });

    beforeEach(() => {
        when(usersServiceMock.getIdsOfUsersInWilaya(anything())).thenResolve([]);
    });

    it('given a new call for help post notification creation request, when there is a user in the same wilaya as the post, then should send a notification to that user', async () => {
        const userId = faker.datatype.uuid();
        when(usersServiceMock.getIdsOfUsersInWilaya(anything())).thenResolve([new UserId(userId)]);

        const request = aCreateNewCallForHelpPostNotificationRequest();
        await notificationsManager.createNewCallForHelpPostNotification(request);

        const { list: notifications } = await notificationsManager.getNotifications({
            receiverId: userId,
        });

        expect(notifications).to.have.lengthOf(1);
        expect(notifications[0].type).to.equal('NEW_CALL_FOR_HELP_POST');
        expect(notifications[0].notification).to.have.property('postId', request.postId);
        expect(notifications[0].notification).to.have.property('reason', 'POST_IN_RECEIVER_WILAYA');
    });

    it('given a new call for help post notification creation request, when creating a new notification, then register the creation time', async () => {
        const userId = faker.datatype.uuid();
        when(usersServiceMock.getIdsOfUsersInWilaya(anything())).thenResolve([new UserId(userId)]);

        const request = aCreateNewCallForHelpPostNotificationRequest();
        await notificationsManager.createNewCallForHelpPostNotification(request);

        const { list: notifications } = await notificationsManager.getNotifications({
            receiverId: userId,
        });

        const ONE_SECOND = 1000;
        expect(
            new Date().getTime() - notifications[0].notification.createdAt.getTime(),
        ).to.be.lessThan(ONE_SECOND);
    });

    it('given a new call for help post notification creation request, when creating a new notification, then initialize the clicked and read to be false', async () => {
        const userId = faker.datatype.uuid();
        when(usersServiceMock.getIdsOfUsersInWilaya(anything())).thenResolve([new UserId(userId)]);

        const request = aCreateNewCallForHelpPostNotificationRequest();
        await notificationsManager.createNewCallForHelpPostNotification(request);

        const { list: notifications } = await notificationsManager.getNotifications({
            receiverId: userId,
        });

        expect(notifications[0].notification.read).to.equal(false);
        expect(notifications[0].notification.clicked).to.equal(false);
    });

    it('given a new call for help post notification creation request, when creating a new notification, then number of unread notification for the receiver should increase', async () => {
        const userId = faker.datatype.uuid();
        when(usersServiceMock.getIdsOfUsersInWilaya(anything())).thenResolve([new UserId(userId)]);

        const { total: totalBefore } = await notificationsManager.getNumberOfUnreadNotification({
            receiverId: userId,
        });

        const request = aCreateNewCallForHelpPostNotificationRequest();
        await notificationsManager.createNewCallForHelpPostNotification(request);

        const { total: totalAfter } = await notificationsManager.getNumberOfUnreadNotification({
            receiverId: userId,
        });

        expect(totalAfter).to.equal(totalBefore + 1);
    });

    it('given a new call for help post notification creation request, when the publisher of that call for help is an user in the same wilaya, then should not notify him', async () => {
        const userId = faker.datatype.uuid();
        when(usersServiceMock.getIdsOfUsersInWilaya(anything())).thenResolve([new UserId(userId)]);

        const request = aCreateNewCallForHelpPostNotificationRequest({ publisherId: userId });
        await notificationsManager.createNewCallForHelpPostNotification(request);

        const { list: notifications } = await notificationsManager.getNotifications({
            receiverId: userId,
        });

        expect(notifications).to.have.lengthOf(0);
    });

    it('given a new call for help post notification creation request, for every notification created, should publish an event to the global event bus', async () => {
        const mockFn = spy();
        EventBus.getInstance().subscribeTo('NEW_CALL_FOR_HELP_POST_NOTIFICATION').by(mockFn);

        const userId1 = faker.datatype.uuid();
        const userId2 = faker.datatype.uuid();
        when(usersServiceMock.getIdsOfUsersInWilaya(anything())).thenResolve([
            new UserId(userId1),
            new UserId(userId2),
        ]);

        const request = aCreateNewCallForHelpPostNotificationRequest();
        await notificationsManager.createNewCallForHelpPostNotification(request);

        expect(mockFn.calledTwice).to.equal(true);

        expect(mockFn.args[0][0]).to.have.property('receiverId', userId1);
        expect(mockFn.args[0][0]).to.have.property('postId', request.postId);

        expect(mockFn.args[1][0]).to.have.property('receiverId', userId2);
        expect(mockFn.args[1][0]).to.have.property('postId', request.postId);
    });

    it("given a new call for help post notification creation request, when there is no users found in the same wilaya as the post, then don't send notifications to anyone", async () => {
        const mockFn = spy();
        EventBus.getInstance().subscribeTo('NEW_CALL_FOR_HELP_POST_NOTIFICATION').by(mockFn);

        when(usersServiceMock.getIdsOfUsersInWilaya(anything())).thenResolve([]);

        await notificationsManager.createNewCallForHelpPostNotification(
            aCreateNewCallForHelpPostNotificationRequest(),
        );

        expect(mockFn.called).to.equal(false);
    });
});
