import { Token } from '../Token';
import { UserId } from '../UserId';

export interface TokenizationService {
  generateTokenFrom(userId: UserId): Promise<Token>;

  decodeToken(token: Token): Promise<UserId>;
}
 