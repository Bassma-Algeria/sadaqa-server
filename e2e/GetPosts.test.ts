import { expect } from 'chai';
import { INestApplication } from '@nestjs/common';

import { startNestTestingApp } from './base/SetupNestE2E';

import { getPostsSummary } from './base/operations/posts/getPostsSummary';
import { createDonation } from './base/operations/posts/donation/createDonation';
import { getPostsByPublisher } from './base/operations/posts/getPostsByPublisher';
import { registerAssociation } from './base/operations/users/registerAssociation';
import { getAssociationByToken } from './base/operations/users/getAssociationByToken';
import { activateAssociationAccount } from './base/operations/users/activateAssociationAccount';
import { createFamilyInNeedPost } from './base/operations/posts/family-in-need/createFamilyInNeed';
import { toggleFamilyInNeedEnablingStatusFamilyInNeed } from './base/operations/posts/family-in-need/toggleFamilyInNeedEnablingStatusFamilyInNeed';

describe('Get Posts', () => {
    let app: INestApplication;
    let server: any;

    before(async () => {
        app = await startNestTestingApp();
        server = app.getHttpServer();
    });

    after(async () => {
        await app.close();
    });

    it('given a user have different posts, when trying to get all the posts that he published, then should return all of them by types', async () => {
        const { accessToken } = await registerAssociation(server);
        const {
            info: { accountId },
        } = await getAssociationByToken(server, accessToken);

        await activateAssociationAccount(server, accountId);

        const { postId: familyInNeedId } = await createFamilyInNeedPost(server, accessToken);
        const { postId: donationId } = await createDonation(server, accessToken);

        const { donation, donationRequest, callForHelp, familyInNeed } = await getPostsByPublisher(
            server,
            accountId,
        );

        expect(callForHelp).to.have.lengthOf(0);
        expect(donationRequest).to.have.lengthOf(0);

        expect(donation).to.have.lengthOf(1);
        expect(donation[0]).to.have.property('postId', donationId);

        expect(familyInNeed).to.have.lengthOf(1);
        expect(familyInNeed[0]).to.have.property('postId', familyInNeedId);
    });

    it('given that the auth user have different posts, when trying to get a summary of them, then should return the numbers of the posts types that he have categorized by post status', async () => {
        const { accessToken } = await registerAssociation(server);
        const {
            info: { accountId },
        } = await getAssociationByToken(server, accessToken);

        await activateAssociationAccount(server, accountId);

        const { postId: familyInNeedId } = await createFamilyInNeedPost(server, accessToken);
        await createDonation(server, accessToken);

        await toggleFamilyInNeedEnablingStatusFamilyInNeed(server, accessToken, familyInNeedId);

        const { donation, donationRequest, callForHelp, familyInNeed } = await getPostsSummary(
            server,
            accessToken,
        );

        expect(callForHelp).to.have.property('total', 0);
        expect(callForHelp).to.have.property('ENABLED', 0);
        expect(callForHelp).to.have.property('DISABLED', 0);
        expect(callForHelp).to.have.property('BLOCKED', 0);

        expect(donationRequest).to.have.property('total', 0);
        expect(donationRequest).to.have.property('ENABLED', 0);
        expect(donationRequest).to.have.property('DISABLED', 0);
        expect(donationRequest).to.have.property('BLOCKED', 0);

        expect(donation).to.have.property('total', 1);
        expect(donation).to.have.property('ENABLED', 1);
        expect(donation).to.have.property('DISABLED', 0);
        expect(donation).to.have.property('BLOCKED', 0);

        expect(familyInNeed).to.have.property('total', 1);
        expect(familyInNeed).to.have.property('ENABLED', 0);
        expect(familyInNeed).to.have.property('DISABLED', 1);
        expect(familyInNeed).to.have.property('BLOCKED', 0);
    });
});
