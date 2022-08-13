import { spy } from 'sinon';
import { expect } from 'chai';
import { faker } from '@faker-js/faker';
import { anything, instance, mock, when } from 'ts-mockito';

import { aNotificationsManager } from './base/aNotificationsManager';
import { aCreateNewDonationRequestPostNotificationRequest } from './base/requests/aCreateNewDonationRequestPostNotificationRequest';

import { UserId } from '../../../main/core/domain/UserId';

import { UsersService } from '../../../main/core/domain/services/UsersService';
import { PostsService } from '../../../main/core/domain/services/PostsService';

import { EventBus } from '../../../../_shared_/event-bus/EventBus';

describe('New Donation Request Post Notification', () => {
    const postsServiceMock = mock<PostsService>();
    const usersServiceMock = mock<UsersService>();
    const notificationsManager = aNotificationsManager({
        postsService: instance(postsServiceMock),
        usersService: instance(usersServiceMock),
    });

    beforeEach(() => {
        when(usersServiceMock.getIdsOfUsersInWilaya(anything())).thenResolve([]);
        when(postsServiceMock.getPublishersOfDonationsThatMatch(anything())).thenResolve([]);
    });

    it('given a new donation request post notification creation request, when there is a donation matches the new donation request, then should send a notification to the publisher of that donation', async () => {
        const userId = faker.datatype.uuid();
        when(postsServiceMock.getPublishersOfDonationsThatMatch(anything())).thenResolve([
            new UserId(userId),
        ]);

        const request = aCreateNewDonationRequestPostNotificationRequest();
        await notificationsManager.createNewDonationRequestPostNotification(request);

        const { list: notifications } = await notificationsManager.getNotifications({
            receiverId: userId,
        });

        expect(notifications[0].type).to.equal('NEW_DONATION_REQUEST_POST');
        expect(notifications[0].notification).to.have.property('postId', request.postId);
        expect(notifications[0].notification).to.have.property(
            'reason',
            'LIKELY_HAVING_SIMILAR_DONATION',
        );
    });

    it('given a new donation request post notification creation request, when a user have more than one donation request matches the new donation, then should send only one notification to the publisher of those donation requests', async () => {
        const userId = faker.datatype.uuid();
        when(postsServiceMock.getPublishersOfDonationsThatMatch(anything())).thenResolve([
            new UserId(userId),
            new UserId(userId),
        ]);

        const request = aCreateNewDonationRequestPostNotificationRequest();
        await notificationsManager.createNewDonationRequestPostNotification(request);

        const { list: notifications } = await notificationsManager.getNotifications({
            receiverId: userId,
        });

        expect(notifications).to.have.lengthOf(1);
        expect(notifications[0].notification).to.have.property('postId', request.postId);
    });

    it('given a new donation request post notification creation request, when there is a user in the same wilaya as the post, then should send a notification to that user', async () => {
        const userId = faker.datatype.uuid();
        when(usersServiceMock.getIdsOfUsersInWilaya(anything())).thenResolve([new UserId(userId)]);

        const request = aCreateNewDonationRequestPostNotificationRequest();
        await notificationsManager.createNewDonationRequestPostNotification(request);

        const { list: notifications } = await notificationsManager.getNotifications({
            receiverId: userId,
        });

        expect(notifications[0].type).to.equal('NEW_DONATION_REQUEST_POST');
        expect(notifications[0].notification).to.have.property('postId', request.postId);
        expect(notifications[0].notification).to.have.property('reason', 'POST_IN_RECEIVER_WILAYA');
    });

    it('given a new donation request post notification creation request, when there is a user in the same wilaya as the post and the user have donation request matches the new donation, then should send only one notification to that user and prioritize the similar donation', async () => {
        const userId = faker.datatype.uuid();
        when(usersServiceMock.getIdsOfUsersInWilaya(anything())).thenResolve([new UserId(userId)]);
        when(postsServiceMock.getPublishersOfDonationsThatMatch(anything())).thenResolve([
            new UserId(userId),
        ]);

        const request = aCreateNewDonationRequestPostNotificationRequest();
        await notificationsManager.createNewDonationRequestPostNotification(request);

        const { list: notifications } = await notificationsManager.getNotifications({
            receiverId: userId,
        });

        expect(notifications).to.have.lengthOf(1);
        expect(notifications[0].notification).to.have.property('postId', request.postId);
        expect(notifications[0].notification).to.have.property(
            'reason',
            'LIKELY_HAVING_SIMILAR_DONATION',
        );
    });

    it('given a new donation request post notification creation request, when creating a new notification, then register the creation time', async () => {
        const userId = faker.datatype.uuid();
        when(postsServiceMock.getPublishersOfDonationsThatMatch(anything())).thenResolve([
            new UserId(userId),
        ]);

        const request = aCreateNewDonationRequestPostNotificationRequest();
        await notificationsManager.createNewDonationRequestPostNotification(request);

        const { list: notifications } = await notificationsManager.getNotifications({
            receiverId: userId,
        });

        const ONE_SECOND = 1000;
        expect(
            new Date().getTime() - notifications[0].notification.createdAt.getTime(),
        ).to.be.lessThan(ONE_SECOND);
    });

    it('given a new donation request post notification creation request, when creating a new notification, then initialize the clicked and read to be false', async () => {
        const userId = faker.datatype.uuid();
        when(postsServiceMock.getPublishersOfDonationsThatMatch(anything())).thenResolve([
            new UserId(userId),
        ]);

        const request = aCreateNewDonationRequestPostNotificationRequest();
        await notificationsManager.createNewDonationRequestPostNotification(request);

        const { list: notifications } = await notificationsManager.getNotifications({
            receiverId: userId,
        });

        expect(notifications[0].notification.read).to.equal(false);
        expect(notifications[0].notification.clicked).to.equal(false);
    });

    it('given a new donation request post notification creation request, when the publisher of that donation request have a donation matches the new donation, then should not notify him', async () => {
        const userId = faker.datatype.uuid();
        when(postsServiceMock.getPublishersOfDonationsThatMatch(anything())).thenResolve([
            new UserId(userId),
        ]);

        const request = aCreateNewDonationRequestPostNotificationRequest({ publisherId: userId });
        await notificationsManager.createNewDonationRequestPostNotification(request);

        const { list: notifications } = await notificationsManager.getNotifications({
            receiverId: userId,
        });

        expect(notifications).to.have.lengthOf(0);
    });

    it('given a new donation request post notification creation request, when the publisher of that donation request is an user in the same wilaya, then should not notify her', async () => {
        const userId = faker.datatype.uuid();
        when(usersServiceMock.getIdsOfUsersInWilaya(anything())).thenResolve([new UserId(userId)]);

        const request = aCreateNewDonationRequestPostNotificationRequest({ publisherId: userId });
        await notificationsManager.createNewDonationRequestPostNotification(request);

        const { list: notifications } = await notificationsManager.getNotifications({
            receiverId: userId,
        });

        expect(notifications).to.have.lengthOf(0);
    });

    it('given a new donation request post notification creation request, for every notification created, should publish an event to the global event bus', async () => {
        const mockFn = spy();
        EventBus.getInstance().subscribeTo('NEW_DONATION_REQUEST_POST_NOTIFICATION').by(mockFn);

        const userId1 = faker.datatype.uuid();
        const userId2 = faker.datatype.uuid();
        when(usersServiceMock.getIdsOfUsersInWilaya(anything())).thenResolve([new UserId(userId1)]);
        when(postsServiceMock.getPublishersOfDonationsThatMatch(anything())).thenResolve([
            new UserId(userId2),
        ]);

        const request = aCreateNewDonationRequestPostNotificationRequest();
        await notificationsManager.createNewDonationRequestPostNotification(request);

        expect(mockFn.calledTwice).to.equal(true);

        expect(mockFn.args[0][0]).to.have.property('receiverId', userId1);
        expect(mockFn.args[0][0]).to.have.property('postId', request.postId);

        expect(mockFn.args[1][0]).to.have.property('receiverId', userId2);
        expect(mockFn.args[1][0]).to.have.property('postId', request.postId);
    });

    it("given a new donation request post notification creation request, when there is no donation request matches the new donation and no association in that wilaya, then don't send notifications to anyone", async () => {
        const mockFn = spy();
        EventBus.getInstance().subscribeTo('NEW_DONATION_REQUEST_POST_NOTIFICATION').by(mockFn);

        when(postsServiceMock.getPublishersOfDonationRequestsThatMatch(anything())).thenResolve([]);

        const request = aCreateNewDonationRequestPostNotificationRequest();
        await notificationsManager.createNewDonationRequestPostNotification(request);

        expect(mockFn.called).to.equal(false);
    });
});