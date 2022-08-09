import { faker } from '@faker-js/faker';
import { expect } from 'chai';

import { anAuthenticationManager } from './base/anAuthenticationManager';

import { AuthenticationManagerFacade } from '../../../main/AuthenticationManagerFacade';

describe('Generate & Decode Access Tokens', () => {
    let authenticationManager: AuthenticationManagerFacade;

    before(() => {
        authenticationManager = anAuthenticationManager();
    });

    it('should generate a token from the userId and be able to decode it', async () => {
        const userId = faker.datatype.uuid();

        const { accessToken } = await authenticationManager.generateAccessToken({ userId });
        const { userId: decodedId } = await authenticationManager.decodeAccessToken({
            accessToken,
        });

        expect(decodedId).to.equal(userId);
    });
});
