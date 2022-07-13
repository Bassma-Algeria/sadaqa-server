/* eslint-disable security/detect-non-literal-fs-filename */

import fs from 'fs';

import { FileSize } from '../../core/domain/FileSize';
import { LocalPath } from '../../core/domain/LocalPath';
import { FileSystemService } from '../../core/domain/services/FilesSystemService';

class FsFileSystemService implements FileSystemService {
  async sizeof(picturePath: LocalPath): Promise<FileSize> {
    const { size } = await fs.promises.stat(picturePath.value());

    return new FileSize(size);
  }
}

export { FsFileSystemService };
