import { MediaManagerFacade } from './MediaManagerFacade';

import { FsFileSystemService } from './infra/real/FsFileSystemService';
import { SharpImageCompressor } from './infra/real/SharpImageCompressor';
import { CloudinaryCloudService } from './infra/real/CloudinaryCloudService';

class MediaManagerConfiguration {
  static aMediaManagerFacade() {
    return new MediaManagerFacade(
      new CloudinaryCloudService(),
      new FsFileSystemService(),
      new SharpImageCompressor(),
    );
  }
}

export { MediaManagerConfiguration };
