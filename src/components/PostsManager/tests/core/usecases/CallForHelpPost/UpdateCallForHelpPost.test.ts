import { spy } from 'sinon';
import { expect } from 'chai';
import { faker } from '@faker-js/faker';
import { anything, instance, mock, when } from 'ts-mockito';

import { aCallForHelpPostsManager } from '../base/aCallForHelpPostsManager';
import { anEditCallForHelpPostRequest } from '../base/requests/anEditCallForHelpPostRequest';
import { aCallForHelpPostCreationRequest } from '../base/requests/aCallForHelpPostCreationRequest';

import { WilayasService } from '../../../../main/core/domain/services/WilayasService';

import { NotFoundException } from '../../../../main/core/domain/exceptions/NotFoundException';
import { ExceptionsMessages } from '../../../../main/core/domain/exceptions/ExceptionsMessages';
import { ValidationException } from '../../../../main/core/domain/exceptions/ValidationException';
import { AuthorizationException } from '../../../../main/core/domain/exceptions/AuthorizationException';
import { MultiLanguagesValidationException } from '../../../../main/core/domain/exceptions/MultiLanguagesValidationException';

import { FakePicturesManager } from '../../../../main/infra/fake/FakePicturesManager';

import { EventBus } from '../../../../../_shared_/event-bus/EventBus';

describe('Update Call For Help Post', () => {
    const picturesManager = new FakePicturesManager();
    const mockWilayasService = mock<WilayasService>();

    const callForHelpPostsManager = aCallForHelpPostsManager({
        wilayasService: instance(mockWilayasService),
        picturesManager,
    });

    beforeEach(() => {
        when(mockWilayasService.isExist(anything())).thenResolve(true);
    });

    it('given an update call for help post request, when the postId not exist, then should fail with a not found error', async () => {
        const NOT_EXIST = faker.datatype.uuid();

        await expect(
            callForHelpPostsManager.update(anEditCallForHelpPostRequest({ postId: NOT_EXIST })),
        )
            .to.eventually.be.rejectedWith(ExceptionsMessages.POST_NOT_FOUND)
            .and.to.be.an.instanceOf(NotFoundException);
    });

    it('given an update call for help post request, when the userId is not the publisher, then should fail with a not authorized error', async () => {
        const NOT_PUBLISHER = faker.datatype.uuid();
        const { postId } = await createCallForHelpPost();

        await expect(
            callForHelpPostsManager.update(
                anEditCallForHelpPostRequest({ userId: NOT_PUBLISHER, postId }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionsMessages.NOT_AUTHORIZED_TO_EDIT)
            .and.to.be.an.instanceOf(AuthorizationException);
    });

    it('given an update call for help post request, when the title have less than 3 chars, then should fail with a multi languages validation error', async () => {
        const { postId } = await createCallForHelpPost();

        const SHORT_TITLE = 'ls';

        await expect(
            callForHelpPostsManager.update(
                anEditCallForHelpPostRequest({ title: SHORT_TITLE, postId }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionsMessages.SHORT_TITLE.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given an update call for help post request, when the wilaya number not exist, then should fail with a multi languages validation error', async () => {
        const { userId, postId } = await createCallForHelpPost();

        when(mockWilayasService.isExist(anything())).thenResolve(false);

        const NOT_EXISTING_WILAYA = 19823;

        await expect(
            callForHelpPostsManager.update(
                anEditCallForHelpPostRequest({ wilayaNumber: NOT_EXISTING_WILAYA, userId, postId }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionsMessages.INVALID_WILAYA_NUMBER.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given an update call for help post request, when ccp and ccp key exist and the ccp in not valid, then should fail with a multi languages validation error', async () => {
        const { userId, postId } = await createCallForHelpPost();

        const INVALID_CCP = faker.datatype.number().toString();

        await expect(
            callForHelpPostsManager.update(
                anEditCallForHelpPostRequest({ ccp: INVALID_CCP, userId, postId }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionsMessages.INVALID_CCP.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given an update call for help post request, when ccp and ccp key exist and the ccp key in not valid, then should fail with a multi languages validation error', async () => {
        const { userId, postId } = await createCallForHelpPost();

        const INVALID_CCP_KEY = faker.datatype.number({ min: 1000 }).toString();

        await expect(
            callForHelpPostsManager.update(
                anEditCallForHelpPostRequest({ ccpKey: INVALID_CCP_KEY, userId, postId }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionsMessages.INVALID_CCP.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given an update call for help post request, when ccp and ccp key does not exist, then should update with no problem', async () => {
        const { userId, postId } = await createCallForHelpPost();

        await expect(
            callForHelpPostsManager.update(
                anEditCallForHelpPostRequest({ ccpKey: undefined, ccp: undefined, userId, postId }),
            ),
        ).to.eventually.be.fulfilled;
    });

    it("given an update call for help post request, when baridiMobNumber exist and it's not valid, then should fail with a multi languages validation error", async () => {
        const { userId, postId } = await createCallForHelpPost();

        const INVALID_BARIDI_MOB_NUMBER = '0918283091802938';

        await expect(
            callForHelpPostsManager.update(
                anEditCallForHelpPostRequest({
                    baridiMobNumber: INVALID_BARIDI_MOB_NUMBER,
                    userId,
                    postId,
                }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionsMessages.INVALID_BARIDI_MOB_NUMBER.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given an update call for help post request, when baridiMobNumber does not exist, then should update with no problem', async () => {
        const { userId, postId } = await createCallForHelpPost();

        await expect(
            callForHelpPostsManager.update(
                anEditCallForHelpPostRequest({ baridiMobNumber: undefined, userId, postId }),
            ),
        ).to.eventually.be.fulfilled;
    });

    it('given an update call for help post request, when pictures have all the old pictures and no new pictures, then should keep the pictures unchanged', async () => {
        const { userId, postId } = await createCallForHelpPost();

        const { pictures: picturesBeforeUpdate } = await callForHelpPostsManager.getById({
            postId,
        });

        await callForHelpPostsManager.update(
            anEditCallForHelpPostRequest({
                pictures: { new: [], old: picturesBeforeUpdate },
                userId,
                postId,
            }),
        );

        const { pictures: picturesAfterUpdate } = await callForHelpPostsManager.getById({
            postId,
        });

        expect(picturesBeforeUpdate).to.deep.equal(picturesAfterUpdate);
    });

    it('given an update call for help post request, when pictures have some old pictures missing and no new pictures, then should delete the missing old pictures', async () => {
        const { userId, postId } = await createCallForHelpPost();

        const { pictures: picturesBeforeUpdate } = await callForHelpPostsManager.getById({
            postId,
        });

        await callForHelpPostsManager.update(
            anEditCallForHelpPostRequest({
                pictures: { new: [], old: picturesBeforeUpdate.slice(1) },
                userId,
                postId,
            }),
        );

        const { pictures: picturesAfterUpdate } = await callForHelpPostsManager.getById({
            postId,
        });

        expect(picturesBeforeUpdate.slice(1)).to.deep.equal(picturesAfterUpdate);
    });

    it('given an update call for help post request, when pictures have some new and no new old pictures, then should delete all old pictures and have only the new ones', async () => {
        const { userId, postId } = await createCallForHelpPost();

        const { pictures: picturesBeforeUpdate } = await callForHelpPostsManager.getById({
            postId,
        });

        const NEW_PICTURES = Array.from({ length: 1 }).map(() => Buffer.from(faker.image.image()));

        await callForHelpPostsManager.update(
            anEditCallForHelpPostRequest({
                pictures: { new: NEW_PICTURES, old: [] },
                userId,
                postId,
            }),
        );

        const { pictures: picturesAfterUpdate } = await callForHelpPostsManager.getById({
            postId,
        });

        const isPicturedAfterUpdateIncludesPictureBeforeUpdate = picturesAfterUpdate.some(pic =>
            picturesBeforeUpdate.includes(pic),
        );

        expect(picturesAfterUpdate).to.have.lengthOf(NEW_PICTURES.length);
        expect(isPicturedAfterUpdateIncludesPictureBeforeUpdate).to.equal(false);
    });

    it('given an update call for help post request, when pictures have some new and some old pictures, then should delete all old pictures that are not in the old list and add the new ones', async () => {
        const { userId, postId } = await createCallForHelpPost();

        const { pictures: picturesBeforeUpdate } = await callForHelpPostsManager.getById({
            postId,
        });

        const NEW_PICTURES = Array.from({ length: 1 }).map(() => Buffer.from(faker.image.image()));
        const OLD_PICTURES_TO_KEEP = picturesBeforeUpdate.slice(0, 1);
        const OLD_PICTURES_TO_REMOVE = picturesBeforeUpdate.slice(1);

        await callForHelpPostsManager.update(
            anEditCallForHelpPostRequest({
                pictures: { new: NEW_PICTURES, old: OLD_PICTURES_TO_KEEP },
                userId,
                postId,
            }),
        );

        const { pictures: picturesAfterUpdate } = await callForHelpPostsManager.getById({
            postId,
        });

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

    it('given an update call for help post request, when pictures have some old pictures that in fact not in the post pictures, then should fail with a validation error', async () => {
        const { userId, postId } = await createCallForHelpPost();

        const RANDOM_PICS = Array.from({ length: 3 }).map(() => faker.internet.url());

        await expect(
            callForHelpPostsManager.update(
                anEditCallForHelpPostRequest({
                    pictures: { new: [], old: RANDOM_PICS },
                    userId,
                    postId,
                }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionsMessages.POST_PICTURE_NOT_EXIST)
            .and.to.be.an.instanceOf(ValidationException);
    });

    it('given an update call for help post request, when pictures have some old pictures, then should delete the other pictures that are not present in the request', async () => {
        const deleteSpy = spy(picturesManager, 'delete');

        const { userId, postId } = await createCallForHelpPost();

        const { pictures: picturesBeforeUpdate } = await callForHelpPostsManager.getById({
            postId,
        });

        const OLD_PICTURES_TO_KEEP = picturesBeforeUpdate.slice(0, 1);
        const OLD_PICTURES_TO_REMOVE = picturesBeforeUpdate.slice(1);

        await callForHelpPostsManager.update(
            anEditCallForHelpPostRequest({
                pictures: { new: [], old: OLD_PICTURES_TO_KEEP },
                userId,
                postId,
            }),
        );

        expect(deleteSpy.callCount).to.equal(OLD_PICTURES_TO_REMOVE.length);

        deleteSpy.restore();
    });

    it('given an update call for help post request, when the post updated, then should return the new updated post info', async () => {
        const { userId, postId } = await createCallForHelpPost();

        const returned = await callForHelpPostsManager.update(
            anEditCallForHelpPostRequest({
                userId,
                postId,
            }),
        );

        const updated = await callForHelpPostsManager.getById({ postId });

        expect(updated).to.deep.equal(returned);
    });

    it('given an update call for help post request, when the post updated, then should publish a post updated event to the global event bus', async () => {
        const mockFn = spy();
        EventBus.getInstance().subscribeTo('CALL_FOR_HELP_POST_UPDATED').by(mockFn);

        const { userId, postId } = await createCallForHelpPost();

        await callForHelpPostsManager.update(
            anEditCallForHelpPostRequest({
                userId,
                postId,
            }),
        );

        expect(mockFn.calledOnce).to.equal(true);
    });

    async function createCallForHelpPost() {
        const userId = faker.datatype.uuid();
        const { postId } = await callForHelpPostsManager.create(
            aCallForHelpPostCreationRequest({ publisherId: userId }),
        );

        return { userId, postId };
    }
});
