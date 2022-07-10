import { faker } from '@faker-js/faker';

import { Picture } from '../../core/domain/Picture';
import { MediaService } from '../../core/domain/services/MediaService';

class FakeMediaService implements MediaService {
  async uploadPictures(localPaths: string[]): Promise<Picture[]> {
    return localPaths.map(() => new Picture(faker.image.business()));
  }
}

export { FakeMediaService };
