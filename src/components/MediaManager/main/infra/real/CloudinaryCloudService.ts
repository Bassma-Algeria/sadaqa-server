import { v2 as cloudinary } from 'cloudinary';

import { CloudService } from '../../core/domain/services/CloudService';

import { PictureUrl } from '../../core/domain/PictureUrl';
import { PictureToUpload } from '../../core/domain/PictureToUpload';

class CloudinaryCloudService implements CloudService {
    constructor() {
        if (!process.env.CLOUDINARY_URL) throw new NoCloudinaryUrlInEnvException();
    }

    async uploadPicture(picture: PictureToUpload): Promise<PictureUrl> {
        const image = this.formatBase64ImageDataIntoUploadableString(picture);

        const { secure_url: url } = await cloudinary.uploader.upload(image, {
            recource_type: 'image',
            folder: 'sadaqa',
        });

        return new PictureUrl(url);
    }

    private formatBase64ImageDataIntoUploadableString(picture: PictureToUpload) {
        return `data:${picture.mimeType()};base64,${picture.base64()}`;
    }

    async deletePicture(picUrl: PictureUrl): Promise<void> {
        const imageId: string = this.getPublicIdFromUrl(picUrl.value());

        await cloudinary.uploader.destroy(imageId, { resource_type: 'image' });
    }

    private getPublicIdFromUrl(url: string): string {
        const imageIdWithExtension = url.split('/')[url.split('/').length - 1];

        return imageIdWithExtension.split('.')[0];
    }
}

class NoCloudinaryUrlInEnvException extends Error {
    constructor() {
        super('should have the CLOUDINARY_URL in env');
    }
}

export { CloudinaryCloudService };
