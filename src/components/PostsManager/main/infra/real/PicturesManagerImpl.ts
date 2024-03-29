import { Picture } from '../../core/domain/Picture';
import { PicturesManager } from '../../core/domain/services/PicturesManager';

import { MediaManagerFacade } from '../../../../MediaManager/main/MediaManagerFacade';

class PicturesManagerImpl implements PicturesManager {
    constructor(private readonly mediaManager: MediaManagerFacade) {}

    async upload(picsToUpload: { buffer: Buffer; filename: string }[]): Promise<Picture[]> {
        const pictures: Picture[] = [];

        for (const picture of picsToUpload) {
            const { url } = await this.mediaManager.uploadPicture(picture);

            pictures.push(new Picture(url));
        }

        return pictures;
    }

    async delete(picture: Picture): Promise<void> {
        await this.mediaManager.deletePicture({ picUrl: picture.url() });
    }
}

export { PicturesManagerImpl };
