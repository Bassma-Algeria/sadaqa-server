import { RegionsExceptionMessage } from './RegionsExceptionMessage';

class RegionsException extends Error {
    public readonly code: string;
    public readonly error: string;
    constructor(message: RegionsExceptionMessage) {
        super(message.error);

        this.code = message.code;
        this.error = message.error;
    }
}

export { RegionsException };
