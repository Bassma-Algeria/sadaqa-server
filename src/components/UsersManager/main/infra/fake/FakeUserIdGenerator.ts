import { faker } from '@faker-js/faker';

import { UserId } from '../../core/domain/UserId';
import { UserIdGenerator } from '../../core/domain/services/UserIdGenerator';

class FakeUserIdGenerator implements UserIdGenerator {
  nextId(): UserId {
    return new UserId(faker.datatype.uuid());
  }
}

export { FakeUserIdGenerator };
