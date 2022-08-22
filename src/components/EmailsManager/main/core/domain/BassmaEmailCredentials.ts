import { EmailCredentials } from './EmailCredentials';
import { EmailAddress } from './EmailAddress';
import { EmailPassword } from './EmailPassword';

import { ExceptionMessages } from './exceptions/ExceptionMessages';
import { ValidationException } from './exceptions/ValidationException';

class BassmaEmailCredentials implements EmailCredentials {
    private static readonly _instance = new BassmaEmailCredentials();

    static instance() {
        return this._instance;
    }

    private readonly _email: EmailAddress;
    private readonly _password: EmailPassword;

    private constructor() {
        const emailInEnv = process.env.BASSMA_EMAIL_ADDRESS;
        const passwordInEnv = process.env.BASSMA_EMAIL_PASSWORD;

        if (!emailInEnv || !passwordInEnv)
            throw new ValidationException(ExceptionMessages.NO_BASSMA_EMAIL_CREDENTIALS_IN_ENV);

        this._email = new EmailAddress(emailInEnv);
        this._password = new EmailPassword(passwordInEnv);
    }

    email(): EmailAddress {
        return this._email;
    }

    password(): EmailPassword {
        return this._password;
    }
}

export { BassmaEmailCredentials };
