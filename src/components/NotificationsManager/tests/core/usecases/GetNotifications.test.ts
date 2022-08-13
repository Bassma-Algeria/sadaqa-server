import { expect } from 'chai';
import { faker } from '@faker-js/faker';
import { anything, instance, mock, when } from 'ts-mockito';

import { aNotificationsManager } from './base/aNotificationsManager';

import { UserId } from '../../../main/core/domain/UserId';

import { PostsService } from '../../../main/core/domain/services/PostsService';
import { UsersService } from '../../../main/core/domain/services/UsersService';

import { aCreateNewDonationPostNotificationRequest } from './base/requests/aCreateNewDonationPostNotificationRequest';
import { aCreateNewCallForHelpPostNotificationRequest } from './base/requests/aCreateNewCallForHelpPostNotificationRequest';
import { aCreateNewFamilyInNeedPostNotificationRequest } from './base/requests/aCreateNewFamiyInNeedPostNotificationRequest';
import { aCreateNewDonationRequestPostNotificationRequest } from './base/requests/aCreateNewDonationRequestPostNotificationRequest';
import { ValidationException } from '../../../main/core/domain/exceptions/ValidationException';
import { ExceptionMessages } from '../../../main/core/domain/exceptions/ExceptionMessages';

describe('Get Notifications', () => {
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

    it("given a get notifications request, when the receiver didn't have any notification, then return an empty list", async () => {
        const receiverId = faker.datatype.uuid();

        const { list } = await notificationsManager.getNotifications({ receiverId });

        expect(list).to.have.lengthOf(0);
    });

    it('given a get notifications request, when the receiver have different notifications, then return them ordered by creation time descending', async () => {
        const receiverId = faker.datatype.uuid();

        await createNewDonationPostNotifications({ receiverId, total: 1 });
        await createNewDonationRequestPostNotifications({ receiverId, total: 1 });
        await createNewCallForHelpPostNotifications({ receiverId, total: 1 });

        const { list } = await notificationsManager.getNotifications({ receiverId });

        expect(list).to.have.lengthOf(3);
        expect(list[0].notification.createdAt.getTime())
            .to.be.greaterThan(list[1].notification.createdAt.getTime())
            .and.to.be.greaterThan(list[2].notification.createdAt.getTime());
    });

    it('given a get notifications request, when the receiver have a lot of notifications, then return the total number of notifications', async () => {
        const receiverId = faker.datatype.uuid();

        await createNewDonationPostNotifications({ receiverId, total: 3 });
        await createNewCallForHelpPostNotifications({ receiverId, total: 3 });
        await createNewDonationRequestPostNotifications({ receiverId, total: 3 });

        const { total } = await notificationsManager.getNotifications({ receiverId });

        expect(total).to.equal(9);
    });

    it('given a get notifications request, when the receiver have a lot of notifications, then return the notifications page per page, 10 per time', async () => {
        const receiverId = faker.datatype.uuid();

        await createNewDonationPostNotifications({ receiverId, total: 5 });
        await createNewCallForHelpPostNotifications({ receiverId, total: 5 });
        await createNewFamilyInNeedPostNotifications({ receiverId, total: 5 });

        const { list } = await notificationsManager.getNotifications({ receiverId });

        expect(list).to.have.lengthOf(10);
    });

    it('given a get notifications request, when the receiver have a lot of notifications, and no page specified, then return the first page by default', async () => {
        const receiverId = faker.datatype.uuid();

        await createNewDonationPostNotifications({ receiverId, total: 5 });
        await createNewCallForHelpPostNotifications({ receiverId, total: 5 });

        await createNewCallForHelpPostNotifications({ receiverId, total: 1 });
        await createNewFamilyInNeedPostNotifications({ receiverId, total: 8 });
        await createNewDonationRequestPostNotifications({ receiverId, total: 1 });

        const { list } = await notificationsManager.getNotifications({ receiverId });

        expect(list[0].type).to.equal('NEW_DONATION_REQUEST_POST');
        expect(list[9].type).to.equal('NEW_CALL_FOR_HELP_POST');
    });

    it('given a get notifications request, when the receiver have a lot of notifications, then should be able to return any sepcific page', async () => {
        const receiverId = faker.datatype.uuid();

        await createNewDonationPostNotifications({ receiverId, total: 1 });
        await createNewDonationRequestPostNotifications({ receiverId, total: 3 });
        await createNewCallForHelpPostNotifications({ receiverId, total: 1 });

        await createNewFamilyInNeedPostNotifications({ receiverId, total: 10 });

        const { list } = await notificationsManager.getNotifications({ receiverId, page: 2 });

        expect(list).to.have.lengthOf(5);
        expect(list[0].type).to.equal('NEW_CALL_FOR_HELP_POST');
        expect(list[4].type).to.equal('NEW_DONATION_POST');
    });

    it('given a get notifications request, when the receiver have a lot of notifications, then should return the page we are in', async () => {
        const receiverId = faker.datatype.uuid();

        await createNewCallForHelpPostNotifications({ receiverId, total: 5 });
        await createNewFamilyInNeedPostNotifications({ receiverId, total: 10 });

        const { page: page1 } = await notificationsManager.getNotifications({
            receiverId,
            page: 1,
        });
        const { page: page2 } = await notificationsManager.getNotifications({
            receiverId,
            page: 2,
        });

        expect(page1).to.equal(1);
        expect(page2).to.equal(2);
    });

    it('given a get notifications request, when there is a page number, then it should be bigger than 0', async () => {
        const receiverId = faker.datatype.uuid();

        await expect(notificationsManager.getNotifications({ receiverId, page: -1 }))
            .to.eventually.be.rejectedWith(ExceptionMessages.INVALID_PAGE_NUMBER)
            .and.to.be.an.instanceof(ValidationException);
        await expect(notificationsManager.getNotifications({ receiverId, page: 0 }))
            .to.eventually.be.rejectedWith(ExceptionMessages.INVALID_PAGE_NUMBER)
            .and.to.be.an.instanceof(ValidationException);
    });

    it('given a get notifications request, when the receiver have a lot of notifications, then should return the whether we are in the last page or not', async () => {
        const receiverId = faker.datatype.uuid();

        await createNewCallForHelpPostNotifications({ receiverId, total: 5 });
        await createNewFamilyInNeedPostNotifications({ receiverId, total: 10 });

        const { end: end1 } = await notificationsManager.getNotifications({
            receiverId,
            page: 1,
        });
        const { end: end2 } = await notificationsManager.getNotifications({
            receiverId,
            page: 2,
        });

        expect(end1).to.equal(false);
        expect(end2).to.equal(true);
    });

    const createNewDonationPostNotifications = async (args: {
        receiverId: string;
        total: number;
    }) => {
        when(postsServiceMock.getPublishersOfDonationRequestsThatMatch(anything())).thenResolve([
            new UserId(args.receiverId),
        ]);

        for (let i = 0; i < args.total; i++)
            await notificationsManager.createNewDonationPostNotification(
                aCreateNewDonationPostNotificationRequest(),
            );
    };

    const createNewCallForHelpPostNotifications = async (args: {
        receiverId: string;
        total: number;
    }) => {
        when(usersServiceMock.getIdsOfUsersInWilaya(anything())).thenResolve([
            new UserId(args.receiverId),
        ]);

        for (let i = 0; i < args.total; i++)
            await notificationsManager.createNewCallForHelpPostNotification(
                aCreateNewCallForHelpPostNotificationRequest(),
            );
    };

    const createNewFamilyInNeedPostNotifications = async (args: {
        receiverId: string;
        total: number;
    }) => {
        when(usersServiceMock.getIdsOfUsersInWilaya(anything())).thenResolve([
            new UserId(args.receiverId),
        ]);

        for (let i = 0; i < args.total; i++)
            await notificationsManager.createNewFamilyInNeedPostNotification(
                aCreateNewFamilyInNeedPostNotificationRequest(),
            );
    };

    const createNewDonationRequestPostNotifications = async (args: {
        receiverId: string;
        total: number;
    }) => {
        when(postsServiceMock.getPublishersOfDonationsThatMatch(anything())).thenResolve([
            new UserId(args.receiverId),
        ]);

        for (let i = 0; i < args.total; i++)
            await notificationsManager.createNewDonationRequestPostNotification(
                aCreateNewDonationRequestPostNotificationRequest(),
            );
    };
});
