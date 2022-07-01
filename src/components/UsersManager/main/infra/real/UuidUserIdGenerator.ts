import { v4 as uuidv4 } from 'uuid';

import { UserId } from '../../core/domain/UserId';
import { UserIdGenerator } from '../../core/domain/services/UserIdGenerator';

class UuidUserIdGenerator implements UserIdGenerator {
  nextId(): UserId {
    return new UserId(uuidv4());
  }
}

export { UuidUserIdGenerator };
