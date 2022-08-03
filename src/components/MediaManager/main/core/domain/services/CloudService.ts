import { URL } from '../URL';
import { PictureToUpload } from '../PictureToUpload';

export interface CloudService {
    upload(picture: PictureToUpload): Promise<URL>;
}
