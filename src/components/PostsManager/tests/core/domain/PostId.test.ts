import { expect } from 'chai';

import { PostId } from '../../../main/core/domain/PostId';

import { ExceptionsMessages } from '../../../main/core/domain/exceptions/ExceptionsMessages';
import { ValidationException } from '../../../main/core/domain/exceptions/ValidationException';

describe('PostId', () => {
    it('should not be an empty string', () => {
        expect(() => new PostId(''))
            .to.throw(ExceptionsMessages.INVALID_POST_ID)
            .and.to.be.an.instanceOf(ValidationException);
    });
});
