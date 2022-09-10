import { ValidationException } from './exceptions/ValidationException';
import { ExceptionMessages } from './exceptions/ExceptionMessages';

class NotificationId {
    private readonly id: string;

    constructor(id: string) {
        if (!id) throw new ValidationException(ExceptionMessages.INVALID_NOTIFICATION_ID);

        this.id = id;
    }

    value() {
        return this.id;
    }
}

export { NotificationId };