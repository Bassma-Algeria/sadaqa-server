import { ExceptionMessages } from './ExceptionMessages';
import { MultiLanguagesException } from './MultiLanguagesException';

class ShortNameException extends MultiLanguagesException {
    constructor() {
        super(ExceptionMessages.SHORT_NAME);
    }
}

export { ShortNameException };
