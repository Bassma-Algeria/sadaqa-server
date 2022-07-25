import { expect } from 'chai';
import { anything, instance, mock, when } from 'ts-mockito';
import { faker } from '@faker-js/faker';

import { aPostsManagerFacade } from '../base/aPostsManagerFacade';
import { anAddToFavouriteRequest } from '../base/requests/anAddToFavouriteRequest';
import { aDonationPostCreationRequest } from '../base/requests/aDonationPostCreationRequest';

import { UsersService } from '../../../../main/core/domain/services/UsersService';
import { ValidationException } from '../../../../main/core/domain/exceptions/ValidationException';
import { ExceptionsMessages } from '../../../../main/core/domain/exceptions/ExceptionsMessages';
import { aDonationRequestPostCreationRequest } from '../base/requests/aDonationRequestPostCreationRequest';
import { aFamilyInNeedPostCreationRequest } from '../base/requests/aFamilyInNeedPostCreationRequest';
import { aCallForHelpPostCreationRequest } from '../base/requests/aCallForHelpPostCreationRequest';

describe('Add To Favourite Posts', () => {
  const mockUsersService = mock<UsersService>();
  const postsManager = aPostsManagerFacade({ usersService: instance(mockUsersService) });

  beforeEach(async () => {
    when(mockUsersService.isExist(anything())).thenResolve(true);
    when(mockUsersService.isActiveAssociation(anything())).thenResolve(true);
  });

  it('given an add to favourite posts request, when userId is not an existing account id, then should fail', async () => {
    when(mockUsersService.isExist(anything())).thenResolve(false);

    const NOT_EXISTING_USER_ID = faker.datatype.uuid();

    await expect(
      postsManager.addToFavouritePosts(anAddToFavouriteRequest({ userId: NOT_EXISTING_USER_ID })),
    )
      .to.eventually.be.rejectedWith(ExceptionsMessages.USER_NOT_EXIST)
      .and.be.and.instanceOf(ValidationException);
  });

  it('given an add to favourite posts request, when the post type is not a valid post type, then should fail', async () => {
    const { postId } = await postsManager.createDonationPost(aDonationPostCreationRequest());

    const INVALID_POST_TYPE = faker.datatype.string(10);

    await expect(
      postsManager.addToFavouritePosts(
        anAddToFavouriteRequest({ postId, postType: INVALID_POST_TYPE }),
      ),
    )
      .to.eventually.be.rejectedWith(ExceptionsMessages.INVALID_POST_TYPE)
      .and.be.and.instanceOf(ValidationException);
  });

  it('given an add to favourite posts request, when post id is not a valid id of the given postType, then should fail', async () => {
    const { postId } = await postsManager.createDonationPost(aDonationPostCreationRequest());

    await expect(
      postsManager.addToFavouritePosts(
        anAddToFavouriteRequest({ postId, postType: 'donation-request' }),
      ),
    )
      .to.eventually.be.rejectedWith(ExceptionsMessages.POST_NOT_EXIST)
      .and.be.and.instanceOf(ValidationException);
  });

  it('given a request to add a donation to favourite posts, when accessing the favourite posts, then the donation post should be there', async () => {
    const { postId } = await postsManager.createDonationPost(aDonationPostCreationRequest());
    const addToFavouriteRequest = anAddToFavouriteRequest({ postId, postType: 'donation' });
    await postsManager.addToFavouritePosts(addToFavouriteRequest);

    const favouritePosts = await postsManager.getFavouritePosts({
      userId: addToFavouriteRequest.userId,
    });

    expect(favouritePosts.donations).to.have.lengthOf(1);
    expect(favouritePosts.donations[0]).to.have.property('postId', postId);
  });

  it('given a request to add a donation request to favourite posts, when accessing the favourite posts, then the donation request post should be there', async () => {
    const { postId } = await postsManager.createDonationRequestPost(
      aDonationRequestPostCreationRequest(),
    );
    const addToFavouriteRequest = anAddToFavouriteRequest({ postId, postType: 'donation-request' });
    await postsManager.addToFavouritePosts(addToFavouriteRequest);

    const favouritePosts = await postsManager.getFavouritePosts({
      userId: addToFavouriteRequest.userId,
    });

    expect(favouritePosts.donationRequests).to.have.lengthOf(1);
    expect(favouritePosts.donationRequests[0]).to.have.property('postId', postId);
  });

  it('given a request to add a family in need to favourite posts, when accessing the favourite posts, then the family in need post should be there', async () => {
    const { postId } = await postsManager.createFamilyInNeedPost(
      aFamilyInNeedPostCreationRequest(),
    );
    const addToFavouriteRequest = anAddToFavouriteRequest({ postId, postType: 'family-in-need' });
    await postsManager.addToFavouritePosts(addToFavouriteRequest);

    const favouritePosts = await postsManager.getFavouritePosts({
      userId: addToFavouriteRequest.userId,
    });

    expect(favouritePosts.familiesInNeed).to.have.lengthOf(1);
    expect(favouritePosts.familiesInNeed[0]).to.have.property('postId', postId);
  });

  it('given a request to add a call for help to favourite posts, when accessing the favourite posts, then the call for help post should be there', async () => {
    const { postId } = await postsManager.createCallForHelpPost(aCallForHelpPostCreationRequest());
    const addToFavouriteRequest = anAddToFavouriteRequest({ postId, postType: 'call-for-help' });
    await postsManager.addToFavouritePosts(addToFavouriteRequest);

    const favouritePosts = await postsManager.getFavouritePosts({
      userId: addToFavouriteRequest.userId,
    });

    expect(favouritePosts.callForHelps).to.have.lengthOf(1);
    expect(favouritePosts.callForHelps[0]).to.have.property('postId', postId);
  });
});