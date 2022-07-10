import { faker } from '@faker-js/faker';

import { PostId } from '../../core/domain/PostId';
import { PostIdGenerator } from '../../core/domain/services/PostIdGenerator';

class FakePostIdGenerator implements PostIdGenerator {
  async nextId(): Promise<PostId> {
    return new PostId(faker.datatype.uuid());
  }
}

export { FakePostIdGenerator };
