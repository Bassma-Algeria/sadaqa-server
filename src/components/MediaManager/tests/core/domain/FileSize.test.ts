import { expect } from 'chai';

import { FileSize } from '../../../main/core/domain/FileSize';

import { ExceptionMessages } from '../../../main/core/domain/exceptions/ExceptionMessages';
import { ValidationException } from '../../../main/core/domain/exceptions/ValidationException';

describe('FileSize value object', () => {
    it('should not have a negative size in negative', () => {
        const NEGATIVE_NUMBER = -193;

        expect(() => new FileSize(NEGATIVE_NUMBER))
            .to.throw(ExceptionMessages.INVALID_FILE_SIZE)
            .instanceof(ValidationException);
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
