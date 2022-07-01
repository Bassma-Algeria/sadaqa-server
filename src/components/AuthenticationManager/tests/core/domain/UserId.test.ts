import { expect } from 'chai';

import { InvalidUserIdException } from '../../../main/core/domain/exception/InvalidUserIdException';

import { UserId } from '../../../main/core/domain/UserId';

describe('UserId Value Object', () => {
  it('should not accept a white space as UserId', () => {
    expect(() => new UserId('')).to.throw(InvalidUserIdException);
  });
});
