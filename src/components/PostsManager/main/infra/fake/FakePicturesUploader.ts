import { faker } from '@faker-js/faker';

import { Picture } from '../../core/domain/Picture';
import { PicturesUploader } from '../../core/domain/services/PicturesUploader';

class FakePicturesUploader implements PicturesUploader {
  async upload(pics: Buffer[]): Promise<Picture[]> {
    return pics.map(() => new Picture(faker.image.business()));
  }
}

export { FakePicturesUploader };
