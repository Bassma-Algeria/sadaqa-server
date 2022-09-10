import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { PictureUrl } from '../../../main/core/domain/PictureUrl';

import { ExceptionMessages } from '../../../main/core/domain/exceptions/ExceptionMessages';
import { ValidationException } from '../../../main/core/domain/exceptions/ValidationException';

describe('URL value object', () => {
    it('should accept have an invalid url', () => {
        const RANDOM_STRING = faker.datatype.string();

        expect(() => new PictureUrl(RANDOM_STRING))
            .to.throw(ExceptionMessages.INVALID_URL)
            .instanceof(ValidationException);
    });
});
