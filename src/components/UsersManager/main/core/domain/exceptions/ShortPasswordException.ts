import { ExceptionMessages } from './ExceptionMessages';
import { MultiLanguagesException } from './MultiLanguagesException';

class ShortPasswordException extends MultiLanguagesException {
    constructor() {
        super(ExceptionMessages.SHORT_PASSWORD);
    }
}

export { ShortPasswordException };
