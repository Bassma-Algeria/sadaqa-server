import { User } from './User';
import { Email } from './Email';
import { PhoneNumber } from './PhoneNumber';

interface UsersRepository {
  add(user: User): Promise<void>;
  findByEmail(email: Email): Promise<User | undefined>;
  findByPhoneNumber(phone: PhoneNumber): Promise<User | undefined>;
}

export { UsersRepository };
