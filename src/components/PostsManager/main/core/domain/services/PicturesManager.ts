import { Picture } from '../Picture';

export interface PicturesManager {
    upload(pictures: Buffer[]): Promise<Picture[]>;

    delete(picture: Picture): Promise<void>;
}
