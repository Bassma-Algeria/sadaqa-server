import { Picture } from '../Picture';

export interface PicturesUploader {
  upload(pictures: Buffer[]): Promise<Picture[]>;
}
