import { expect } from 'chai';

import { AccountId } from '../../../main/core/domain/AccountId';

import { ExceptionMessages } from '../../../main/core/domain/exceptions/ExceptionMessages';
import { ValidationException } from '../../../main/core/domain/exceptions/ValidationException';

describe('AccountId Value Object', () => {
    it('should not be able to have a accountId with a white character', () => {
        expect(() => new AccountId(''))
            .to.throw(ExceptionMessages.INVALID_ACCOUNT_ID)
            .instanceof(ValidationException);
    });
});
