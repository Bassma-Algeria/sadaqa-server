import { expect } from 'chai';

import { createAuthenticationManagerFacade } from './base/getFacade';
import { AuthenticationManagerFacade } from '../../../main/AuthenticationManagerFacade';
import { InvalidAccessTokenException } from '../../../main/core/domain/exception/InvalidAccessTokenException';

describe('DecodeAccessTokenUseCase', () => {
    const SOME_RANDOM_VALUE = 'some random value';

    let authenticationManager: AuthenticationManagerFacade;

    before(() => {
        authenticationManager = createAuthenticationManagerFacade();
    });

    it('should not accept bad formated access tokens', async () => {
        const accessToken = SOME_RANDOM_VALUE;

        await expect(
            authenticationManager.decodeAccessToken({ accessToken }),
        ).to.eventually.be.rejectedWith(InvalidAccessTokenException);
    });
});
