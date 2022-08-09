import { ExceptionMessages } from './exception/ExceptionMessages';
import { ValidationException } from './exception/ValidationException';

class UserId {
    private readonly id: string;

    constructor(id: string) {
        if (!id) throw new ValidationException(ExceptionMessages.INVALID_USERID);

        this.id = id;
    }

    value() {
        return this.id;
    }

    static from(id: string) {
        return new UserId(id);
    }
}

export { UserId };
