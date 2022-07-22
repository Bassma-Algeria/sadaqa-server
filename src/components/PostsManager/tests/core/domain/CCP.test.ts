import { expect } from 'chai';

import { CCP } from '../../../main/core/domain/CCP';

describe('CCP value object', () => {
  it('should trim the values', () => {
    const ccp = new CCP(' 0009392913', ' 98  ');

    expect(ccp.number()).to.equal('0009392913');
    expect(ccp.key()).to.equal('98');
  });
});
