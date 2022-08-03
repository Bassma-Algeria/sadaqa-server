import { faker } from '@faker-js/faker';

import { Picture } from '../../core/domain/Picture';
import { PicturesManager } from '../../core/domain/services/PicturesManager';

class FakePicturesManager implements PicturesManager {
    async upload(pics: Buffer[]): Promise<Picture[]> {
        return pics.map(() => new Picture(faker.internet.url()));
    }

    async delete(picture: Picture): Promise<void> {
        return Promise.resolve();
    }
}

export { FakePicturesManager };
