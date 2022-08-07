import { Email } from '../../../Email';
import { Account } from '../../../Account';
import { AccountId } from '../../../AccountId';
import { PhoneNumber } from '../../../PhoneNumber';

export interface AccountRepository<A extends Account> {
    save(account: A): Promise<void>;

    update(account: A): Promise<void>;

    findById(accountId: AccountId): Promise<A | undefined>;

    findByEmail(email: Email): Promise<A | undefined>;

    findByPhoneNumber(phone: PhoneNumber): Promise<A | undefined>;
}