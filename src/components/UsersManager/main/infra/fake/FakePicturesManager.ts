import { faker } from '@faker-js/faker';

import { ProfilePicture } from '../../core/domain/ProfilePicture';

import { PicturesManager } from '../../core/domain/services/PicturesManager';

class FakePicturesManager implements PicturesManager {
    async deleteProfilePicture(picture: ProfilePicture): Promise<void> {}

    async uploadProfilePicture(pic: { buffer: Buffer; filename: string }): Promise<ProfilePicture> {
        return new ProfilePicture(faker.image.avatar());
    }
}

export { FakePicturesManager };
