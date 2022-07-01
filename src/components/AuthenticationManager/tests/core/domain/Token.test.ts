import { expect } from 'chai';

import { InvalidTokenException } from '../../../main/core/domain/exception/InvalidTokenException';

import { Token } from '../../../main/core/domain/Token';

describe('Token Value Object', () => {
  it('should not accept a white space as token', () => {
    expect(() => new Token('')).to.throw(InvalidTokenException);
  });
});
