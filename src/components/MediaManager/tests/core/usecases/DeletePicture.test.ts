import { spy } from 'sinon';
import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { aMediaManagerFacade } from './base/aMediaManagerFacade';

import { FakeCloudService } from '../../../main/infra/fake/FakeCloudService';

import { ExceptionMessages } from '../../../main/core/domain/exceptions/ExceptionMessages';
import { ValidationException } from '../../../main/core/domain/exceptions/ValidationException';

describe('Delete Picture', () => {
    const cloudService = new FakeCloudService();
    const mediaManager = aMediaManagerFacade({ cloudService });

    it('given a picture url, should delete this picture from the cloud', async () => {
        const deleteSpy = spy(cloudService, 'deletePicture');

        await mediaManager.deletePicture({ picUrl: faker.image.imageUrl() });

        expect(deleteSpy.calledOnce).to.equal(true);
    });

    it('given a wrong picture url, when trying to delete, then should fail', async () => {
        await expect(mediaManager.deletePicture({ picUrl: faker.lorem.words() }))
            .to.eventually.be.rejectedWith(ExceptionMessages.INVALID_URL)
            .and.to.be.instanceof(ValidationException);
    });
});