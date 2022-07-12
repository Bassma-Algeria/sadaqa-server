import { Picture } from '../Picture';

export interface ImageCompressor {
  minify(picture: Picture): Promise<Picture>;
}
