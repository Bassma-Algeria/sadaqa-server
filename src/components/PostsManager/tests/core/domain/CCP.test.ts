import { expect } from 'chai';

import { CCP } from '../../../main/core/domain/CCP';

describe('CCP value object', () => {
  it('should trim the values', () => {
    const ccp = new CCP(' 000939231139913', ' 98  ');

    expect(ccp.number()).to.equal('000939231139913');
    expect(ccp.key()).to.equal('98');
  });
});
