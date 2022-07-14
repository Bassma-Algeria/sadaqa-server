import { anything, instance, mock, when } from 'ts-mockito';

import { MediaManagerFacade } from '../../../../main/MediaManagerFacade';

import { FileSize } from '../../../../main/core/domain/FileSize';

import { CloudService } from '../../../../main/core/domain/services/CloudService';
import { FileSystemService } from '../../../../main/core/domain/services/FilesSystemService';
import { ImageCompressor } from '../../../../main/core/domain/services/ImageCompressor';

import { FakeCloudService } from '../../../../main/infra/fake/FakeCloudService';
import { FakeImageCompressor } from '../../../../main/infra/fake/FakeImageCompressor';

const LESS_THAN_HALF_MEGA_BYTE = new FileSize(1 ** 20 / 2);

interface Dependencies {
  cloudService?: CloudService;
  fileSystemService?: FileSystemService;
  imageCompressor?: ImageCompressor;
}

const aMediaManagerFacade = (dependecies?: Dependencies) => {
  const fileSystemServiceMock = mock<FileSystemService>();

  when(fileSystemServiceMock.sizeof(anything())).thenResolve(LESS_THAN_HALF_MEGA_BYTE);

  return new MediaManagerFacade(
    dependecies?.cloudService || new FakeCloudService(),
    dependecies?.fileSystemService || instance(fileSystemServiceMock),
    dependecies?.imageCompressor || new FakeImageCompressor(),
  );
};

export { aMediaManagerFacade };