import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { aDonationPostsManager } from '../base/aDonationPostsManager';
import { aFavouritePostsManager } from '../base/aFavouritePostsManager';

import { aDeletePostRequest } from '../base/requests/aDeletePostRequest';
import { anAddToFavouriteRequest } from '../base/requests/anAddToFavouriteRequest';
import { anIsPostInFavouriteRequest } from '../base/requests/anIsPostInFavouriteRequest';
import { aDonationPostCreationRequest } from '../base/requests/aDonationPostCreationRequest';

import { NotFoundException } from '../../../../main/core/domain/exceptions/NotFoundException';
import { ExceptionMessages } from '../../../../main/core/domain/exceptions/ExceptionMessages';
import { AuthorizationException } from '../../../../main/core/domain/exceptions/AuthorizationException';

describe('Delete Donation Post', () => {
    const postsManager = aDonationPostsManager();
    const favouritePostsManager = aFavouritePostsManager();

    it('given a delete donation post request, when the post id is not an id of an existing post, then reject', async () => {
        const NOT_EXIST = faker.datatype.uuid();

        await expect(postsManager.delete(aDeletePostRequest({ postId: NOT_EXIST })))
            .to.eventually.be.rejectedWith(ExceptionMessages.POST_NOT_FOUND)
            .and.to.be.an.instanceOf(NotFoundException);
    });

    it('given a delete donation post request, when the user id is not the publisher of the target post, then forbid', async () => {
        const NOT_PUBLISHER = faker.datatype.uuid();
        const { postId } = await postsManager.create(aDonationPostCreationRequest());

        await expect(postsManager.delete(aDeletePostRequest({ postId, userId: NOT_PUBLISHER })))
            .to.eventually.be.rejectedWith(ExceptionMessages.NOT_AUTHORIZED_TO_DELETE)
            .and.to.be.an.instanceOf(AuthorizationException);
    });

    it('given a delete donation post request, when userId and postId are valid, then delete the post', async () => {
        const post = aDonationPostCreationRequest();
        const { postId } = await postsManager.create(post);

        await postsManager.delete({ postId, userId: post.publisherId });

        await expect(postsManager.getById({ postId }))
            .to.eventually.be.rejectedWith(ExceptionMessages.POST_NOT_FOUND)
            .and.to.be.an.instanceOf(NotFoundException);
    });

    it('given a delete donation post request, when deleting the post, then should delete all the corresponding posts that are added to favourite', async () => {
        const post = aDonationPostCreationRequest();
        const { postId } = await postsManager.create(post);

        const favourite = anAddToFavouriteRequest({ postId, postType: 'donation' });
        await favouritePostsManager.addToFavourite(favourite);

        await postsManager.delete({ postId, userId: post.publisherId });

        const { isFavourite } = await favouritePostsManager.isPostInFavourite(
            anIsPostInFavouriteRequest(favourite),
        );

        expect(isFavourite).to.equal(false);
    });
});
