import { expect } from 'chai';
import { spy } from 'sinon';
import { anything, instance, mock, when } from 'ts-mockito';

import { aMediaManagerFacade } from './base/aMediaManagerFacade';
import { anUploadPictureRequest } from './base/anUploadPictureRequest';

import { FakeImageCompressor } from '../../../main/infra/fake/FakeImageCompressor';

import { FileSize } from '../../../main/core/domain/FileSize';
import { FileSystemService } from '../../../main/core/domain/services/FilesSystemService';

describe('UploadPictureUseCase', () => {
  const imageCompressor = new FakeImageCompressor();
  const fileSystemServiceMock = mock<FileSystemService>();
  const mediaManager = aMediaManagerFacade({
    fileSystemService: instance(fileSystemServiceMock),
    imageCompressor,
  });

  it('given an image of size >= 0.5mb, it should be resized and then uploaded to the cloud', async () => {
    const minifyImageSpy = spy(imageCompressor, 'minify');

    const MORE_THAN_HALF_MEGA_BYTE = new FileSize(2 ** 20 / 2 + 2 ** 10);

    when(fileSystemServiceMock.sizeof(anything())).thenResolve(MORE_THAN_HALF_MEGA_BYTE);

    const { url } = await mediaManager.uploadPicture(anUploadPictureRequest());

    expect(url).to.be.a('string');
    expect(minifyImageSpy.calledOnce).to.equal(true);

    minifyImageSpy.restore();
  });

  it('given an image of size < 0.5mb, it should be resized and then uploaded to the cloud', async () => {
    const minifyImageSpy = spy(imageCompressor, 'minify');

    const LESS_THAN_HALF_MEGA_BYTE = new FileSize(1 ** 20 / 2);
    when(fileSystemServiceMock.sizeof(anything())).thenResolve(LESS_THAN_HALF_MEGA_BYTE);

    const { url } = await mediaManager.uploadPicture(anUploadPictureRequest());

    expect(url).to.be.a('string');
    expect(minifyImageSpy.calledOnce).to.equal(false);

    minifyImageSpy.restore();
  });
});
