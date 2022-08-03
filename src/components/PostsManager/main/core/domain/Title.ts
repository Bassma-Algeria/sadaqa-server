import { MultiLanguagesValidationException } from './exceptions/MultiLanguagesValidationException';
import { ExceptionsMessages } from './exceptions/ExceptionsMessages';

class Title {
    private readonly title: string;

    constructor(title: string) {
        title = title?.trim().toLowerCase();

        if (title?.length < 3)
            throw new MultiLanguagesValidationException(ExceptionsMessages.SHORT_TITLE);

        this.title = title;
    }

    value() {
        return this.title;
    }
}

export { Title };
