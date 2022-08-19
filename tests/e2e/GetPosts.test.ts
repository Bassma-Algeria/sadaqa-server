import { expect } from 'chai';
import { INestApplication } from '@nestjs/common';

import { cleanupDB, startNestTestingApp } from './base/SetupNestE2E';

import { createDonation } from './base/operations/posts/donation/createDonation';
import { getPostsByPublisher } from './base/operations/posts/getPostsByPublisher';
import { registerAssociation } from './base/operations/users/registerAssociation';
import { getAssociationByToken } from './base/operations/users/getAssociationByToken';
import { activateAssociationAccount } from './base/operations/users/activateAssociationAccount';
import { createFamilyInNeedPost } from './base/operations/posts/family-in-need/createFamilyInNeed';

describe('Get Posts', () => {
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
});
