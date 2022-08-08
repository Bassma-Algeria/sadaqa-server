import { expect } from 'chai';
import { INestApplication } from '@nestjs/common';

import { cleanupDB, startNestTestingApp } from './base/SetupNestE2E';

import { getDonations } from './base/operations/posts/donation/getDonations';
import { getFavourites } from './base/operations/posts/favourite/getFavourites';
import { createDonation } from './base/operations/posts/donation/createDonation';
import { addToFavourite } from './base/operations/posts/favourite/addToFavourite';
import { registerRegularUser } from './base/operations/users/registerRegularUser';

describe('User Register, found a post he like, he add it to his favourites then access it from his favourite posts list', () => {
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

    it('should pass with donation post', async () => {
        const { accessToken } = await registerRegularUser(server);
        const { postId } = await addDonationPost();

        const { list } = await getDonations(server);

        await addToFavourite(server, 'donation', postId, accessToken);

        const { donation } = await getFavourites(server, accessToken);

        expect(donation).to.have.lengthOf(1);
        expect(donation[0]).to.deep.equal(list[0]);
    });

    const addDonationPost = async () => {
        const { accessToken } = await registerRegularUser(server);

        const { postId } = await createDonation(server, accessToken);

        return { postId };
    };
});