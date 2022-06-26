import { expect } from 'chai';
import { PhoneNumber } from '../../main/core/domain/PhoneNumber';

describe('PhoneNumber Value Object', () => {
  it('should remove white spaces from the phone number', () => {
    expect(new PhoneNumber(' 05 81 18 18 38 ').value()).to.equal('0581181838');
  });
});
