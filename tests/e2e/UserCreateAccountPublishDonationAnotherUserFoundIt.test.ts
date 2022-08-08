import { expect } from 'chai';
import { INestApplication } from '@nestjs/common';

import { cleanupDB, startNestTestingApp } from './base/SetupNestE2E';

import { getDonations } from './base/operations/posts/donation/getDonations';
import { createDonation } from './base/operations/posts/donation/createDonation';
import { registerRegularUser } from './base/operations/users/registerRegularUser';
import { getDonationById } from './base/operations/posts/donation/getDonationById';

describe('User Create Account Publish a DonationPost Another User FoundIt', () => {
    let server: any;
    let app: INestApplication;

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

    it('should pass with no problem', async () => {
        const { accessToken } = await registerRegularUser(server);
        const { postId } = await createDonation(server, accessToken);
        const { list } = await getDonations(server);

        const { post } = await getDonationById(server, postId);

        expect(list).to.have.lengthOf(1);
        expect(list[0]).to.deep.equal(post);
        expect(list[0]).to.have.property('postId', postId);
    });
});
