import { spy } from 'sinon';
import { expect } from 'chai';
import { faker } from '@faker-js/faker';
import { anything, instance, mock, when } from 'ts-mockito';

import { UserId } from '../../../main/core/domain/UserId';

import { PostsService } from '../../../main/core/domain/services/PostsService';
import { UsersService } from '../../../main/core/domain/services/UsersService';

import { aNotificationsManager } from './base/aNotificationsManager';

import { aCreateTextMessageNotificationRequest } from './base/requests/aCreateTextMessageNotificationRequest';
import { aCreateNewDonationPostNotificationRequest } from './base/requests/aCreateNewDonationPostNotificationRequest';
import { aCreateNewCallForHelpPostNotificationRequest } from './base/requests/aCreateNewCallForHelpPostNotificationRequest';
import { aCreateNewFamilyInNeedPostNotificationRequest } from './base/requests/aCreateNewFamiyInNeedPostNotificationRequest';
import { aCreateNewDonationRequestPostNotificationRequest } from './base/requests/aCreateNewDonationRequestPostNotificationRequest';

import { ExceptionMessages } from '../../../main/core/domain/exceptions/ExceptionMessages';
import { NotFoundException } from '../../../main/core/domain/exceptions/NotFoundException';
import { AuthorizationException } from '../../../main/core/domain/exceptions/AuthorizationException';

import { EventBus } from '../../../../_shared_/event-bus/EventBus';

describe('Make Notification Read', () => {
    const postsServiceMock = mock<PostsService>();
    const usersServiceMock = mock<UsersService>();
    const notificationsManager = aNotificationsManager({
        postsService: instance(postsServiceMock),
        usersService: instance(usersServiceMock),
    });

    beforeEach(() => {
        when(usersServiceMock.getIdsOfUsersInWilaya(anything())).thenResolve([]);
        when(usersServiceMock.getIdsOfAssociationsInWilaya(anything())).thenResolve([]);

        when(postsServiceMock.getPublishersOfDonationsThatMatch(anything())).thenResolve([]);
        when(postsServiceMock.getPublishersOfDonationRequestsThatMatch(anything())).thenResolve([]);
    });

    it('given a make text notification read request, when the notification does not exist, then should fail', async () => {
        const userId = faker.datatype.uuid();
        const NOT_EXIST = faker.datatype.uuid();

        await expect(
            notificationsManager.makeNotificationRead({ notificationId: NOT_EXIST, userId }),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.NOTIFICATION_NOT_FOUND)
            .and.to.be.an.instanceOf(NotFoundException);
    });

    it('given a make text notification read request, when the user is not the receiver of that notification, then should fail', async () => {
        const NOT_RECEIVER = faker.datatype.uuid();

        const receiverId = faker.datatype.uuid();
        await createTextMessageNotification(receiverId);
        const { list } = await notificationsManager.getNotifications({ receiverId });

        await expect(
            notificationsManager.makeNotificationRead({
                notificationId: list[0].notification.notificationId,
                userId: NOT_RECEIVER,
            }),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.YOUR_ARE_NOT_THE_NOTIFICATION_RECEIVER)
            .and.to.be.an.instanceOf(AuthorizationException);
    });

    it('given a make text message notification read request, then should make that notification read', async () => {
        const receiverId = faker.datatype.uuid();

        await createTextMessageNotification(receiverId);

        const { list } = await notificationsManager.getNotifications({ receiverId });

        await notificationsManager.makeNotificationRead({
            notificationId: list[0].notification.notificationId,
            userId: receiverId,
        });

        const { list: notificationsAfter } = await notificationsManager.getNotifications({
            receiverId,
        });

        expect(notificationsAfter[0].notification.read).to.equal(true);
    });

    it('given a make donation post notification read request, then should make that notification read', async () => {
        const receiverId = faker.datatype.uuid();

        await createNewDonationPostNotification(receiverId);

        const { list } = await notificationsManager.getNotifications({ receiverId });

        await notificationsManager.makeNotificationRead({
            notificationId: list[0].notification.notificationId,
            userId: receiverId,
        });

        const { list: notificationsAfter } = await notificationsManager.getNotifications({
            receiverId,
        });

        expect(notificationsAfter[0].notification.read).to.equal(true);
    });

    it('given a make donation request post notification read request, then should make that notification read', async () => {
        const receiverId = faker.datatype.uuid();

        await createNewDonationRequestPostNotification(receiverId);

        const { list } = await notificationsManager.getNotifications({ receiverId });

        await notificationsManager.makeNotificationRead({
            notificationId: list[0].notification.notificationId,
            userId: receiverId,
        });

        const { list: notificationsAfter } = await notificationsManager.getNotifications({
            receiverId,
        });

        expect(notificationsAfter[0].notification.read).to.equal(true);
    });

    it('given a make family in need post notification read request, then should make that notification read', async () => {
        const receiverId = faker.datatype.uuid();

        await createNewFamilyInNeedPostNotification(receiverId);

        const { list } = await notificationsManager.getNotifications({ receiverId });

        await notificationsManager.makeNotificationRead({
            notificationId: list[0].notification.notificationId,
            userId: receiverId,
        });

        const { list: notificationsAfter } = await notificationsManager.getNotifications({
            receiverId,
        });

        expect(notificationsAfter[0].notification.read).to.equal(true);
    });

    it('given a make call for help post notification read request, then should make that notification read', async () => {
        const receiverId = faker.datatype.uuid();

        await createNewCallForHelpPostNotification(receiverId);

        const { list } = await notificationsManager.getNotifications({ receiverId });

        await notificationsManager.makeNotificationRead({
            notificationId: list[0].notification.notificationId,
            userId: receiverId,
        });

        const { list: notificationsAfter } = await notificationsManager.getNotifications({
            receiverId,
        });

        expect(notificationsAfter[0].notification.read).to.equal(true);
    });

    it('given a make notification read request, then after updating the read status of the notification, should publish an event to the globale event bus', async () => {
        const mockFn = spy();
        EventBus.getInstance().subscribeTo('NOTIFICATION_READ').by(mockFn);

        const receiverId = faker.datatype.uuid();
        await createNewCallForHelpPostNotification(receiverId);
        const { list } = await notificationsManager.getNotifications({ receiverId });

        const notificationId = list[0].notification.notificationId;
        await notificationsManager.makeNotificationRead({ notificationId, userId: receiverId });

        expect(mockFn.calledOnce).to.equal(true);
        expect(mockFn.args[0][0]).to.have.property('notificationId', notificationId);
    });

    const createNewDonationPostNotification = async (receiverId: string) => {
        when(postsServiceMock.getPublishersOfDonationRequestsThatMatch(anything())).thenResolve([
            new UserId(receiverId),
        ]);

        await notificationsManager.createNewDonationPostNotification(
            aCreateNewDonationPostNotificationRequest(),
        );
    };

    const createNewCallForHelpPostNotification = async (receiverId: string) => {
        when(usersServiceMock.getIdsOfUsersInWilaya(anything())).thenResolve([
            new UserId(receiverId),
        ]);

        await notificationsManager.createNewCallForHelpPostNotification(
            aCreateNewCallForHelpPostNotificationRequest(),
        );
    };

    const createNewFamilyInNeedPostNotification = async (receiverId: string) => {
        when(usersServiceMock.getIdsOfUsersInWilaya(anything())).thenResolve([
            new UserId(receiverId),
        ]);

        await notificationsManager.createNewFamilyInNeedPostNotification(
            aCreateNewFamilyInNeedPostNotificationRequest(),
        );
    };

    const createNewDonationRequestPostNotification = async (receiverId: string) => {
        when(postsServiceMock.getPublishersOfDonationsThatMatch(anything())).thenResolve([
            new UserId(receiverId),
        ]);

        await notificationsManager.createNewDonationRequestPostNotification(
            aCreateNewDonationRequestPostNotificationRequest(),
        );
    };

    const createTextMessageNotification = async (receiverId: string) => {
        await notificationsManager.createTextMessageNotification(
            aCreateTextMessageNotificationRequest({ receiverId }),
        );
    };
});
