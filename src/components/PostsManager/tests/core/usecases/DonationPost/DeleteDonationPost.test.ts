import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { aPostsManagerFacade } from '../base/aPostsManagerFacade';
import { aDeletePostRequest } from '../base/requests/aDeletePostRequest';
import { aDonationPostCreationRequest } from '../base/requests/aDonationPostCreationRequest';

import { ExceptionsMessages } from '../../../../main/core/domain/exceptions/ExceptionsMessages';
import { PostNotFoundException } from '../../../../main/core/domain/exceptions/PostNotFoundException';
import { NotAuthorizedException } from '../../../../main/core/domain/exceptions/NotAuthorizedException';

describe('Delete Donation Post', () => {
  const postsManager = aPostsManagerFacade();

  it('given a delete donation post request, when the post id is not an id of an existing post, then reject', async () => {
    const NOT_EXIST = faker.datatype.uuid();

    await expect(
      postsManager.deleteDonationPost(aDeletePostRequest({ postId: NOT_EXIST })),
    ).to.eventually.be.rejectedWith(PostNotFoundException);
  });

  it('given a delete donation post request, when the user id is not the publisher of the target post, then forbid', async () => {
    const NOT_PUBLISHER = faker.datatype.uuid();
    const { postId } = await postsManager.createDonationPost(aDonationPostCreationRequest());

    await expect(
      postsManager.deleteDonationPost(aDeletePostRequest({ postId, userId: NOT_PUBLISHER })),
    )
      .to.eventually.be.rejectedWith(ExceptionsMessages.NOT_AUTHORIZED_TO_DELETE)
      .and.to.be.an.instanceOf(NotAuthorizedException);
  });

  it('given a delete donation post request, when userId and postId are valid, then delete the post', async () => {
    const post = aDonationPostCreationRequest();
    const { postId } = await postsManager.createDonationPost(post);

    await postsManager.deleteDonationPost({ postId, userId: post.publisherId });

    await expect(postsManager.getDonationPost({ postId })).to.eventually.be.rejectedWith(
      PostNotFoundException,
    );
  });
});
