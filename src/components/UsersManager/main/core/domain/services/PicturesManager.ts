import { ProfilePicture } from '../ProfilePicture';

export interface PicturesManager {
    uploadProfilePicture(pic: { buffer: Buffer; filename: string }): Promise<ProfilePicture>;

    deleteProfilePicture(picture: ProfilePicture): Promise<void>;
}
