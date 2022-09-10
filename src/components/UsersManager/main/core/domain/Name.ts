import { ExceptionMessages } from './exceptions/ExceptionMessages';
import { MultiLanguagesValidationException } from './exceptions/MultiLanguagesValidationException';

class Name {
    private readonly name: string;

    constructor(name: string) {
        name = name.trim().toLowerCase();
        if (name.length < 3)
            throw new MultiLanguagesValidationException(ExceptionMessages.SHORT_NAME);

        this.name = name;
    }

    value() {
        return this.name;
    }
}

export { Name };
