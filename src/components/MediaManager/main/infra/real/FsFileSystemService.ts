/* eslint-disable security/detect-non-literal-fs-filename */

import { FileSystemService } from "../../core/domain/services/FilesSystemService";

import { FileSize } from "../../core/domain/FileSize";
import { PictureToUpload } from "../../core/domain/PictureToUpload";

class FsFileSystemService implements FileSystemService {
  async sizeof(picturePath: PictureToUpload): Promise<FileSize> {
    return new FileSize(0);
  }
}

export { FsFileSystemService };
