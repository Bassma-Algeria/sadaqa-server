import { expect } from 'chai';

import { aDonationRequestPostsManager } from '../base/aDonationRequestPostsManager';
import { aDonationRequestPostCreationRequest } from '../base/requests/aDonationRequestPostCreationRequest';

import { NotFoundException } from '../../../../main/core/domain/exceptions/NotFoundException';
import { ExceptionsMessages } from '../../../../main/core/domain/exceptions/ExceptionsMessages';

describe('Get Donation Request Post', () => {
    const postsManager = aDonationRequestPostsManager();

    it("should create a donation request post, and be able to get it by it's id", async () => {
        const postCreationBody = aDonationRequestPostCreationRequest();

        const { postId } = await postsManager.create(postCreationBody);
        const postInfo = await postsManager.getById({ postId });

        expect(postInfo.postId).to.equal(postId);
        expect(postInfo.category).to.equal(postCreationBody.category);
        expect(postInfo.publisherId).to.equal(postCreationBody.publisherId);
        expect(postInfo.wilayaNumber).to.equal(postCreationBody.wilayaNumber);
    });

    it('given a non existing id, should throw a not found exception', async () => {
        const NOT_EXISING_POST = 'some random';

        await expect(postsManager.getById({ postId: NOT_EXISING_POST }))
            .to.eventually.be.rejectedWith(ExceptionsMessages.POST_NOT_FOUND)
            .to.be.an.instanceOf(NotFoundException);
    });
});
