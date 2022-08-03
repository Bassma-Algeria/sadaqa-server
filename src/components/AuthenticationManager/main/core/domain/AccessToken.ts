import { InvalidAccessTokenException } from './exception/InvalidAccessTokenException';
import { Token } from './Token';

class AccessToken {
    constructor(private readonly token: Token) {}

    getToken() {
        return this.token;
    }

    value() {
        return `Bearer ${this.token.value()}`;
    }

    static from(accessToken: string) {
        if (!accessToken.startsWith(`Bearer `)) throw new InvalidAccessTokenException();

        const token = accessToken.split('Bearer ')[1];

        return new AccessToken(new Token(token));
    }
}

export { AccessToken };
