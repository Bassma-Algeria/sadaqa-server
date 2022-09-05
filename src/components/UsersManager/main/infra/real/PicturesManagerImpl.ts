import { PicturesManager } from '../../core/domain/services/PicturesManager';

import { MediaManagerFacade } from '../../../../MediaManager/main/MediaManagerFacade';
import { ProfilePicture } from '../../core/domain/ProfilePicture';

class PicturesManagerImpl implements PicturesManager {
    constructor(private readonly mediaManager: MediaManagerFacade) {}

    async deleteProfilePicture(picture: ProfilePicture): Promise<void> {
        await this.mediaManager.deletePicture({ picUrl: picture.url() });
    }

    async uploadProfilePicture(pic: { buffer: Buffer; filename: string }): Promise<ProfilePicture> {
        const { url } = await this.mediaManager.uploadPicture(pic);

        return new ProfilePicture(url);
    }
}

export { PicturesManagerImpl };
