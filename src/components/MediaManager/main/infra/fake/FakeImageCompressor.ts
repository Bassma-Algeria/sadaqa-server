import { faker } from '@faker-js/faker';

import { PictureToUpload } from '../../core/domain/PictureToUpload';

import { PictureCompressor } from '../../core/domain/services/PictureCompressor';

class FakeImageCompressor implements PictureCompressor {
    async minify(): Promise<PictureToUpload> {
        return new PictureToUpload(Buffer.from(faker.image.image()));
    }
}

export { FakeImageCompressor };
