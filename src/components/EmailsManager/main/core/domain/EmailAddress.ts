/* eslint-disable security/detect-unsafe-regex */
import { ExceptionMessages } from './exceptions/ExceptionMessages';
import { ValidationException } from './exceptions/ValidationException';

class EmailAddress {
    private readonly email: string;
    private readonly EMAIL_REGEX =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    constructor(email: string) {
        email = email.trim().toLowerCase();
        if (!this.EMAIL_REGEX.test(email))
            throw new ValidationException(ExceptionMessages.INVALID_EMAIL);

        this.email = email;
    }

    value() {
        return this.email;
    }

    equals(email: EmailAddress) {
        return this.email === email.value();
    }
}

export { EmailAddress };
