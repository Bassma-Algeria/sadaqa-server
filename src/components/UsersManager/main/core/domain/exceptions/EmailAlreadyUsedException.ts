import { MultiLanguagesException } from './MultiLanguagesException';
import { ExceptionMessages } from './ExceptionMessages';

class EmailAlreadyUsedException extends MultiLanguagesException {
    constructor() {
        super(ExceptionMessages.EMAIL_ALREADY_USED);
    }
}

export { EmailAlreadyUsedException };
