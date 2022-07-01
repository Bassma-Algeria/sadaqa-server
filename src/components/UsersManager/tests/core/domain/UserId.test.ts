import { expect } from 'chai';

import { UserId } from '../../../main/core/domain/UserId';
import { InvalidUserIdException } from '../../../main/core/domain/exceptions/InvalidUserIdException';

describe('UserId Value Object', () => {
  it('should not be able to have a userId with a white character', () => {
    expect(() => new UserId('')).to.throw(InvalidUserIdException);
  });
});
