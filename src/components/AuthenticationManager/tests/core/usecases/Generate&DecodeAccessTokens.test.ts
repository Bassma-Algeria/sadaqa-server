import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { anAuthenticationManager } from './base/anAuthenticationManager';

describe('Generate & Decode Access Tokens', () => {
    const authenticationManager = anAuthenticationManager();

    it('should generate a token from the userId and be able to decode it', async () => {
        const userId = faker.datatype.uuid();

        const { accessToken } = await authenticationManager.generateAccessToken({ userId });
        const { userId: decodedId } = await authenticationManager.decodeAccessToken({
            accessToken,
        });

        expect(decodedId).to.equal(userId);
    });
});
