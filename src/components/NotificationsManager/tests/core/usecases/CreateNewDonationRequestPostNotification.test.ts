import { spy } from 'sinon';
import { expect } from 'chai';
import { faker } from '@faker-js/faker';
import { anything, instance, mock, when } from 'ts-mockito';

import { aNotificationsManager } from './base/aNotificationsManager';
import { aCreateNewDonationPostNotificationRequest } from './base/requests/aCreateNewDonationPostNotificationRequest';

import { UserId } from '../../../main/core/domain/UserId';

import { UsersService } from '../../../main/core/domain/services/UsersService';
import { PostsService } from '../../../main/core/domain/services/PostsService';

import { EventBus } from '../../../../_shared_/event-bus/EventBus';

describe('New Donation post notification', () => {
    const postsServiceMock = mock<PostsService>();
    const usersServiceMock = mock<UsersService>();
    const notificationsManager = aNotificationsManager({
        postsService: instance(postsServiceMock),
        usersService: instance(usersServiceMock),
    });

    beforeEach(() => {
        when(usersServiceMock.getIdsOfAssociationsInWilaya(anything())).thenResolve([]);
        when(postsServiceMock.getPublishersOfDonationRequestsThatMatch(anything())).thenResolve([]);
    });

    it('given a new donation post notification creation request, when there is a donation request matches the new donation, then should send a notification to the publisher of that donation request', async () => {
        const userId = faker.datatype.uuid();
        when(postsServiceMock.getPublishersOfDonationRequestsThatMatch(anything())).thenResolve([
            new UserId(userId),
        ]);

        const request = aCreateNewDonationPostNotificationRequest();
        await notificationsManager.createNewDonationPostNotification(request);

        const { list: notifications } = await notificationsManager.getNotifications({
            receiverId: userId,
        });

        expect(notifications[0].type).to.equal('NEW_DONATION_POST');
        expect(notifications[0].notification).to.have.property('postId', request.postId);
        expect(notifications[0].notification).to.have.property(
            'reason',
            'LIKELY_HAVING_SIMILAR_DONATION_REQUEST',
        );
    });

    it('given a new donation post notification creation request, when a user have more than one donation request matches the new donation, then should send only one notification to the publisher of those donation requests', async () => {
        const userId = faker.datatype.uuid();
        when(postsServiceMock.getPublishersOfDonationRequestsThatMatch(anything())).thenResolve([
            new UserId(userId),
            new UserId(userId),
        ]);

        const request = aCreateNewDonationPostNotificationRequest();
        await notificationsManager.createNewDonationPostNotification(request);

        const { list: notifications } = await notificationsManager.getNotifications({
            receiverId: userId,
        });

        expect(notifications).to.have.lengthOf(1);
        expect(notifications[0].notification).to.have.property('postId', request.postId);
    });

    it('given a new donation post notification creation request, when there is an association in the same wilaya as the post, then should send a notification to that association', async () => {
        const associationId = faker.datatype.uuid();
        when(usersServiceMock.getIdsOfAssociationsInWilaya(anything())).thenResolve([
            new UserId(associationId),
        ]);

        const request = aCreateNewDonationPostNotificationRequest();
        await notificationsManager.createNewDonationPostNotification(request);

        const { list: notifications } = await notificationsManager.getNotifications({
            receiverId: associationId,
        });

        expect(notifications[0].type).to.equal('NEW_DONATION_POST');
        expect(notifications[0].notification).to.have.property('postId', request.postId);
        expect(notifications[0].notification).to.have.property('reason', 'POST_IN_RECEIVER_WILAYA');
    });

    it('given a new donation post notification creation request, when there is an association in the same wilaya as the post and the association have donation request matches the new donation, then should send only one notification to that association and prioritize the similar donation request', async () => {
        const associationId = faker.datatype.uuid();
        when(usersServiceMock.getIdsOfAssociationsInWilaya(anything())).thenResolve([
            new UserId(associationId),
        ]);
        when(postsServiceMock.getPublishersOfDonationRequestsThatMatch(anything())).thenResolve([
            new UserId(associationId),
        ]);

        const request = aCreateNewDonationPostNotificationRequest();
        await notificationsManager.createNewDonationPostNotification(request);

        const { list: notifications } = await notificationsManager.getNotifications({
            receiverId: associationId,
        });

        expect(notifications).to.have.lengthOf(1);
        expect(notifications[0].notification).to.have.property('postId', request.postId);
        expect(notifications[0].notification).to.have.property(
            'reason',
            'LIKELY_HAVING_SIMILAR_DONATION_REQUEST',
        );
    });

    it('given a new donation post notification creation request, when creating a new notification, then register the creation time', async () => {
        const userId = faker.datatype.uuid();
        when(postsServiceMock.getPublishersOfDonationRequestsThatMatch(anything())).thenResolve([
            new UserId(userId),
        ]);

        const request = aCreateNewDonationPostNotificationRequest();
        await notificationsManager.createNewDonationPostNotification(request);

        const { list: notifications } = await notificationsManager.getNotifications({
            receiverId: userId,
        });

        const ONE_SECOND = 1000;
        expect(
            new Date().getTime() - notifications[0].notification.createdAt.getTime(),
        ).to.be.lessThan(ONE_SECOND);
    });

    it('given a new donation post notification creation request, when creating a new notification, then initialize the clicked and read to be false', async () => {
        const userId = faker.datatype.uuid();
        when(postsServiceMock.getPublishersOfDonationRequestsThatMatch(anything())).thenResolve([
            new UserId(userId),
        ]);

        const request = aCreateNewDonationPostNotificationRequest();
        await notificationsManager.createNewDonationPostNotification(request);

        const { list: notifications } = await notificationsManager.getNotifications({
            receiverId: userId,
        });

        expect(notifications[0].notification.read).to.equal(false);
        expect(notifications[0].notification.clicked).to.equal(false);
    });

    it('given a new donation post notification creation request, when the publisher of that donation have a donation requests matches the new donation, then should not notify him', async () => {
        const userId = faker.datatype.uuid();
        when(postsServiceMock.getPublishersOfDonationRequestsThatMatch(anything())).thenResolve([
            new UserId(userId),
        ]);

        const request = aCreateNewDonationPostNotificationRequest({ publisherId: userId });
        await notificationsManager.createNewDonationPostNotification(request);

        const { list: notifications } = await notificationsManager.getNotifications({
            receiverId: userId,
        });

        expect(notifications).to.have.lengthOf(0);
    });

    it('given a new donation post notification creation request, when the publisher of that donation is an association in the same wilaya, then should not notify her', async () => {
        const associationId = faker.datatype.uuid();
        when(usersServiceMock.getIdsOfAssociationsInWilaya(anything())).thenResolve([
            new UserId(associationId),
        ]);

        const request = aCreateNewDonationPostNotificationRequest({ publisherId: associationId });
        await notificationsManager.createNewDonationPostNotification(request);

        const { list: notifications } = await notificationsManager.getNotifications({
            receiverId: associationId,
        });

        expect(notifications).to.have.lengthOf(0);
    });

    it('given a new donation post notification creation request, for every notification created, should publish an event to the global event bus', async () => {
        const mockFn = spy();
        EventBus.getInstance().subscribeTo('NEW_DONATION_POST_NOTIFICATION').by(mockFn);

        const userId = faker.datatype.uuid();
        const associationId = faker.datatype.uuid();
        when(postsServiceMock.getPublishersOfDonationRequestsThatMatch(anything())).thenResolve([
            new UserId(userId),
        ]);
        when(usersServiceMock.getIdsOfAssociationsInWilaya(anything())).thenResolve([
            new UserId(associationId),
        ]);

        const request = aCreateNewDonationPostNotificationRequest();
        await notificationsManager.createNewDonationPostNotification(request);

        expect(mockFn.calledTwice).to.equal(true);

        expect(mockFn.args[0][0]).to.have.property('receiverId', associationId);
        expect(mockFn.args[0][0]).to.have.property('postId', request.postId);

        expect(mockFn.args[1][0]).to.have.property('receiverId', userId);
        expect(mockFn.args[1][0]).to.have.property('postId', request.postId);
    });

    it("given a new donation post notification creation request, when there is no donation request matches the new donation and no association in that wilaya, then don't send notifications to anyone", async () => {
        const mockFn = spy();
        EventBus.getInstance().subscribeTo('NEW_DONATION_POST_NOTIFICATION').by(mockFn);

        when(postsServiceMock.getPublishersOfDonationRequestsThatMatch(anything())).thenResolve([]);

        const request = aCreateNewDonationPostNotificationRequest();
        await notificationsManager.createNewDonationPostNotification(request);

        expect(mockFn.called).to.equal(false);
    });
});