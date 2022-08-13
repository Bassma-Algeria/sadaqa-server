import { spy } from 'sinon';
import { expect } from 'chai';
import { faker } from '@faker-js/faker';
import { anything, instance, mock, when } from 'ts-mockito';

import { aDonationRequestPostsManager } from '../base/aDonationRequestPostsManager';
import { anEditDonationRequestPostRequest } from '../base/requests/anEditDonationRequestPostRequest';
import { aDonationRequestPostCreationRequest } from '../base/requests/aDonationRequestPostCreationRequest';

import { WilayasService } from '../../../../main/core/domain/services/WilayasService';

import { NotFoundException } from '../../../../main/core/domain/exceptions/NotFoundException';
import { ExceptionMessages } from '../../../../main/core/domain/exceptions/ExceptionMessages';
import { ValidationException } from '../../../../main/core/domain/exceptions/ValidationException';
import { AuthorizationException } from '../../../../main/core/domain/exceptions/AuthorizationException';
import { MultiLanguagesValidationException } from '../../../../main/core/domain/exceptions/MultiLanguagesValidationException';

import { FakePicturesManager } from '../../../../main/infra/fake/FakePicturesManager';

import { EventBus } from '../../../../../_shared_/event-bus/EventBus';

describe('Update Donation Request Post', () => {
    const picturesManager = new FakePicturesManager();
    const mockWilayasService = mock<WilayasService>();

    const postsManager = aDonationRequestPostsManager({
        wilayasService: instance(mockWilayasService),
        picturesManager,
    });

    beforeEach(() => {
        when(mockWilayasService.isExist(anything())).thenResolve(true);
    });

    it('given an update donation request post request, when the postId not exist, then should fail with a not found error', async () => {
        const NOT_EXIST = faker.datatype.uuid();

        await expect(postsManager.update(anEditDonationRequestPostRequest({ postId: NOT_EXIST })))
            .to.eventually.be.rejectedWith(ExceptionMessages.POST_NOT_FOUND)
            .and.to.be.an.instanceOf(NotFoundException);
    });

    it('given an update donation request post request, when the userId is not the publisher, then should fail with a not authorized error', async () => {
        const NOT_PUBLISHER = faker.datatype.uuid();
        const { postId } = await createDonationRequestPost();

        await expect(
            postsManager.update(
                anEditDonationRequestPostRequest({ userId: NOT_PUBLISHER, postId }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.NOT_AUTHORIZED_TO_EDIT)
            .and.to.be.an.instanceOf(AuthorizationException);
    });

    it('given an update donation request post request, when the title have less than 3 chars, then should fail with a multi languages validation error', async () => {
        const { postId } = await createDonationRequestPost();

        const SHORT_TITLE = 'ls';

        await expect(
            postsManager.update(anEditDonationRequestPostRequest({ title: SHORT_TITLE, postId })),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.SHORT_TITLE.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given an update donation request post request, when the category is not valid, then should fail with a multi languages validation error', async () => {
        const { postId, userId } = await createDonationRequestPost();

        const INVALID_CATEGORY = 'ls';

        await expect(
            postsManager.update(
                anEditDonationRequestPostRequest({ category: INVALID_CATEGORY, postId, userId }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.INVALID_CATEGORY.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given an update donation request post request, when the wilaya number not exist, then should fail with a multi languages validation error', async () => {
        const { userId, postId } = await createDonationRequestPost();

        when(mockWilayasService.isExist(anything())).thenResolve(false);

        const NOT_EXISTING_WILAYA = 19823;

        await expect(
            postsManager.update(
                anEditDonationRequestPostRequest({
                    wilayaNumber: NOT_EXISTING_WILAYA,
                    userId,
                    postId,
                }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.INVALID_WILAYA_NUMBER.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given an update donation request post request, when pictures have all the old pictures and no new pictures, then should keep the pictures unchanged', async () => {
        const { userId, postId } = await createDonationRequestPost();

        const { pictures: picturesBeforeUpdate } = await postsManager.getById({
            postId,
        });

        await postsManager.update(
            anEditDonationRequestPostRequest({
                pictures: { new: [], old: picturesBeforeUpdate },
                userId,
                postId,
            }),
        );

        const { pictures: picturesAfterUpdate } = await postsManager.getById({ postId });

        expect(picturesBeforeUpdate).to.deep.equal(picturesAfterUpdate);
    });

    it('given an update donation request post request, when pictures have some old pictures missing and no new pictures, then should delete the missing old pictures', async () => {
        const { userId, postId } = await createDonationRequestPost();

        const { pictures: picturesBeforeUpdate } = await postsManager.getById({
            postId,
        });

        await postsManager.update(
            anEditDonationRequestPostRequest({
                pictures: { new: [], old: picturesBeforeUpdate.slice(1) },
                userId,
                postId,
            }),
        );

        const { pictures: picturesAfterUpdate } = await postsManager.getById({ postId });

        expect(picturesBeforeUpdate.slice(1)).to.deep.equal(picturesAfterUpdate);
    });

    it('given an update donation request post request, when pictures have some new and no new old pictures, then should delete all old pictures and have only the new ones', async () => {
        const { userId, postId } = await createDonationRequestPost();

        const { pictures: picturesBeforeUpdate } = await postsManager.getById({
            postId,
        });

        const NEW_PICTURES = Array.from({ length: 1 }).map(() => Buffer.from(faker.image.image()));

        await postsManager.update(
            anEditDonationRequestPostRequest({
                pictures: { new: NEW_PICTURES, old: [] },
                userId,
                postId,
            }),
        );

        const { pictures: picturesAfterUpdate } = await postsManager.getById({ postId });

        const isPicturedAfterUpdateIncludesPictureBeforeUpdate = picturesAfterUpdate.some(pic =>
            picturesBeforeUpdate.includes(pic),
        );

        expect(picturesAfterUpdate).to.have.lengthOf(NEW_PICTURES.length);
        expect(isPicturedAfterUpdateIncludesPictureBeforeUpdate).to.equal(false);
    });

    it('given an update donation request post request, when pictures have some new and some old pictures, then should delete all old pictures that are not in the old list and add the new ones', async () => {
        const { userId, postId } = await createDonationRequestPost();

        const { pictures: picturesBeforeUpdate } = await postsManager.getById({
            postId,
        });

        const NEW_PICTURES = Array.from({ length: 1 }).map(() => Buffer.from(faker.image.image()));
        const OLD_PICTURES_TO_KEEP = picturesBeforeUpdate.slice(0, 1);
        const OLD_PICTURES_TO_REMOVE = picturesBeforeUpdate.slice(1);

        await postsManager.update(
            anEditDonationRequestPostRequest({
                pictures: { new: NEW_PICTURES, old: OLD_PICTURES_TO_KEEP },
                userId,
                postId,
            }),
        );

        const { pictures: picturesAfterUpdate } = await postsManager.getById({ postId });

        const isPicsAfterUpdateContainsAllOldPicsToKeep = OLD_PICTURES_TO_KEEP.every(pic =>
            picturesAfterUpdate.includes(pic),
        );

        const isPicsAfterUpdateDoesNotContainsOldPicsToRemove = OLD_PICTURES_TO_REMOVE.every(
            pic => !picturesAfterUpdate.includes(pic),
        );

        expect(isPicsAfterUpdateContainsAllOldPicsToKeep).to.equal(true);
        expect(isPicsAfterUpdateDoesNotContainsOldPicsToRemove).to.equal(true);
        expect(picturesAfterUpdate).to.have.lengthOf(
            NEW_PICTURES.length + OLD_PICTURES_TO_KEEP.length,
        );
    });

    it('given an update donation request post request, when pictures have some old pictures that in fact not in the post pictures, then should fail with a validation error', async () => {
        const { userId, postId } = await createDonationRequestPost();

        const RANDOM_PICS = Array.from({ length: 3 }).map(() => faker.internet.url());

        await expect(
            postsManager.update(
                anEditDonationRequestPostRequest({
                    pictures: { new: [], old: RANDOM_PICS },
                    userId,
                    postId,
                }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.POST_PICTURE_NOT_EXIST)
            .and.to.be.an.instanceOf(ValidationException);
    });

    it('given an update donation request post request, when pictures have some old pictures, then should delete the other pictures that are not present in the request', async () => {
        const deleteSpy = spy(picturesManager, 'delete');

        const { userId, postId } = await createDonationRequestPost();

        const { pictures: picturesBeforeUpdate } = await postsManager.getById({
            postId,
        });

        const OLD_PICTURES_TO_KEEP = picturesBeforeUpdate.slice(0, 1);
        const OLD_PICTURES_TO_REMOVE = picturesBeforeUpdate.slice(1);

        await postsManager.update(
            anEditDonationRequestPostRequest({
                pictures: { new: [], old: OLD_PICTURES_TO_KEEP },
                userId,
                postId,
            }),
        );

        expect(deleteSpy.callCount).to.equal(OLD_PICTURES_TO_REMOVE.length);

        deleteSpy.restore();
    });

    it('given an update donation request post request, when the post updated, then should return the new updated post info', async () => {
        const { userId, postId } = await createDonationRequestPost();

        const returned = await postsManager.update(
            anEditDonationRequestPostRequest({
                userId,
                postId,
            }),
        );

        const updated = await postsManager.getById({ postId });

        expect(updated).to.deep.equal(returned);
    });

    it('given an update donation request post request, when the post updated, then should publish a post updated event to the global event bus', async () => {
        const mockFn = spy();
        EventBus.getInstance().subscribeTo('DONATION_REQUEST_POST_UPDATED').by(mockFn);

        const { userId, postId } = await createDonationRequestPost();

        await postsManager.update(
            anEditDonationRequestPostRequest({
                userId,
                postId,
            }),
        );

        expect(mockFn.calledOnce).to.equal(true);
    });

    async function createDonationRequestPost() {
        const userId = faker.datatype.uuid();
        const { postId } = await postsManager.create(
            aDonationRequestPostCreationRequest({ publisherId: userId }),
        );

        return { userId, postId };
    }
});
