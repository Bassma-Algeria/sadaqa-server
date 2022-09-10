import { expect } from 'chai';

import { anAuthenticationManager } from './base/anAuthenticationManager';
import { AuthenticationManagerFacade } from '../../../main/AuthenticationManagerFacade';
import { TokenException } from '../../../main/core/domain/exception/TokenException';
import { ExceptionMessages } from '../../../main/core/domain/exception/ExceptionMessages';

describe('Decode Access Token', () => {
    const SOME_RANDOM_VALUE = 'some random value';

    let authenticationManager: AuthenticationManagerFacade;

    before(() => {
        authenticationManager = anAuthenticationManager();
    });

    it('should not accept bad formatted access tokens', async () => {
        const accessToken = SOME_RANDOM_VALUE;

        await expect(authenticationManager.decodeAccessToken({ accessToken }))
            .to.eventually.be.rejectedWith(ExceptionMessages.INVALID_BEARER_TOKEN)
            .instanceof(TokenException);
    });
});
