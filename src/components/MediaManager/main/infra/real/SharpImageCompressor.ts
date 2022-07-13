import path from 'path';
import sharp from 'sharp';
import { LocalPath } from '../../core/domain/LocalPath';

import { Picture } from '../../core/domain/Picture';
import { ImageCompressor } from '../../core/domain/services/ImageCompressor';

class SharpImageCompressor implements ImageCompressor {
  async minify(picture: Picture): Promise<Picture> {
    const dirname = path.dirname(picture.path.value());
    const newImagePath = path.join(dirname, `${new Date().getTime()}.wepb`);

    await sharp(picture.path.value()).webp({ quality: 20 }).toFile(newImagePath);

    return new Picture(new LocalPath(newImagePath));
  }
}

export { SharpImageCompressor };
