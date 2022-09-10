import { ExceptionMessages } from './exceptions/ExceptionMessages';
import { MultiLanguagesValidationException } from './exceptions/MultiLanguagesValidationException';

class PhoneNumber {
    private readonly PHONE_REGEX = /^(00213|\+213|0)(5|6|7)[0-9]{8}$/;
    private readonly phone: string;

    constructor(phone: string) {
        phone = phone.replace(/\s/g, '');
        if (!this.PHONE_REGEX.test(phone))
            throw new MultiLanguagesValidationException(ExceptionMessages.INVALID_PHONE);

        this.phone = phone;
    }

    value() {
        return this.phone;
    }

    equals(phone: PhoneNumber) {
        return phone.value() === this.phone;
    }
}

export { PhoneNumber };
