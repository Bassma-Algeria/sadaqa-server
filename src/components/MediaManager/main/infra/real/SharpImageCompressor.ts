import sharp from 'sharp';

import { PictureToUpload } from '../../core/domain/PictureToUpload';

import { PictureCompressor } from '../../core/domain/services/PictureCompressor';

class SharpImageCompressor implements PictureCompressor {
    async minify(picture: PictureToUpload): Promise<PictureToUpload> {
        const newImageBuffer = await sharp(picture.getBuffer()).webp({ quality: 10 }).toBuffer();

        return new PictureToUpload(picture.getFilename(), newImageBuffer);
    }
}

export { SharpImageCompressor };
