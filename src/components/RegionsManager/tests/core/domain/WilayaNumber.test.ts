import { expect } from 'chai';

import { WilayaNumber } from '../../../main/core/domain/WilayaNumber';
import { InvalidWilayaNumberException } from '../../../main/core/domain/exceptions/InvalidWilayaNumberException';

describe('WilayaNumber Value Object', () => {
    it('should not have a negative or a zero wilaya number', () => {
        expect(() => new WilayaNumber(-10)).to.throw(InvalidWilayaNumberException);
        expect(() => new WilayaNumber(0)).to.throw(InvalidWilayaNumberException);
        expect(() => new WilayaNumber(20)).to.not.throw();
    });
});
