import { CloudService } from '../../core/domain/services/CloudService';

import { URL } from '../../core/domain/URL';
import { Picture } from '../../core/domain/Picture';

class CloudinaryCloudService implements CloudService {
  upload(picture: Picture): Promise<URL> {
    throw new Error('Method not implemented.');
  }
}

export { CloudinaryCloudService };
