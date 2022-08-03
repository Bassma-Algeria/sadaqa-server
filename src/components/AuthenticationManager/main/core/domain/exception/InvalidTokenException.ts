import { ExceptionMessages } from './ExceptionMessages';

class InvalidTokenException extends Error {
    constructor() {
        super(ExceptionMessages.INVALID_TOKEN);
    }
}

export { InvalidTokenException };
