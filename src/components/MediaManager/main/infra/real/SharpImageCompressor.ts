import sharp from 'sharp';

import { PictureToUpload } from '../../core/domain/PictureToUpload';

import { ImageCompressor } from '../../core/domain/services/ImageCompressor';

class SharpImageCompressor implements ImageCompressor {
  async minify(picture: PictureToUpload): Promise<PictureToUpload> {
    const newImageBuffer = await sharp(picture.buffer).webp({ quality: 20 }).toBuffer();

    return new PictureToUpload(newImageBuffer);
  }
}

export { SharpImageCompressor };
