import { expect } from 'chai';
import { spy } from 'sinon';

import { aMediaManagerFacade } from './base/aMediaManagerFacade';

import { FakeImageCompressor } from '../../../main/infra/fake/FakeImageCompressor';

describe('UploadPictureUseCase', () => {
  const imageCompressor = new FakeImageCompressor();
  const mediaManager = aMediaManagerFacade({ imageCompressor });

  it('given an image of size >= 0.5mb, it should be resized and then uploaded to the cloud', async () => {
    const minifyImageSpy = spy(imageCompressor, 'minify');

    const MORE_THAN_HALF_MEGA_BYTE = 2 ** 20 / 2 + 2 ** 10;

    const { url } = await mediaManager.uploadPicture({
      picture: Buffer.alloc(MORE_THAN_HALF_MEGA_BYTE),
    });

    expect(url).to.be.a('string');
    expect(minifyImageSpy.calledOnce).to.equal(true);

    minifyImageSpy.restore();
  });

  it('given an image of size < 0.5mb, it should be resized and then uploaded to the cloud', async () => {
    const minifyImageSpy = spy(imageCompressor, 'minify');

    const LESS_THAN_HALF_MEGA_BYTE = 1 ** 20 / 2;

    const { url } = await mediaManager.uploadPicture({
      picture: Buffer.alloc(LESS_THAN_HALF_MEGA_BYTE),
    });

    expect(url).to.be.a('string');
    expect(minifyImageSpy.calledOnce).to.equal(false);

    minifyImageSpy.restore();
  });
});
