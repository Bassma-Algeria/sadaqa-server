import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { Picture } from '../../../main/core/domain/Picture';
import { InvalidPictureUrlException } from '../../../main/core/domain/exceptions/InvalidPictureUrlException';

describe('PictureToUpload value object', () => {
  it('should not accept none valid urls', () => {
    const INVALID_URL = 'some random word';
    const VALID_URL = faker.image.imageUrl();

    expect(() => new Picture(INVALID_URL)).to.throw(InvalidPictureUrlException);
    expect(() => new Picture(VALID_URL)).to.not.throw();
  });
});
