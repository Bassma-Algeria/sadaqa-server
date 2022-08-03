import { faker } from '@faker-js/faker';

import { PictureToUpload } from '../../core/domain/PictureToUpload';

import { ImageCompressor } from '../../core/domain/services/ImageCompressor';

class FakeImageCompressor implements ImageCompressor {
    async minify(): Promise<PictureToUpload> {
        return new PictureToUpload(Buffer.from(faker.image.image()));
    }
}

export { FakeImageCompressor };
