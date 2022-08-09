import { PictureToUpload } from '../PictureToUpload';

export interface PictureCompressor {
    minify(picture: PictureToUpload): Promise<PictureToUpload>;
}
