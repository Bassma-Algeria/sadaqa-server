import { expect } from 'chai';

import { Password } from '../../../main/core/domain/Password';

describe('Password value object', () => {
  it('should trim the password', () => {
    expect(new Password(' passwordHehe  ').value()).to.equal('passwordHehe');
  });
});
