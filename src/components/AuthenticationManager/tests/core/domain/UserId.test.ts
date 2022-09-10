import { expect } from 'chai';

import { UserId } from '../../../main/core/domain/UserId';

import { ExceptionMessages } from '../../../main/core/domain/exception/ExceptionMessages';
import { ValidationException } from '../../../main/core/domain/exception/ValidationException';

describe('UserId Value Object', () => {
    it('should not accept a white space as UserId', () => {
        expect(() => new UserId(''))
            .to.throw(ExceptionMessages.INVALID_USERID)
            .instanceof(ValidationException);
    });
});
