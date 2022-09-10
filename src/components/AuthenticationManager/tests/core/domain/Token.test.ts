import { expect } from 'chai';

import { Token } from '../../../main/core/domain/Token';

import { TokenException } from '../../../main/core/domain/exception/TokenException';
import { ExceptionMessages } from '../../../main/core/domain/exception/ExceptionMessages';

describe('Token Value Object', () => {
    it('should not accept a white space as token', () => {
        expect(() => new Token(''))
            .to.throw(ExceptionMessages.INVALID_TOKEN)
            .instanceof(TokenException);
    });
});
