import { expect } from 'chai';

import { PostId } from '../../../main/core/domain/PostId';
import { InvalidPostIdException } from '../../../main/core/domain/exceptions/InvalidPostIdException';

describe('PostId', () => {
  it('should not be an empty string', () => {
    expect(() => new PostId('')).to.throw(InvalidPostIdException);
  });
});
