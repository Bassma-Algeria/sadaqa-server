import { ExceptionMessages } from './ExceptionMessages';
import { MultiLanguagesException } from './MultiLanguagesException';

class PhoneNumberAlreadyUsedException extends MultiLanguagesException {
    constructor() {
        super(ExceptionMessages.PHONE_NUMBER_ALREADY_USED);
    }
}

export { PhoneNumberAlreadyUsedException };
