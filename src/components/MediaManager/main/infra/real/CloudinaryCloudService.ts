import { v2 as cloudinary } from 'cloudinary';

import { CloudService } from '../../core/domain/services/CloudService';

import { URL } from '../../core/domain/URL';
import { Picture } from '../../core/domain/Picture';

class CloudinaryCloudService implements CloudService {
  constructor() {
    if (!process.env.CLOUDINARY_URL) throw new NoCloudinaryUrlInEnvException();
  }

  async upload(picture: Picture): Promise<URL> {
    const { secure_url: url } = await cloudinary.uploader.upload(picture.path.value(), {
      recource_type: 'image',
    });

    return new URL(url);
  }
}

class NoCloudinaryUrlInEnvException extends Error {
  constructor() {
    super('should have the CLOUDINARY_URL in env');
  }
}

export { CloudinaryCloudService };
