import { ExceptionMessages } from './ExceptionMessages';
import { MultiLanguagesException } from './MultiLanguagesException';

class InvalidEmailException extends MultiLanguagesException {
    constructor() {
        super(ExceptionMessages.INVALID_EMAIL);
    }
}

export { InvalidEmailException };
