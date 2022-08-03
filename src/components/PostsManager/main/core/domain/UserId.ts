import { ValidationException } from './exceptions/ValidationException';
import { ExceptionsMessages } from './exceptions/ExceptionsMessages';

class UserId {
    private readonly id: string;

    constructor(id: string) {
        if (!id) throw new ValidationException(ExceptionsMessages.INVALID_USER_ID);

        this.id = id;
    }

    value() {
        return this.id;
    }

    equals(userId: UserId) {
        return userId.value() === this.id;
    }
}

export { UserId };
