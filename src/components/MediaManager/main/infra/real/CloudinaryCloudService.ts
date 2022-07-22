import { v2 as cloudinary } from 'cloudinary';

import { CloudService } from '../../core/domain/services/CloudService';

import { URL } from '../../core/domain/URL';
import { PictureToUpload } from '../../core/domain/PictureToUpload';

class CloudinaryCloudService implements CloudService {
  constructor() {
    if (!process.env.CLOUDINARY_URL) throw new NoCloudinaryUrlInEnvException();
  }

  async upload(picture: PictureToUpload): Promise<URL> {
    const image = this.formatBase64ImageDataIntoUploadableString(picture.buffer.toString('base64'));

    const { secure_url } = await cloudinary.uploader.upload(image, {
      recource_type: 'image',
      folder: 'sadaqa',
    });

    return new URL(secure_url);
  }

  private formatBase64ImageDataIntoUploadableString(base64: string) {
    return `data:image/png;base64,${base64}`;
  }
}

class NoCloudinaryUrlInEnvException extends Error {
  constructor() {
    super('should have the CLOUDINARY_URL in env');
  }
}

export { CloudinaryCloudService };
