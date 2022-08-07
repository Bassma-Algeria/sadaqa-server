import { ExceptionMessages } from './ExceptionMessages';

class UserNotFoundException extends Error {
    constructor() {
        super(ExceptionMessages.ACCOUNT_NOT_FOUND);
    }
}

export { UserNotFoundException };
