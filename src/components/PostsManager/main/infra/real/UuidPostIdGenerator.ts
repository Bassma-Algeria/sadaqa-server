import { v4 as uuidv4 } from 'uuid';

import { PostId } from '../../core/domain/PostId';
import { PostIdGenerator } from '../../core/domain/services/PostIdGenerator';

class UuidPostIdGenerator implements PostIdGenerator {
  nextId(): PostId {
    return new PostId(uuidv4());
  }
}

export { UuidPostIdGenerator };
