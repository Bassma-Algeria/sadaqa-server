import jwt, { JsonWebTokenError } from 'jsonwebtoken';

import { Token } from '../../core/domain/Token';
import { UserId } from '../../core/domain/UserId';

import { TokenizationService } from '../../core/domain/services/TokenizationService';

import { TokenException } from '../../core/domain/exception/TokenException';
import { ExceptionMessages } from '../../core/domain/exception/ExceptionMessages';

class JwtTokenizationService implements TokenizationService {
    private readonly JWT_SECRET_KEY: string;

    constructor() {
        const jwtScretInEnv = process.env.JWT_SECRET_KEY;
        if (!jwtScretInEnv) throw new Error('should have a JWT_SECRET_KEY in the env');

        this.JWT_SECRET_KEY = jwtScretInEnv;
    }

    async generateTokenFrom(userId: UserId): Promise<Token> {
        const token = jwt.sign({ userId: userId.value() }, this.JWT_SECRET_KEY);

        return new Token(token);
    }

    async decodeToken(token: Token): Promise<UserId> {
        try {
            const { userId } = jwt.verify(token.value(), this.JWT_SECRET_KEY) as { userId: string };

            return new UserId(userId);
        } catch (e) {
            if (e instanceof JsonWebTokenError)
                throw new TokenException(ExceptionMessages.INVALID_TOKEN);
            else throw e;
        }
    }
}

export { JwtTokenizationService };
