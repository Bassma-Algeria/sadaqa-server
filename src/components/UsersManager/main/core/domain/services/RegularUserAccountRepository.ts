import { Email } from '../Email';
import { UserId } from '../UserId';
import { PhoneNumber } from '../PhoneNumber';
import { RegularUserAccount } from '../RegularUserAccount';

interface RegularUserAccountRepository {
    save(user: RegularUserAccount): Promise<void>;

    findById(userId: UserId): Promise<RegularUserAccount | undefined>;

    findByEmail(email: Email): Promise<RegularUserAccount | undefined>;

    findByPhoneNumber(phone: PhoneNumber): Promise<RegularUserAccount | undefined>;
}

export { RegularUserAccountRepository };
