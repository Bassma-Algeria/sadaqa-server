import { AccountId } from '../AccountId';

interface AccountIdGenerator {
    nextId(): AccountId;
}

export { AccountIdGenerator };
