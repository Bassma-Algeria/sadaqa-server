import { faker } from '@faker-js/faker';

import { Picture } from '../../core/domain/Picture';
import { PicturesManager } from '../../core/domain/services/PicturesManager';

class FakePicturesManager implements PicturesManager {
    async upload(pictures: { filename: string; buffer: Buffer }[]): Promise<Picture[]> {
        return pictures.map(() => new Picture(faker.image.avatar()));
    }

    async delete(picture: Picture): Promise<void> {
        return Promise.resolve();
    }
}

export { FakePicturesManager };
