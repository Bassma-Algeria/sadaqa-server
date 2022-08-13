import { expect } from 'chai';

import { ExceptionMessages } from '../../../main/core/domain/exceptions/ExceptionMessages';
import { ValidationException } from '../../../main/core/domain/exceptions/ValidationException';

import { UserId } from '../../../main/core/domain/UserId';

describe('User Id value object', () => {
    it('should not accept white string as an id', () => {
        expect(() => new UserId(''))
            .to.throws(ExceptionMessages.INVALID_USER_ID)
            .instanceof(ValidationException);
    });
});