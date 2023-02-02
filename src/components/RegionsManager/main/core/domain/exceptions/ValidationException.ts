import { RegionsException } from './RegionsException';
import { RegionsExceptionMessage } from './RegionsExceptionMessage';

class ValidationException extends RegionsException {
    constructor(e: RegionsExceptionMessage) {
        super(e);
    }
}

export { ValidationException };
