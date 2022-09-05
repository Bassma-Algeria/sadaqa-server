import { expect } from 'chai';
import { INestApplication } from '@nestjs/common';

import { startNestTestingApp } from './base/SetupNestE2E';

import { registerRegularUser } from './base/operations/users/registerRegularUser';
import { getDonationRequests } from './base/operations/posts/donation-request/getDonationRequests';
import { createDonationRequest } from './base/operations/posts/donation-request/createDonationRequest';
import { getDonationRequestById } from './base/operations/posts/donation-request/getDonationRequestById';

describe('User Create an Account and Publish a Donation Request Another User Found It', () => {
    let server: any;
    let app: INestApplication;

    before(async () => {
        app = await startNestTestingApp();
        server = app.getHttpServer();
    });

    after(async () => {
        await app.close();
    });

    it('should pass with no problem', async () => {
        const { accessToken } = await registerRegularUser(server);
        const { postId } = await createDonationRequest(server, accessToken);

        const { list } = await getDonationRequests(server);
        const { post } = await getDonationRequestById(server, postId);

        expect(list).to.have.lengthOf(1);
        expect(post).to.deep.equal(list[0]);
        expect(list[0]).to.have.property('postId', postId);
    });
});
