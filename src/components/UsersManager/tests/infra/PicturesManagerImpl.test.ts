import { faker } from '@faker-js/faker';
import { anything, deepEqual, instance, mock, verify, when } from 'ts-mockito';

import { ProfilePicture } from '../../main/core/domain/ProfilePicture';

import { PicturesManagerImpl } from '../../main/infra/real/PicturesManagerImpl';

import { MediaManagerFacade } from '../../../MediaManager/main/MediaManagerFacade';

describe('Pictures Manager Impl', () => {
    const mediaManagerMock = mock<MediaManagerFacade>();
    const picturesManager = new PicturesManagerImpl(instance(mediaManagerMock));

    beforeEach(() => {
        when(mediaManagerMock.deletePicture(anything())).thenResolve();
        when(mediaManagerMock.uploadPicture(anything())).thenResolve({
            url: faker.image.imageUrl(),
        });
    });

    it('should delegate the uploading of the pictures to the media manager', async () => {
        const picture = {
            buffer: Buffer.from(faker.datatype.string(40)),
            filename: faker.system.fileName(),
        };
        await picturesManager.uploadProfilePicture(picture);

        verify(mediaManagerMock.uploadPicture(deepEqual({ picture: picture.buffer }))).once();
    });

    it('should delegate the delete to the media manager', async () => {
        const picUrl = faker.image.imageUrl();

        await picturesManager.deleteProfilePicture(new ProfilePicture(picUrl));

        verify(mediaManagerMock.deletePicture(deepEqual({ picUrl }))).once();
    });
});
