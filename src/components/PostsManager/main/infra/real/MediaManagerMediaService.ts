import { Picture } from '../../core/domain/Picture';
import { MediaService } from '../../core/domain/services/MediaService';

import { MediaManagerFacade } from '../../../../MediaManager/main/MediaManagerFacade';

class MediaManagerMediaService implements MediaService {
  constructor(private readonly mediaManager: MediaManagerFacade) {}

  async uploadPictures(localPaths: string[]): Promise<Picture[]> {
    const pictures: Picture[] = [];

    for (const picturePath of localPaths) {
      const { url } = await this.mediaManager.uploadPicture({ picturePath });

      pictures.push(new Picture(url));
    }

    return pictures;
  }
}

export { MediaManagerMediaService };
