import { ExceptionsMessages } from './ExceptionsMessages';

class UserNotFoundException extends Error {
    constructor() {
        super(ExceptionsMessages.USER_NOT_FOUND);
    }
}

export { UserNotFoundException };
