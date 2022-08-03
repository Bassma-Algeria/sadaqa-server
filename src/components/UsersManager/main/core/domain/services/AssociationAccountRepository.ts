import { Email } from '../Email';
import { UserId } from '../UserId';
import { PhoneNumber } from '../PhoneNumber';
import { AssociationAccount } from '../AssociationAccount';

export interface AssociationAccountRepository {
    save(account: AssociationAccount): Promise<void>;

    update(account: AssociationAccount): Promise<void>;

    findById(associationId: UserId): Promise<AssociationAccount | undefined>;

    findByEmail(email: Email): Promise<AssociationAccount | undefined>;

    findByPhoneNumber(phone: PhoneNumber): Promise<AssociationAccount | undefined>;
}
