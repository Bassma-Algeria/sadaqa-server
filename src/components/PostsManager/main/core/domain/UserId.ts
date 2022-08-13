import { ValidationException } from './exceptions/ValidationException';
import { ExceptionMessages } from './exceptions/ExceptionMessages';

class UserId {
    private readonly id: string;

    constructor(id: string) {
        if (!id) throw new ValidationException(ExceptionMessages.INVALID_USER_ID);

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
