import { MediaManagerFacade } from '../../../../main/MediaManagerFacade';

import { CloudService } from '../../../../main/core/domain/services/CloudService';
import { PictureCompressor } from '../../../../main/core/domain/services/PictureCompressor';

import { FakeCloudService } from '../../../../main/infra/fake/FakeCloudService';
import { FakeImageCompressor } from '../../../../main/infra/fake/FakeImageCompressor';

interface Dependencies {
    cloudService?: CloudService;
    imageCompressor?: PictureCompressor;
}

const aMediaManagerFacade = (dependencies?: Dependencies) => {
    return new MediaManagerFacade(
        dependencies?.cloudService || new FakeCloudService(),
        dependencies?.imageCompressor || new FakeImageCompressor(),
    );
};

export { aMediaManagerFacade };
