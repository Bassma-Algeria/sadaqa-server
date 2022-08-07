import { ExceptionMessages } from './ExceptionMessages';
import { MultiLanguagesException } from './MultiLanguagesException';

class InvalidPhoneNumberException extends MultiLanguagesException {
    constructor() {
        super(ExceptionMessages.INVALID_PHONE);
    }
}

export { InvalidPhoneNumberException };
