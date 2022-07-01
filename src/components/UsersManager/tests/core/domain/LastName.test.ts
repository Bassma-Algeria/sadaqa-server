import { expect } from 'chai';

import { LastName } from '../../../main/core/domain/LastName';

describe('LastName value object', () => {
  it('should trim and lower case the last name', () => {
    expect(new LastName(' BelAtreche  ').value()).to.equal('belatreche');
  });
});
