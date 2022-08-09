import { TokenException } from './exception/TokenException';
import { ExceptionMessages } from './exception/ExceptionMessages';

class Token {
    private readonly token: string;

    constructor(token: string) {
        if (!token) throw new TokenException(ExceptionMessages.INVALID_TOKEN);

        this.token = token;
    }

    value() {
        return this.token;
    }
}

export { Token };
