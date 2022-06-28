import { UserAccount } from '../UserAccount';
import { Email } from '../Email';
import { PhoneNumber } from '../PhoneNumber';

interface UserAccountRepository {
  add(user: UserAccount): Promise<void>;
  findByEmail(email: Email): Promise<UserAccount | undefined>;
  findByPhoneNumber(phone: PhoneNumber): Promise<UserAccount | undefined>;
}

export { UserAccountRepository };
