import { PictureUrl } from '../PictureUrl';

import { PictureToUpload } from '../PictureToUpload';

export interface CloudService {
    uploadPicture(picture: PictureToUpload): Promise<PictureUrl>;

    deletePicture(picUrl: PictureUrl): Promise<void>;
}
