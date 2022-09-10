import { ExceptionMessages } from './exceptions/ExceptionMessages';

import { MultiLanguagesValidationException } from './exceptions/MultiLanguagesValidationException';

class Password {
    private readonly password: string;

    constructor(password: string) {
        password = password.trim();
        if (password.length < 6)
            throw new MultiLanguagesValidationException(ExceptionMessages.SHORT_PASSWORD);

        this.password = password;
    }

    value() {
        return this.password;
    }

    equals(password: Password) {
        return password.value() === this.password;
    }
}

export { Password };
