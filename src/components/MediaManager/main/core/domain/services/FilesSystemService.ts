import { FileSize } from '../FileSize';
import { LocalPath } from '../LocalPath';

export interface FileSystemService {
  sizeof(picturePath: LocalPath): Promise<FileSize>;
}
