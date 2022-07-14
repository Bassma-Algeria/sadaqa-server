import { expect } from 'chai';
import { faker } from '@faker-js/faker';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { MediaManagerFacade } from '../../../MediaManager/main/MediaManagerFacade';

import { MediaManagerMediaService } from '../../main/infra/real/MediaManagerMediaService';

describe('MediaManagerMediaService', () => {
  const mediaManagerMock = mock<MediaManagerFacade>();
  const mediaService = new MediaManagerMediaService(instance(mediaManagerMock));

  it('should upload all the images using the MediaManager', async () => {
    const urlToReturn = faker.image.imageUrl();
    when(mediaManagerMock.uploadPicture(anything())).thenResolve({ url: urlToReturn });

    const picturesToUpload = Array.from({ length: faker.datatype.number({ min: 1, max: 8 }) }).map(
      () => faker.system.filePath(),
    );

    const result = await mediaService.uploadPictures(picturesToUpload);

    verify(mediaManagerMock.uploadPicture(anything())).times(picturesToUpload.length);
    expect(result.length).to.equal(picturesToUpload.length);

    result.forEach(pic => {
      expect(pic.url()).to.equal(urlToReturn);
    });
  });
});
