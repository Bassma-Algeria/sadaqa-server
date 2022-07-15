import { PictureToUpload } from '../PictureToUpload';

export interface ImageCompressor {
  minify(picture: PictureToUpload): Promise<PictureToUpload>;
}
