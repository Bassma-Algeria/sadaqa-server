import { Picture } from '../Picture';

export interface MediaService {
  uploadPictures(localPaths: string[]): Promise<Picture[]>;
}
