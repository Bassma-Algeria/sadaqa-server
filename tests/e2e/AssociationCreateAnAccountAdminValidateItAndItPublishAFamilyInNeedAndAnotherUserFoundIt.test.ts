import { expect } from 'chai';
import { INestApplication } from '@nestjs/common';
import { cleanupDB, startNestTestingApp } from './base/SetupNestE2E';

import { registerAssociation } from './base/operations/users/registerAssociation';
import { getFamiliesInNeed } from './base/operations/posts/family-in-need/getFamilesInNeed';
import { activateAssociationAccount } from './base/operations/users/activateAssociationAccount';
import { getFamilyInNeedById } from './base/operations/posts/family-in-need/getFamilyInNeedById';
import { createFamilyInNeedPost } from './base/operations/posts/family-in-need/createFamilyInNeed';
import { getAssociationByToken } from './base/operations/users/getAssociationByToken';

describe('Association Create An Account Admin Validate It And It Publish a Family in Need And Another User Found It', () => {
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

    it('should pass with no problem', async () => {
        const { accessToken } = await registerAssociation(server);
        const { info: { accountId } } = await getAssociationByToken(server, accessToken);

        await activateAssociationAccount(server, accountId);

        const { postId } = await createFamilyInNeedPost(server, accessToken);
        const { list } = await getFamiliesInNeed(server);
        const { familyInNeedPost } = await getFamilyInNeedById(server, postId);

        expect(list).to.have.lengthOf(1);
        expect(list[0]).to.deep.equal(familyInNeedPost);
        expect(list[0]).to.have.property('publisherId', accountId);
    });


});
