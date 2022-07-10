import { expect } from 'chai';
import { Title } from '../../../main/core/domain/Title';

describe('Title value object', () => {
  it('title should be trimed and lowercased', () => {
    const title = new Title(' some KInd of TITle  ');

    expect(title.value()).to.equal('some kind of title');
  });
});
