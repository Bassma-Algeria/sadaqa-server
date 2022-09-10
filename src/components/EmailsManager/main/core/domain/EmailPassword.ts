import { ValidationException } from './exceptions/ValidationException';
import { ExceptionMessages } from './exceptions/ExceptionMessages';

class EmailPassword {
    constructor(private readonly password: string) {
        if (!password) throw new ValidationException(ExceptionMessages.INVALID_EMAIL_PASSWORD);
    }

    value() {
        return this.password;
    }
}

export { EmailPassword };
