import { ExceptionMessages } from './ExceptionMessages';
import { MultiLanguagesException } from './MultiLanguagesException';

class WrongCredentialsException extends MultiLanguagesException {
    constructor() {
        super(ExceptionMessages.WRONG_CREDENTIALS);
    }
}

export { WrongCredentialsException };
