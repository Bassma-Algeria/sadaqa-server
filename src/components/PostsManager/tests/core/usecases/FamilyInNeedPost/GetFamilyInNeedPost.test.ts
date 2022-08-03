import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { aFamilyInNeedPostsManager } from '../base/aFamilyInNeedPostsManager';
import { aFamilyInNeedPostCreationRequest } from '../base/requests/aFamilyInNeedPostCreationRequest';

import { NotFoundException } from '../../../../main/core/domain/exceptions/NotFoundException';
import { ExceptionsMessages } from '../../../../main/core/domain/exceptions/ExceptionsMessages';

describe('Get Family In Need', () => {
    const postsManager = aFamilyInNeedPostsManager();

    it("should create a family in need post and get it by it's id", async () => {
        const familyInNeedPostInfo = aFamilyInNeedPostCreationRequest();

        const { postId } = await postsManager.create(familyInNeedPostInfo);
        const { pictures, wilayaNumber, publisherId } = await postsManager.getById({
            postId,
        });

        expect(familyInNeedPostInfo.pictures.length).to.equal(pictures.length);
        expect(familyInNeedPostInfo.wilayaNumber).to.equal(wilayaNumber);
        expect(familyInNeedPostInfo.publisherId).to.equal(publisherId);
    });

    it('should throw when no post found with the provided id', async () => {
        const NOT_EXIST = faker.datatype.uuid();

        await expect(postsManager.getById({ postId: NOT_EXIST }))
            .to.eventually.be.rejectedWith(ExceptionsMessages.POST_NOT_FOUND)
            .to.be.an.instanceOf(NotFoundException);
    });
});
