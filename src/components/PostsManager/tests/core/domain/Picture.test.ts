import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { Picture } from '../../../main/core/domain/Picture';

import { ExceptionMessages } from '../../../main/core/domain/exceptions/ExceptionMessages';
import { ValidationException } from '../../../main/core/domain/exceptions/ValidationException';

describe('PictureToUpload value object', () => {
    it('should not accept none valid urls', () => {
        const INVALID_URL = 'some random word';
        const VALID_URL = faker.image.imageUrl();

        expect(() => new Picture(VALID_URL)).to.not.throw();

        expect(() => new Picture(INVALID_URL))
            .to.throw(ExceptionMessages.INVALID_PICTURE_URL)
            .and.to.be.an.instanceOf(ValidationException);
    });
});
