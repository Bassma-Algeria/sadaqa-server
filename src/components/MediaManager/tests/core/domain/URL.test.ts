import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { URL } from '../../../main/core/domain/URL';

import { InvalidUrlException } from '../../../main/core/domain/exceptions/InvalidUrlException';

describe('URL value object', () => {
  it('should accept have an invalid url', () => {
    const RANDOM_STRING = faker.datatype.string();

    expect(() => new URL(RANDOM_STRING)).to.throw(InvalidUrlException);
  });
});
