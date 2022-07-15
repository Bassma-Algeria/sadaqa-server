import { Picture } from '../../core/domain/Picture';
import { PicturesUploader } from '../../core/domain/services/PicturesUploader';

import { MediaManagerFacade } from '../../../../MediaManager/main/MediaManagerFacade';

class MediaManagerPicturesUploader implements PicturesUploader {
  constructor(private readonly mediaManager: MediaManagerFacade) {}

  async upload(picsToUpload: Buffer[]): Promise<Picture[]> {
    const pictures: Picture[] = [];

    for (const picture of picsToUpload) {
      const { url } = await this.mediaManager.uploadPicture({ picture });

      pictures.push(new Picture(url));
    }

    return pictures;
  }
}

export { MediaManagerPicturesUploader };
