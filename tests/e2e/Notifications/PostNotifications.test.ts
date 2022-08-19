import { expect } from 'chai';
import { INestApplication } from '@nestjs/common';

import { cleanupDB, startNestTestingApp } from '../base/SetupNestE2E';

import { createDonation } from '../base/operations/posts/donation/createDonation';
import { registerRegularUser } from '../base/operations/users/registerRegularUser';
import { registerAssociation } from '../base/operations/users/registerAssociation';
import { getNotifications } from '../base/operations/notifications/getNotifications';
import { getAssociationByToken } from '../base/operations/users/getAssociationByToken';
import { activateAssociationAccount } from '../base/operations/users/activateAssociationAccount';
import { createCallForHelpPost } from '../base/operations/posts/call-for-help/createCallForHelp';
import { createFamilyInNeedPost } from '../base/operations/posts/family-in-need/createFamilyInNeed';
import { createDonationRequest } from '../base/operations/posts/donation-request/createDonationRequest';

describe('Post Notifications', () => {
    let app: INestApplication;
    let server: any;

    before(async () => {
        app = await startNestTestingApp();
        server = app.getHttpServer();
    });

    beforeEach(async () => {
        await cleanupDB();
    });

    after(async () => {
        await app.close();
    });

    it('a user register and publish a donation request, another user register and publish a donation that have in the title some keywords that exist in the first donation request, then a notification should be created for the first user saying that there is someone maybe have his donation request', async () => {
        const { accessToken: firstUserToken } = await registerRegularUser(server);
        const { donationRequestInfo } = await createDonationRequest(server, firstUserToken);

        const { accessToken } = await registerRegularUser(server);
        const { postId: donationId } = await createDonation(server, accessToken, {
            title: donationRequestInfo.description.slice(3, 7),
        });

        await delay(100);

        const { list } = await getNotifications(server, firstUserToken);

        expect(list).to.have.lengthOf(1);
        expect(list[0].notification).to.have.property('postId', donationId);
    });

    it('an association register, the admin activate his account, user register and publish a donation in the same wilaya as the association, then a notification should be created for that association', async () => {
        const { accessToken: associationToken, associationInfo } = await registerAssociation(
            server,
        );

        const { info } = await getAssociationByToken(server, associationToken);
        await activateAssociationAccount(server, info.accountId);

        const { accessToken } = await registerRegularUser(server);
        const { postId: donationId } = await createDonation(server, accessToken, {
            wilayaNumber: associationInfo.wilayaNumber,
        });

        await delay(100);

        const { list } = await getNotifications(server, associationToken);

        expect(list).to.have.lengthOf(1);
        expect(list[0].notification).to.have.property('postId', donationId);
    });

    it('a user register and publish a donation, another user register and publish a donation request that have in the title some keywords that exist in the first donation request, then a notification should be created for the first user', async () => {
        const { accessToken: firstUserToken } = await registerRegularUser(server);
        const { donationInfo } = await createDonation(server, firstUserToken);

        const { accessToken } = await registerRegularUser(server);
        const { postId } = await createDonationRequest(server, accessToken, {
            title: donationInfo.description.slice(3, 7),
        });

        await delay(100);

        const { list } = await getNotifications(server, firstUserToken);

        expect(list).to.have.lengthOf(1);
        expect(list[0].notification).to.have.property('postId', postId);
    });

    it('an association register, the admin activate his account, user register and publish a donation request in the same wilaya as the association, then a notification should be created for that association', async () => {
        const { accessToken: associationToken, associationInfo } = await registerAssociation(
            server,
        );

        const { info } = await getAssociationByToken(server, associationToken);
        await activateAssociationAccount(server, info.accountId);

        const { accessToken } = await registerRegularUser(server);
        const { postId } = await createDonationRequest(server, accessToken, {
            wilayaNumber: associationInfo.wilayaNumber,
        });

        await delay(100);

        const { list } = await getNotifications(server, associationToken);

        expect(list).to.have.lengthOf(1);
        expect(list[0].notification).to.have.property('postId', postId);
    });

    it('an user register, another user register and publish a donation request in the same wilaya as the first user, then a notification should be created for that first user', async () => {
        const { accessToken: userToken, userInfo } = await registerRegularUser(server);

        const { accessToken } = await registerRegularUser(server);
        const { postId } = await createDonationRequest(server, accessToken, {
            wilayaNumber: userInfo.wilayaNumber,
        });

        await delay(100);

        const { list } = await getNotifications(server, userToken);

        expect(list).to.have.lengthOf(1);
        expect(list[0].notification).to.have.property('postId', postId);
    });

    it('an user register, another association register, the admin activate it and it publish a family in need in the same wilaya as the first user, then a notification should be created for that first user', async () => {
        const { accessToken: userToken, userInfo } = await registerRegularUser(server);

        const { accessToken: associationToken } = await registerAssociation(server);
        const { info } = await getAssociationByToken(server, associationToken);
        await activateAssociationAccount(server, info.accountId);

        const { postId } = await createFamilyInNeedPost(server, associationToken, {
            wilayaNumber: userInfo.wilayaNumber,
        });

        await delay(100);

        const { list } = await getNotifications(server, userToken);

        expect(list).to.have.lengthOf(1);
        expect(list[0].notification).to.have.property('postId', postId);
    });

    it('two associations register, the admin activate them, the first one publish a family in need in the same wilaya as the second one, then a notification should be created for that second one', async () => {
        const { accessToken: firstAssociationToken } = await registerAssociation(server);
        const { info: firstAssociationInfo } = await getAssociationByToken(
            server,
            firstAssociationToken,
        );
        await activateAssociationAccount(server, firstAssociationInfo.accountId);

        const { accessToken: secondAssociationToken } = await registerAssociation(server);
        const { info: secondAssociationInfo } = await getAssociationByToken(
            server,
            secondAssociationToken,
        );
        await activateAssociationAccount(server, secondAssociationInfo.accountId);

        const { postId } = await createFamilyInNeedPost(server, firstAssociationToken, {
            wilayaNumber: secondAssociationInfo.wilayaNumber,
        });

        await delay(100);

        const { list } = await getNotifications(server, secondAssociationToken);

        expect(list).to.have.lengthOf(1);
        expect(list[0].notification).to.have.property('postId', postId);
    });

    it('an user register, another association register, the admin activate it and it publish a call for help in the same wilaya as the first user, then a notification should be created for that first user', async () => {
        const { accessToken: userToken, userInfo } = await registerRegularUser(server);

        const { accessToken: associationToken } = await registerAssociation(server);
        const { info } = await getAssociationByToken(server, associationToken);
        await activateAssociationAccount(server, info.accountId);

        const { postId } = await createCallForHelpPost(server, associationToken, {
            wilayaNumber: userInfo.wilayaNumber,
        });

        await delay(100);

        const { list } = await getNotifications(server, userToken);

        expect(list).to.have.lengthOf(1);
        expect(list[0].notification).to.have.property('postId', postId);
    });

    it('two associations register, the admin activate them, the first one publish a call for help in the same wilaya as the second one, then a notification should be created for that second one', async () => {
        const { accessToken: firstAssociationToken } = await registerAssociation(server);
        const { info: firstAssociationInfo } = await getAssociationByToken(
            server,
            firstAssociationToken,
        );
        await activateAssociationAccount(server, firstAssociationInfo.accountId);

        const { accessToken: secondAssociationToken } = await registerAssociation(server);
        const { info: secondAssociationInfo } = await getAssociationByToken(
            server,
            secondAssociationToken,
        );
        await activateAssociationAccount(server, secondAssociationInfo.accountId);

        const { postId } = await createCallForHelpPost(server, firstAssociationToken, {
            wilayaNumber: secondAssociationInfo.wilayaNumber,
        });

        await delay(100);

        const { list } = await getNotifications(server, secondAssociationToken);

        expect(list).to.have.lengthOf(1);
        expect(list[0].notification).to.have.property('postId', postId);
    });

    const delay = async (period: number) => {
        return new Promise(resolve => {
            setTimeout(resolve, period);
        });
    };
});
