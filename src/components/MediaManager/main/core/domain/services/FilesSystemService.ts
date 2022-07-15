import { FileSize } from '../FileSize';
import { PictureToUpload } from '../PictureToUpload';

export interface FileSystemService {
  sizeof(picture: PictureToUpload): Promise<FileSize>;
}
