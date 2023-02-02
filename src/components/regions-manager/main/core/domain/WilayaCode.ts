import { ValidationException } from './exceptions/ValidationException';
import { RegionsExceptionMessages } from './exceptions/RegionsExceptionMessages';

class WilayaCode {
    private readonly code: number;

    constructor(code: number) {
        if (code < 0) throw new ValidationException(RegionsExceptionMessages.NEGATIVE_WILAYA_CODE);
        if (code === 0) throw new ValidationException(RegionsExceptionMessages.NULL_WILAYA_CODE);

        this.code = code;
    }

    value() {
        return this.code;
    }
}

export { WilayaCode };
