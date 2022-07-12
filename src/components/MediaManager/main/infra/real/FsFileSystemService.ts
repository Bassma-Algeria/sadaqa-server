import { FileSize } from '../../core/domain/FileSize';
import { LocalPath } from '../../core/domain/LocalPath';
import { FileSystemService } from '../../core/domain/services/FilesSystemService';

class FsFileSystemService implements FileSystemService {
  isImage(picturePath: LocalPath): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  sizeof(picturePath: LocalPath): Promise<FileSize> {
    throw new Error('Method not implemented.');
  }
}

export { FsFileSystemService };
