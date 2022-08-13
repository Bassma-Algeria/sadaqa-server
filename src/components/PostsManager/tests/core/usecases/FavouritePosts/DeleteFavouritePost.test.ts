import { expect } from 'chai';

import { ExceptionMessages } from '../../../../main/core/domain/exceptions/ExceptionMessages';
import { ValidationException } from '../../../../main/core/domain/exceptions/ValidationException';

import { aDonationPostsManager } from '../base/aDonationPostsManager';
import { aFavouritePostsManager } from '../base/aFavouritePostsManager';
import { anAddToFavouriteRequest } from '../base/requests/anAddToFavouriteRequest';
import { aDeleteFavouritePostRequest } from '../base/requests/aDeleteFavouritePostRequest';
import { aDonationPostCreationRequest } from '../base/requests/aDonationPostCreationRequest';

describe('Delete Favourite Post', () => {
    const favouritePostsManager = aFavouritePostsManager();
    const donationsPostsManager = aDonationPostsManager();

    it('given a delete favourite post request, when the favourite post requested does not exist, then should fail', async () => {
        await expect(favouritePostsManager.deleteFromFavourite(aDeleteFavouritePostRequest()))
            .to.eventually.be.rejectedWith(ExceptionMessages.FAVOURITE_POST_NOT_EXIST)
            .and.be.and.instanceOf(ValidationException);
    });

    it('given a delete favourite post request, when the favourite post exist, then should be deleted', async () => {
        const { postId } = await donationsPostsManager.create(aDonationPostCreationRequest());
        const favouritePost = anAddToFavouriteRequest({ postId, postType: 'donation' });
        await favouritePostsManager.addToFavourite(favouritePost);

        const { donation: favouriteDonationsBeforeDelete } =
            await favouritePostsManager.getFavouritePosts({
                userId: favouritePost.userId,
            });

        await favouritePostsManager.deleteFromFavourite(favouritePost);

        const { donation: favouriteDonationsAfterDelete } =
            await favouritePostsManager.getFavouritePosts({
                userId: favouritePost.userId,
            });

        expect(favouriteDonationsBeforeDelete).to.have.lengthOf(1);
        expect(favouriteDonationsAfterDelete).to.have.lengthOf(0);
    });
});
