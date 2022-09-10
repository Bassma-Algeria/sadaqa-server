import { spy } from 'sinon';
import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { aMediaManagerFacade } from './base/aMediaManagerFacade';

import { FakeImageCompressor } from '../../../main/infra/fake/FakeImageCompressor';
import { ExceptionMessages } from '../../../main/core/domain/exceptions/ExceptionMessages';
import { ValidationException } from '../../../main/core/domain/exceptions/ValidationException';

describe('Upload Picture', () => {
    const imageCompressor = new FakeImageCompressor();
    const mediaManager = aMediaManagerFacade({ imageCompressor });

    it('given a none picture file, when trying to upload it as a picture, then should fail', async () => {
        const NOT_PICTURE = faker.system.commonFileName('.json');

        await expect(
            mediaManager.uploadPicture({
                buffer: Buffer.alloc(13),
                filename: NOT_PICTURE,
            }),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.NOT_A_SUPPORTED_PICTURE)
            .and.to.be.an.instanceof(ValidationException);
    });

    it('given an image of size >= 0.2mb, it should be resized and then uploaded to the cloud', async () => {
        const minifyImageSpy = spy(imageCompressor, 'minify');

        const MORE_THAN_0_POINT_2_MEGA_BYTE = 2 ** 20 / 5 + 2 ** 2;

        const { url } = await mediaManager.uploadPicture({
            filename: getImageFilename(),
            buffer: Buffer.alloc(MORE_THAN_0_POINT_2_MEGA_BYTE),
        });

        expect(url).to.be.a('string');
        expect(minifyImageSpy.calledOnce).to.equal(true);

        minifyImageSpy.restore();
    });

    it('given an image of size < 0.2mb, it should not be resized and then uploaded to the cloud', async () => {
        const minifyImageSpy = spy(imageCompressor, 'minify');

        const LESS_THAN_0_POINT_2_MEGA_BYTE = 2 ** 20 / 5 - 2 ** 2;

        const { url } = await mediaManager.uploadPicture({
            buffer: Buffer.alloc(LESS_THAN_0_POINT_2_MEGA_BYTE),
            filename: getImageFilename(),
        });

        expect(url).to.be.a('string');
        expect(minifyImageSpy.calledOnce).to.equal(false);

        minifyImageSpy.restore();
    });

    const getImageFilename = () => {
        return faker.system.commonFileName('.svg');
    };
});
