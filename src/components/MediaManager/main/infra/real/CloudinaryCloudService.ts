import { v2 as cloudinary } from 'cloudinary';

import { CloudService } from '../../core/domain/services/CloudService';

import { PictureUrl } from '../../core/domain/PictureUrl';
import { PictureToUpload } from '../../core/domain/PictureToUpload';

class CloudinaryCloudService implements CloudService {
    constructor() {
        if (!process.env.CLOUDINARY_URL) throw new NoCloudinaryUrlInEnvException();
    }

    async uploadPicture(picture: PictureToUpload): Promise<PictureUrl> {
        const image = this.formatBase64ImageDataIntoUploadableString(
            picture.buffer.toString('base64'),
        );

        const { secure_url } = await cloudinary.uploader.upload(image, {
            recource_type: 'image',
            folder: 'sadaqa',
        });

        return new PictureUrl(secure_url);
    }

    private formatBase64ImageDataIntoUploadableString(base64: string) {
        return `data:image/png;base64,${base64}`;
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
