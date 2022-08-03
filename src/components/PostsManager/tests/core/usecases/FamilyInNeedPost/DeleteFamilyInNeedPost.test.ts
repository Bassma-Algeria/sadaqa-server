import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { aDeletePostRequest } from '../base/requests/aDeletePostRequest';
import { aFamilyInNeedPostsManager } from '../base/aFamilyInNeedPostsManager';
import { aFamilyInNeedPostCreationRequest } from '../base/requests/aFamilyInNeedPostCreationRequest';

import { NotFoundException } from '../../../../main/core/domain/exceptions/NotFoundException';
import { ExceptionsMessages } from '../../../../main/core/domain/exceptions/ExceptionsMessages';
import { AuthorizationException } from '../../../../main/core/domain/exceptions/AuthorizationException';

describe('Delete Family In Need Post', () => {
    const postsManager = aFamilyInNeedPostsManager();

    it('given a delete family in need request post request, when the post id is not an id of an existing post, then reject', async () => {
        const NOT_EXIST = faker.datatype.uuid();

        await expect(postsManager.delete(aDeletePostRequest({ postId: NOT_EXIST })))
            .to.eventually.be.rejectedWith(ExceptionsMessages.POST_NOT_FOUND)
            .and.to.be.an.instanceOf(NotFoundException);
    });

    it('given a delete family in need request post request, when the user id is not the publisher of the target post, then forbid', async () => {
        const NOT_PUBLISHER = faker.datatype.uuid();
        const { postId } = await postsManager.create(aFamilyInNeedPostCreationRequest());

        await expect(postsManager.delete(aDeletePostRequest({ postId, userId: NOT_PUBLISHER })))
            .to.eventually.be.rejectedWith(ExceptionsMessages.NOT_AUTHORIZED_TO_DELETE)
            .and.to.be.an.instanceOf(AuthorizationException);
    });

    it('given a delete family in need request post request, when userId and postId are valid, then delete the post', async () => {
        const post = aFamilyInNeedPostCreationRequest();
        const { postId } = await postsManager.create(post);

        await postsManager.delete({ postId, userId: post.publisherId });

        await expect(postsManager.getById({ postId }))
            .to.eventually.be.rejectedWith(ExceptionsMessages.POST_NOT_FOUND)
            .and.to.be.an.instanceOf(NotFoundException);
    });
});
