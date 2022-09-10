import { ValidationException } from './exceptions/ValidationException';
import { ExceptionMessages } from './exceptions/ExceptionMessages';

class MessageId {
    private readonly id;

    constructor(id: string) {
        if (!id) throw new ValidationException(ExceptionMessages.EMPTY_MESSAGE_ID);
         
        this.id = id;
    }

    value() {
        return this.id;
    }
}

export { MessageId };
