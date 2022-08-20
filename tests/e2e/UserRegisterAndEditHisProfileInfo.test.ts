import { expect } from 'chai';
import { INestApplication } from '@nestjs/common';

import { startNestTestingApp } from './base/SetupNestE2E';

import { registerRegularUser } from './base/operations/users/registerRegularUser';
import { editRegularUserInfo } from './base/operations/users/editRegularUserInfo';
import { registerAssociation } from './base/operations/users/registerAssociation';
import { editAssociationInfo } from './base/operations/users/editAssociationInfo';
import { getAssociationByToken } from './base/operations/users/getAssociationByToken';
import { getRegularUserByToken } from './base/operations/users/getRegularUserByToken';

describe('User Register and Edit his info', () => {
    let server: any;
    let app: INestApplication;

    before(async () => {
        app = await startNestTestingApp();
        server = app.getHttpServer();
    });

    after(async () => {
        await app.close();
    });

    it('regular user edit his info', async () => {
        const { accessToken, userInfo } = await registerRegularUser(server);

        const firstName = 'some-name';
        await editRegularUserInfo(server, { ...userInfo, firstName }, accessToken);

        const {
            info: { firstName: updatedName },
        } = await getRegularUserByToken(server, accessToken);

        expect(updatedName).to.equal(firstName);
    });

    it('association edit his info', async () => {
        const { accessToken, associationInfo } = await registerAssociation(server);

        const associationName = 'some-name';
        await editAssociationInfo(server, { ...associationInfo, associationName }, accessToken);

        const {
            info: { associationName: updatedName },
        } = await getAssociationByToken(server, accessToken);

        expect(updatedName).to.equal(associationName);
    });
});
