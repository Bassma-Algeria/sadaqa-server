import { ValidationException } from './exceptions/ValidationException';
import { ExceptionMessages } from './exceptions/ExceptionMessages';

class TextMessageContent {
    private readonly content: string;

    constructor(content: string) {
        if (!content)
            throw new ValidationException(ExceptionMessages.TEXT_MESSAGE_CONTENT_CANNOT_BE_EMPTY);

        this.content = content?.trim();
    }

    value() {
        return this.content;
    }
}

export { TextMessageContent };