import { expect } from 'chai';
import { Description } from '../../../main/core/domain/Description';

describe('Description value object', () => {
  it('Description should be trimed and lowercased', () => {
    const description = new Description(' some KInd of Description hOla Hoalasd  ');

    expect(description.value()).to.equal('some kind of description hola hoalasd');
  });
});
