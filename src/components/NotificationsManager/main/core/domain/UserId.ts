import { ExceptionMessages } from './exceptions/ExceptionMessages';
import { ValidationException } from './exceptions/ValidationException';

class UserId {
    private readonly id: string;

    constructor(id: string) {
        if (!id) throw new ValidationException(ExceptionMessages.INVALID_USER_ID);

        this.id = id;
    }

    equals(userId: UserId) {
        return this.id === userId.value();
    }

    value() {
        return this.id;
    }
}

export { UserId };