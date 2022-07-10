import { expect } from 'chai';

import { EdahabiaRIB } from '../../../main/core/domain/EdahabiaRIB';

describe('EdahabiaRIB value object', () => {
  it('should trim the values', () => {
    const edahabiaRIB = new EdahabiaRIB(' 777755655539231139913   ');

    expect(edahabiaRIB.value()).to.equal('777755655539231139913');
  });
});
