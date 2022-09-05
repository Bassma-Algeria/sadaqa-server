import { Picture } from '../Picture';

export interface PicturesManager {
    upload(pictures: { filename: string; buffer: Buffer }[]): Promise<Picture[]>;

    delete(picture: Picture): Promise<void>;
}
