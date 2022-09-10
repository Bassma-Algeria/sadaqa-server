import { expect } from 'chai';

import { WilayaName } from '../../../main/core/domain/WilayaName';
import { InvalidWilayaNameException } from '../../../main/core/domain/exceptions/InvalidWilayaNameException';

describe('WilayaName Value object', () => {
    it('should not have an wilaya name as a white space', () => {
        expect(() => new WilayaName({ en: '', ar: '' })).to.throw(InvalidWilayaNameException);
    });
});
