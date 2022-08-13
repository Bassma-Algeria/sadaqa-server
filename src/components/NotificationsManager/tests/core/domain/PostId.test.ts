import { expect } from 'chai';

import { ExceptionMessages } from '../../../main/core/domain/exceptions/ExceptionMessages';
import { ValidationException } from '../../../main/core/domain/exceptions/ValidationException';

import { PostId } from '../../../main/core/domain/PostId';

describe('Post Id value object', () => {
    it('should not accept white string as an id', () => {
        expect(() => new PostId(''))
            .to.throws(ExceptionMessages.INVALID_POST_ID)
            .instanceof(ValidationException);
    });
});