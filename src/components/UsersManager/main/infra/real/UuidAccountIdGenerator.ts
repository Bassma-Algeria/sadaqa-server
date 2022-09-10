import { v4 as uuidv4 } from 'uuid';
import { AccountIdGenerator } from '../../core/domain/services/AccountIdGenerator';
import { AccountId } from '../../core/domain/AccountId';

class UuidAccountIdGenerator implements AccountIdGenerator {
    nextId(): AccountId {
        return new AccountId(uuidv4());
    }
}

export { UuidAccountIdGenerator };
