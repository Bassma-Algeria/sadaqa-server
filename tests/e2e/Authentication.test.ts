import { expect } from 'chai';
import { INestApplication } from '@nestjs/common';

import { cleanupDB, startNestTestingApp } from './base/SetupNestE2E';

import { login } from './base/operations/users/login';
import { registerRegularUser } from './base/operations/users/registerRegularUser';
import { registerAssociation } from './base/operations/users/registerAssociation';

describe('Authentication', () => {
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

    it('a regular user register, then login to his account', async () => {
        const { userInfo, accessToken: tokenFromRegister } = await registerRegularUser(server);
        const { accessToken: tokenFromLogin, type } = await login(server, userInfo);

        expect(tokenFromLogin).to.equal(tokenFromRegister);
        expect(type).to.equal('REGULAR_USER');
    });

    it("an association register, then login to it's account", async () => {
        const { associationInfo, accessToken: tokenFromRegister } = await registerAssociation(
            server,
        );
        const { accessToken: tokenFromLogin, type } = await login(server, associationInfo);

        expect(tokenFromLogin).to.equal(tokenFromRegister);
        expect(type).to.equal('ASSOCIATION');
    });
});
