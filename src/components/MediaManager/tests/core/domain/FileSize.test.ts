import { expect } from 'chai';

import { FileSize } from '../../../main/core/domain/FileSize';
import { InvalidFileSizeException } from '../../../main/core/domain/exceptions/InvalidFileSizeException';

describe('FileSize value object', () => {
    it('should not have a negative size in negative', () => {
        const NEGATIVE_NUMBER = -193;

        expect(() => new FileSize(NEGATIVE_NUMBER)).to.throw(InvalidFileSizeException);
    });

    it('should get the size in mb', () => {
        const ONE_MEGA_BYTE_IN_BYTE = 2 ** 20;
        const TWO_MEGA_BYTE_IN_BYTE = 2 ** 20 * 2;

        const fileSize1 = new FileSize(ONE_MEGA_BYTE_IN_BYTE);
        const fileSize2 = new FileSize(TWO_MEGA_BYTE_IN_BYTE);

        expect(fileSize1.inMegaBytes()).to.equal(1);
        expect(fileSize2.inMegaBytes()).to.equal(2);
    });
});
