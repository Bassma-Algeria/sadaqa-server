import { faker } from '@faker-js/faker';

import { URL } from '../../core/domain/URL';
import { CloudService } from '../../core/domain/services/CloudService';

class FakeCloudService implements CloudService {
  async upload(): Promise<URL> {
    return new URL(faker.image.imageUrl());
  }
}

export { FakeCloudService };
