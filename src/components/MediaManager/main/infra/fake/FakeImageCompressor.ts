import { faker } from '@faker-js/faker';

import { Picture } from '../../core/domain/Picture';
import { LocalPath } from '../../core/domain/LocalPath';

import { ImageCompressor } from '../../core/domain/services/ImageCompressor';

class FakeImageCompressor implements ImageCompressor {
  async minify(): Promise<Picture> {
    return new Picture(new LocalPath(faker.system.filePath()));
  }
}

export { FakeImageCompressor };
