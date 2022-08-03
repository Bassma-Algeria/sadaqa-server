import { Token } from '../../core/domain/Token';
import { UserId } from '../../core/domain/UserId';
import { TokenizationService } from '../../core/domain/services/TokenizationService';

class FakeTokenizationService implements TokenizationService {
    private readonly HASH = 'some kind of hash';

    async generateTokenFrom(userId: UserId): Promise<Token> {
        return new Token(userId.value() + this.HASH);
    }

    async decodeToken(token: Token): Promise<UserId> {
        const userId = UserId.from(token.value().split(this.HASH)[0]);
        return userId;
    }
}

export { FakeTokenizationService };
