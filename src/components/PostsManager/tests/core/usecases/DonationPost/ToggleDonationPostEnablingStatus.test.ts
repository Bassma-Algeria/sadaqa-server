import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { aPostsManagerFacade } from '../base/aPostsManagerFacade';
import { aDonationPostCreationRequest } from '../base/requests/aDonationPostCreationRequest';
import { aTogglePostEnablingStatusRequest } from '../base/requests/aTogglePostEnablingStatusRequest';

import { NotFoundException } from '../../../../main/core/domain/exceptions/NotFoundException';
import { ExceptionsMessages } from '../../../../main/core/domain/exceptions/ExceptionsMessages';
import { NotAuthorizedException } from '../../../../main/core/domain/exceptions/NotAuthorizedException';

describe('Toggle Donation Post Enabling Status', () => {
  const postsManager = aPostsManagerFacade();

  it('given a toggle donation post enabling status request, when the postId not exist, should throw a not found exception', async () => {
    const NOT_EXIST = faker.datatype.uuid();

    await expect(
      postsManager.toggleDonationPostEnablingStatus(
        aTogglePostEnablingStatusRequest({ postId: NOT_EXIST }),
      ),
    )
      .to.eventually.be.rejectedWith(ExceptionsMessages.POST_NOT_FOUND)
      .and.to.be.an.instanceOf(NotFoundException);
  });

  it('given a toggle donation post enabling status request, when the userId is not the publisher, should throw a not authorized exception', async () => {
    const NOT_PUBLISHER = faker.datatype.uuid();
    const { postId } = await postsManager.createDonationPost(aDonationPostCreationRequest());

    await expect(
      postsManager.toggleDonationPostEnablingStatus(
        aTogglePostEnablingStatusRequest({ postId, userId: NOT_PUBLISHER }),
      ),
    )
      .to.eventually.be.rejectedWith(ExceptionsMessages.NOT_AUTHORIZED_TO_EDIT)
      .and.to.be.an.instanceOf(NotAuthorizedException);
  });

  it('given a toggle donation post enabling status request, when the userId is the publisher and the post is enabled, should make it disabled', async () => {
    const post = aDonationPostCreationRequest();
    const { postId } = await postsManager.createDonationPost(post);

    const { status: statusBeforeToggle } = await postsManager.getDonationPost({ postId });

    await postsManager.toggleDonationPostEnablingStatus({ postId, userId: post.publisherId });

    const { status: statusAfterToggle } = await postsManager.getDonationPost({ postId });

    expect(statusBeforeToggle).to.equal('ENABLED');
    expect(statusAfterToggle).to.equal('DISABLED');
  });

  it('given a toggle donation post enabling status request, when the userId is the publisher and the post is disabled, should make it enabled', async () => {
    const post = aDonationPostCreationRequest();
    const { postId } = await postsManager.createDonationPost(post);

    await postsManager.toggleDonationPostEnablingStatus({ postId, userId: post.publisherId });

    const { status: statusBeforeToggle } = await postsManager.getDonationPost({ postId });

    await postsManager.toggleDonationPostEnablingStatus({ postId, userId: post.publisherId });

    const { status: statusAfterToggle } = await postsManager.getDonationPost({ postId });

    expect(statusBeforeToggle).to.equal('DISABLED');
    expect(statusAfterToggle).to.equal('ENABLED');
  });

  it('given a toggle donation post enabling status request, after updating the post status, then should return the updated post', async () => {
    const post = aDonationPostCreationRequest();
    const { postId } = await postsManager.createDonationPost(post);

    const returned = await postsManager.toggleDonationPostEnablingStatus({
      postId,
      userId: post.publisherId,
    });

    const updated = await postsManager.getDonationPost({ postId });

    expect(updated).to.deep.equal(returned);
  });
});
