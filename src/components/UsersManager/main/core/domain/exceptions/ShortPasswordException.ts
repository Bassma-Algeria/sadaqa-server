import { ExceptionsMessages } from './ExceptionsMessages';
import { MultiLanguagesException } from './MultiLanguagesException';

class ShortPasswordException extends MultiLanguagesException {
    constructor() {
        super(ExceptionsMessages.SHORT_PASSWORD);
    }
}

export { ShortPasswordException };
