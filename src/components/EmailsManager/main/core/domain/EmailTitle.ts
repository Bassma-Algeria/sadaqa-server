import { ValidationException } from './exceptions/ValidationException';
import { ExceptionMessages } from './exceptions/ExceptionMessages';

class EmailTitle {
    private readonly title;

    constructor(title: string) {
        if (!title) throw new ValidationException(ExceptionMessages.INVALID_EMAIL_TITLE);
        this.title = title.trim();
    }

    value() {
        return this.title;
    }
}

export { EmailTitle };
