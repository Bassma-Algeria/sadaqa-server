import { UserId } from '../UserId';

interface UserIdGenerator {
    nextId(): UserId;
}

export { UserIdGenerator };
