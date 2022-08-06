import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { MessageId } from '../../../main/core/domain/MessageId';

import { ExceptionMessages } from '../../../main/core/domain/exceptions/ExceptionMessages';
import { ValidationException } from '../../../main/core/domain/exceptions/ValidationException';

describe('MessageId Value object', () => {
    it('should not have an empty message id', () => {
        expect(() => new MessageId(''))
            .to.throw(ExceptionMessages.EMPTY_MESSAGE_ID)
            .and.to.be.an.instanceof(ValidationException);

        expect(() => new MessageId(faker.datatype.uuid())).to.not.throw();
    });
});