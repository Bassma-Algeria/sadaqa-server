import { Token } from './Token';
import { TokenException } from './exception/TokenException';
import { ExceptionMessages } from './exception/ExceptionMessages';

class BearerToken {
    constructor(private readonly token: Token) {}

    getToken() {
        return this.token;
    }

    value() {
        return `Bearer ${this.token.value()}`;
    }

    static from(bearerToken: string) {
        if (!bearerToken.startsWith(`Bearer `))
            throw new TokenException(ExceptionMessages.INVALID_BEARER_TOKEN);

        const token = bearerToken.split('Bearer ')[1];

        return new BearerToken(new Token(token));
    }
}

export { BearerToken };
