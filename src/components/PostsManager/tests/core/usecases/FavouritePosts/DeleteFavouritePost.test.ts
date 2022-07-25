import { expect } from 'chai';

import { aPostsManagerFacade } from '../base/aPostsManagerFacade';

import { ExceptionsMessages } from '../../../../main/core/domain/exceptions/ExceptionsMessages';
import { ValidationException } from '../../../../main/core/domain/exceptions/ValidationException';

import { anAddToFavouriteRequest } from '../base/requests/anAddToFavouriteRequest';
import { aDeleteFavouritePostRequest } from '../base/requests/aDeleteFavouritePostRequest';
import { aDonationPostCreationRequest } from '../base/requests/aDonationPostCreationRequest';

describe('Delete Favourite Post', () => {
  const postsManager = aPostsManagerFacade();

  it('given a delete favourite post request, when the favourite post requested does not exist, then should fail', async () => {
    await expect(postsManager.deleteFavouritePost(aDeleteFavouritePostRequest()))
      .to.eventually.be.rejectedWith(ExceptionsMessages.FAVOURITE_POST_NOT_EXIST)
      .and.be.and.instanceOf(ValidationException);
  });

  it('given a delete favourite post request, when the favourite post exist, then should be delteted', async () => {
    const { postId } = await postsManager.createDonationPost(aDonationPostCreationRequest());
    const favouritePost = anAddToFavouriteRequest({ postId, postType: 'donation' });
    await postsManager.addToFavouritePosts(favouritePost);

    const { donations: favouriteDonationsBeforeDelete } = await postsManager.getFavouritePosts({
      userId: favouritePost.userId,
    });

    await postsManager.deleteFavouritePost(favouritePost);

    const { donations: favouriteDonationsAfterDelete } = await postsManager.getFavouritePosts({
      userId: favouritePost.userId,
    });

    expect(favouriteDonationsBeforeDelete).to.have.lengthOf(1);
    expect(favouriteDonationsAfterDelete).to.have.lengthOf(0);
  });
});