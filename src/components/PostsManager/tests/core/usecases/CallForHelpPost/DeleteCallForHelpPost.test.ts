import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { aFavouritePostsManager } from '../base/aFavouritePostsManager';
import { aDeletePostRequest } from '../base/requests/aDeletePostRequest';
import { aCallForHelpPostsManager } from '../base/aCallForHelpPostsManager';
import { anAddToFavouriteRequest } from '../base/requests/anAddToFavouriteRequest';
import { anIsPostInFavouriteRequest } from '../base/requests/anIsPostInFavouriteRequest';
import { aCallForHelpPostCreationRequest } from '../base/requests/aCallForHelpPostCreationRequest';

import { ExceptionMessages } from '../../../../main/core/domain/exceptions/ExceptionMessages';
import { NotFoundException } from '../../../../main/core/domain/exceptions/NotFoundException';
import { AuthorizationException } from '../../../../main/core/domain/exceptions/AuthorizationException';

describe('Delete Call For Help Post', () => {
    const favouritePostsManager = aFavouritePostsManager();
    const callForHelpPostsManager = aCallForHelpPostsManager();

    it('given a delete call for help post request, when the post id is not an id of an existing post, then reject', async () => {
        const NOT_EXIST = faker.datatype.uuid();

        await expect(callForHelpPostsManager.delete(aDeletePostRequest({ postId: NOT_EXIST })))
            .to.eventually.be.rejectedWith(ExceptionMessages.POST_NOT_FOUND)
            .and.to.be.an.instanceOf(NotFoundException);
    });

    it('given a delete call for help post request, when the user id is not the publisher of the target post, then forbid', async () => {
        const NOT_PUBLISHER = faker.datatype.uuid();
        const { postId } = await callForHelpPostsManager.create(aCallForHelpPostCreationRequest());

        await expect(
            callForHelpPostsManager.delete(aDeletePostRequest({ postId, userId: NOT_PUBLISHER })),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.NOT_AUTHORIZED_TO_DELETE)
            .and.to.be.an.instanceOf(AuthorizationException);
    });

    it('given a delete call for help post request, when userId and postId are valid, then delete the post', async () => {
        const post = aCallForHelpPostCreationRequest();
        const { postId } = await callForHelpPostsManager.create(post);

        await callForHelpPostsManager.delete({ postId, userId: post.publisherId });

        await expect(callForHelpPostsManager.getById({ postId }))
            .to.eventually.be.rejectedWith(ExceptionMessages.POST_NOT_FOUND)
            .and.to.be.an.instanceOf(NotFoundException);
    });

    it('given a delete call for help post request, when deleting the post, then should delete all the corresponding posts that are added to favourite', async () => {
        const post = aCallForHelpPostCreationRequest();
        const { postId } = await callForHelpPostsManager.create(post);

        const favourite = anAddToFavouriteRequest({ postId, postType: 'call-for-help' });
        await favouritePostsManager.addToFavourite(favourite);

        await callForHelpPostsManager.delete({ postId, userId: post.publisherId });

        const { isFavourite } = await favouritePostsManager.isPostInFavourite(
            anIsPostInFavouriteRequest(favourite),
        );

        expect(isFavourite).to.equal(false);
    });
});
