import { Picture } from '../../core/domain/Picture';
import { ImageCompressor } from '../../core/domain/services/ImageCompressor';

class SharpImageCompressor implements ImageCompressor {
  minify(picture: Picture): Promise<Picture> {
    throw new Error('Method not implemented.');
  }
}

export { SharpImageCompressor };
