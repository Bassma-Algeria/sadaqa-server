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
import { ValidationException } from '../../../main/core/domain/exceptions/ValidationException';
import { AuthorizationException } from '../../../main/core/domain/exceptions/AuthorizationException';

describe('Make Notification Clicked', () => {
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

    it('given a make text notification clicked request, when the notification does not exist, then should fail', async () => {
        const userId = faker.datatype.uuid();
        const NOT_EXIST = faker.datatype.uuid();

        await expect(
            notificationsManager.makeNotificationClicked({ notificationId: NOT_EXIST, userId }),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.NOTIFICATION_NOT_FOUND)
            .and.to.be.an.instanceOf(NotFoundException);
    });

    it('given a make text notification clicked request, when the user is not the receiver of that notification, then should fail', async () => {
        const NOT_RECEIVER = faker.datatype.uuid();

        const receiverId = faker.datatype.uuid();
        await createTextMessageNotification(receiverId);
        const { list } = await notificationsManager.getNotifications({ receiverId });

        await expect(
            notificationsManager.makeNotificationClicked({
                notificationId: list[0].notification.notificationId,
                userId: NOT_RECEIVER,
            }),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.YOUR_ARE_NOT_THE_NOTIFICATION_RECEIVER)
            .and.to.be.an.instanceOf(AuthorizationException);
    });

    it('given a make text message notification clicked request, then should make that notification clicked', async () => {
        const receiverId = faker.datatype.uuid();

        await createTextMessageNotification(receiverId);

        const { list } = await notificationsManager.getNotifications({ receiverId });

        await notificationsManager.makeNotificationClicked({
            notificationId: list[0].notification.notificationId,
            userId: receiverId,
        });

        const { list: notificationsAfter } = await notificationsManager.getNotifications({
            receiverId,
        });

        expect(notificationsAfter[0].notification.clicked).to.equal(true);
    });

    it('given a make donation post notification clicked request, then should make that notification clicked', async () => {
        const receiverId = faker.datatype.uuid();

        await createNewDonationPostNotification(receiverId);

        const { list } = await notificationsManager.getNotifications({ receiverId });

        await notificationsManager.makeNotificationClicked({
            notificationId: list[0].notification.notificationId,
            userId: receiverId,
        });

        const { list: notificationsAfter } = await notificationsManager.getNotifications({
            receiverId,
        });

        expect(notificationsAfter[0].notification.clicked).to.equal(true);
    });

    it('given a make donation request post notification clicked request, then should make that notification clicked', async () => {
        const receiverId = faker.datatype.uuid();

        await createNewDonationRequestPostNotification(receiverId);

        const { list } = await notificationsManager.getNotifications({ receiverId });

        await notificationsManager.makeNotificationClicked({
            notificationId: list[0].notification.notificationId,
            userId: receiverId,
        });

        const { list: notificationsAfter } = await notificationsManager.getNotifications({
            receiverId,
        });

        expect(notificationsAfter[0].notification.clicked).to.equal(true);
    });

    it('given a make family in need post notification clicked request, then should make that notification clicked', async () => {
        const receiverId = faker.datatype.uuid();

        await createNewFamilyInNeedPostNotification(receiverId);

        const { list } = await notificationsManager.getNotifications({ receiverId });

        await notificationsManager.makeNotificationClicked({
            notificationId: list[0].notification.notificationId,
            userId: receiverId,
        });

        const { list: notificationsAfter } = await notificationsManager.getNotifications({
            receiverId,
        });

        expect(notificationsAfter[0].notification.clicked).to.equal(true);
    });

    it('given a make call for help post notification clicked request, then should make that notification clicked', async () => {
        const receiverId = faker.datatype.uuid();

        await createNewCallForHelpPostNotification(receiverId);

        const { list } = await notificationsManager.getNotifications({ receiverId });

        await notificationsManager.makeNotificationClicked({
            notificationId: list[0].notification.notificationId,
            userId: receiverId,
        });

        const { list: notificationsAfter } = await notificationsManager.getNotifications({
            receiverId,
        });

        expect(notificationsAfter[0].notification.clicked).to.equal(true);
    });

    it('given a notification already clicked, then when send a mek notification clicked request, then should fail', async () => {
        const receiverId = faker.datatype.uuid();

        await createNewFamilyInNeedPostNotification(receiverId);

        const { list } = await notificationsManager.getNotifications({ receiverId });

        await notificationsManager.makeNotificationClicked({
            notificationId: list[0].notification.notificationId,
            userId: receiverId,
        });

        await expect(
            notificationsManager.makeNotificationClicked({
                notificationId: list[0].notification.notificationId,
                userId: receiverId,
            }),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.NOTIFICATION_ALREADY_CLICKED)
            .and.to.be.an.instanceof(ValidationException);
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
