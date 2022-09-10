import { MultiLanguagesValidationException } from './exceptions/MultiLanguagesValidationException';
import { ExceptionMessages } from './exceptions/ExceptionMessages';

class BaridiMobNumber {
    private readonly ONLY_NUMBERS_REGEX = /^\d+$/;

    private readonly _number: string;

    constructor(number: string) {
        number = number?.trim();

        if (!this.isValidBaridiMobNumber(number))
            throw new MultiLanguagesValidationException(
                ExceptionMessages.INVALID_BARIDI_MOB_NUMBER,
            );

        this._number = number;
    }

    value() {
        return this._number;
    }

    private isValidBaridiMobNumber(number: string) {
        return (
            number &&
            number.match(this.ONLY_NUMBERS_REGEX) &&
            number.startsWith('00799999') &&
            number.length === 20
        );
    }
}

export { BaridiMobNumber };
