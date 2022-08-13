import { expect } from 'chai';
import { INestApplication } from '@nestjs/common';
import { cleanupDB, startNestTestingApp } from './base/SetupNestE2E';

import { registerAssociation } from './base/operations/users/registerAssociation';
import { getCallForHelps } from './base/operations/posts/call-for-help/getCallForHelps';
import { getCallForHelpById } from './base/operations/posts/call-for-help/getCallForHelpById';
import { activateAssociationAccount } from './base/operations/users/activateAssociationAccount';
import { createCallForHelpPost } from './base/operations/posts/call-for-help/createCallForHelp';
import { getAssociationByToken } from './base/operations/users/getAssociationByToken';

describe('Association Create An Account Admin Validate It And It Publish a Call For Help And Another User Found It', () => {
    let app: INestApplication;

    before(async () => {
        app = await startNestTestingApp();
    });

    beforeEach(async () => {
        await cleanupDB();
    });

    after(async () => {
        await app.close();
    });

    it('should pass with no problem', async () => {
        const { accessToken } = await registerAssociation(app.getHttpServer());
        const {
            info: { accountId },
        } = await getAssociationByToken(app.getHttpServer(), accessToken);

        await activateAssociationAccount(app.getHttpServer(), accountId);

        const { postId } = await createCallForHelpPost(app.getHttpServer(), accessToken);
        const { list } = await getCallForHelps(app.getHttpServer());
        const { callForHelpPost } = await getCallForHelpById(app.getHttpServer(), postId);

        expect(list).to.have.lengthOf(1);
        expect(list[0]).to.deep.equal(callForHelpPost);
        expect(list[0]).to.have.property('publisherId', accountId);
    });
});
