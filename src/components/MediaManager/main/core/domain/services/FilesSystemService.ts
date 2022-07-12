import { FileSize } from '../FileSize';
import { LocalPath } from '../LocalPath';

export interface FileSystemService {
  isImage(picturePath: LocalPath): Promise<boolean>;
  sizeof(picturePath: LocalPath): Promise<FileSize>;
}
