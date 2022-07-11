import { Email } from '../Email';
import { UserId } from '../UserId';
import { PhoneNumber } from '../PhoneNumber';
import { UserAccount } from '../UserAccount';

interface UserAccountRepository {
  add(user: UserAccount): Promise<void>;
  findById(userId: UserId): Promise<UserAccount | undefined>;
  findByEmail(email: Email): Promise<UserAccount | undefined>;
  findByPhoneNumber(phone: PhoneNumber): Promise<UserAccount | undefined>;
}

export { UserAccountRepository };
