import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { createAuthenticationManagerFacade } from './base/getFacade';
import { AuthenticationManagerFacade } from '../../../main/AuthenticationManagerFacade';

describe('GenerateAccessTokenUseCase', () => {
    let authenticationManager: AuthenticationManagerFacade;

    before(() => {
        authenticationManager = createAuthenticationManagerFacade();
    });

    it('should generate a unique token for every userId', async () => {
        const userId1 = faker.datatype.uuid();
        const userId2 = faker.datatype.uuid();
        const userId3 = faker.datatype.uuid();

        const { accessToken: token1 } = await authenticationManager.generateAccessToken({
            userId: userId1,
        });
        const { accessToken: token2 } = await authenticationManager.generateAccessToken({
            userId: userId2,
        });
        const { accessToken: token3 } = await authenticationManager.generateAccessToken({
            userId: userId3,
        });

        expect(token1).to.not.equal(token2).to.not.equal(token3);
    });

    it('should generate the same access token for the same userId', async () => {
        const userId = faker.datatype.uuid();

        const { accessToken: token1 } = await authenticationManager.generateAccessToken({ userId });
        const { accessToken: token2 } = await authenticationManager.generateAccessToken({ userId });

        expect(token1).to.equal(token2);
    });

    it('should generate a Bearer access token', async () => {
        const userId = faker.datatype.uuid();

        const { accessToken } = await authenticationManager.generateAccessToken({ userId });

        expect(accessToken.startsWith('Bearer ')).to.equal(true);
    });
});
