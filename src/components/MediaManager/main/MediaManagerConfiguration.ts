import { MediaManagerFacade } from './MediaManagerFacade';

import { SharpImageCompressor } from './infra/real/SharpImageCompressor';
import { CloudinaryCloudService } from './infra/real/CloudinaryCloudService';

class MediaManagerConfiguration {
  static aMediaManagerFacade() {
    return new MediaManagerFacade(new CloudinaryCloudService(), new SharpImageCompressor());
  }
}

export { MediaManagerConfiguration };
