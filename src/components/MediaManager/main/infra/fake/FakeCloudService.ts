import { faker } from '@faker-js/faker';

import { PictureUrl } from '../../core/domain/PictureUrl';
import { CloudService } from '../../core/domain/services/CloudService';

class FakeCloudService implements CloudService {
    async uploadPicture(): Promise<PictureUrl> {
        return new PictureUrl(faker.image.imageUrl());
    }

    async deletePicture(picUrl: PictureUrl) {
        // ...
    }
}

export { FakeCloudService };
