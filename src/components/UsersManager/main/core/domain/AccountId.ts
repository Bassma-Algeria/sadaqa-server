import { ValidationException } from './exceptions/ValidationException';
import { ExceptionMessages } from './exceptions/ExceptionMessages';

class AccountId {
    private readonly id: string;

    constructor(id: string) {
        if (!id) throw new ValidationException(ExceptionMessages.INVALID_ACCOUNT_ID);

        this.id = id;
    }

    value() {
        return this.id;
    }

    equals(another: AccountId) {
        return this.id === another.id;
    }
}

export { AccountId };
