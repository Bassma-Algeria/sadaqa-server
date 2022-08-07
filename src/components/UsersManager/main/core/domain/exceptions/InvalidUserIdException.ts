import { ExceptionMessages } from './ExceptionMessages';

class InvalidUserIdException extends Error {
    constructor() {
        super(ExceptionMessages.INVALID_ACCOUNT_ID);
    }
}

export { InvalidUserIdException };
