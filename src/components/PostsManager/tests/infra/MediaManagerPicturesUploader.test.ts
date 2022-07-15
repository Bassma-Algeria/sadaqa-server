import { expect } from 'chai';
import { faker } from '@faker-js/faker';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { MediaManagerFacade } from '../../../MediaManager/main/MediaManagerFacade';

import { MediaManagerPicturesUploader } from '../../main/infra/real/MediaManagerPicturesUploader';

describe('MediaManagerPictureUploader', () => {
  const mediaManagerMock = mock<MediaManagerFacade>();
  const mediaService = new MediaManagerPicturesUploader(instance(mediaManagerMock));

  it('should upload all the images using the MediaManager', async () => {
    const urlToReturn = faker.image.imageUrl();
    when(mediaManagerMock.uploadPicture(anything())).thenResolve({ url: urlToReturn });

    const picturesToUpload = Array.from({ length: faker.datatype.number({ min: 1, max: 8 }) }).map(
      () => Buffer.from('some random value'),
    );

    const result = await mediaService.upload(picturesToUpload);

    verify(mediaManagerMock.uploadPicture(anything())).times(picturesToUpload.length);
    expect(result.length).to.equal(picturesToUpload.length);

    result.forEach(pic => {
      expect(pic.url()).to.equal(urlToReturn);
    });
  });
});
