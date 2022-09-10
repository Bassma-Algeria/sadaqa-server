import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { aCallForHelpPostsManager } from '../base/aCallForHelpPostsManager';
import { aCallForHelpPostCreationRequest } from '../base/requests/aCallForHelpPostCreationRequest';

import { NotFoundException } from '../../../../main/core/domain/exceptions/NotFoundException';
import { ExceptionMessages } from '../../../../main/core/domain/exceptions/ExceptionMessages';

describe('Get Call For Help', () => {
    const postsManager = aCallForHelpPostsManager();

    it("should create a call for help post and get it by it's id", async () => {
        const familyInNeedPostInfo = aCallForHelpPostCreationRequest();

        const { postId } = await postsManager.create(familyInNeedPostInfo);
        const { pictures, wilayaNumber, publisherId } = await postsManager.getById({ postId });

        expect(familyInNeedPostInfo.pictures.length).to.equal(pictures.length);
        expect(familyInNeedPostInfo.wilayaNumber).to.equal(wilayaNumber);
        expect(familyInNeedPostInfo.publisherId).to.equal(publisherId);
    });

    it('should throw when no post found with the provided id', async () => {
        const NOT_EXIST = faker.datatype.uuid();

        await expect(postsManager.getById({ postId: NOT_EXIST }))
            .to.eventually.be.rejectedWith(ExceptionMessages.POST_NOT_FOUND)
            .and.to.be.an.instanceOf(NotFoundException);
    });
});
