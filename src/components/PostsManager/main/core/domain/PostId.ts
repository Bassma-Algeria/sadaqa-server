import { ExceptionsMessages } from './exceptions/ExceptionsMessages';
import { ValidationException } from './exceptions/ValidationException';

class PostId {
    private readonly id: string;

    constructor(id: string) {
        if (!id) throw new ValidationException(ExceptionsMessages.INVALID_POST_ID);

        this.id = id;
    }

    value() {
        return this.id;
    }
}

export { PostId };
