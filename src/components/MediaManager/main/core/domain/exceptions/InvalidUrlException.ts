import { ExceptionMessages } from './ExceptionMessages';

class InvalidUrlException extends Error {
    constructor() {
        super(ExceptionMessages.INVALID_URL);
    }
}

export { InvalidUrlException };
