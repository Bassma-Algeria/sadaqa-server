import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { aPostsManagerFacade } from '../base/aPostsManagerFacade';
import { aTogglePostEnablingStatusRequest } from '../base/requests/aTogglePostEnablingStatusRequest';
import { aCallForHelpPostCreationRequest } from '../base/requests/aCallForHelpPostCreationRequest';

import { NotFoundException } from '../../../../main/core/domain/exceptions/NotFoundException';
import { ExceptionsMessages } from '../../../../main/core/domain/exceptions/ExceptionsMessages';
import { NotAuthorizedException } from '../../../../main/core/domain/exceptions/NotAuthorizedException';

describe('Toggle Call For Help Post Enabling Status', () => {
  const postsManager = aPostsManagerFacade();

  it('given a toggle call for help enabling status request, when the postId not exist, should throw a not found exception', async () => {
    const NOT_EXIST = faker.datatype.uuid();

    await expect(
      postsManager.toggleCallForHelpPostEnablingStatus(
        aTogglePostEnablingStatusRequest({ postId: NOT_EXIST }),
      ),
    )
      .to.eventually.be.rejectedWith(ExceptionsMessages.POST_NOT_FOUND)
      .and.to.be.an.instanceOf(NotFoundException);
  });

  it('given a toggle call for help enabling status request, when the userId is not the publisher, should throw a not authorized exception', async () => {
    const NOT_PUBLISHER = faker.datatype.uuid();
    const { postId } = await postsManager.createCallForHelpPost(aCallForHelpPostCreationRequest());

    await expect(
      postsManager.toggleCallForHelpPostEnablingStatus(
        aTogglePostEnablingStatusRequest({ postId, userId: NOT_PUBLISHER }),
      ),
    )
      .to.eventually.be.rejectedWith(ExceptionsMessages.NOT_AUTHORIZED_TO_EDIT)
      .and.to.be.an.instanceOf(NotAuthorizedException);
  });

  it('given a toggle call for help enabling status request, when the userId is the publisher and the post is enabled, should make it disabled', async () => {
    const post = aCallForHelpPostCreationRequest();
    const { postId } = await postsManager.createCallForHelpPost(post);

    const { status: statusBeforeToggle } = await postsManager.getCallForHelpPost({ postId });

    await postsManager.toggleCallForHelpPostEnablingStatus({ postId, userId: post.publisherId });

    const { status: statusAfterToggle } = await postsManager.getCallForHelpPost({ postId });

    expect(statusBeforeToggle).to.equal('ENABLED');
    expect(statusAfterToggle).to.equal('DISABLED');
  });

  it('given a toggle call for help enabling status request, when the userId is the publisher and the post is disabled, should make it enabled', async () => {
    const post = aCallForHelpPostCreationRequest();
    const { postId } = await postsManager.createCallForHelpPost(post);

    await postsManager.toggleCallForHelpPostEnablingStatus({ postId, userId: post.publisherId });

    const { status: statusBeforeToggle } = await postsManager.getCallForHelpPost({ postId });

    await postsManager.toggleCallForHelpPostEnablingStatus({ postId, userId: post.publisherId });

    const { status: statusAfterToggle } = await postsManager.getCallForHelpPost({ postId });

    expect(statusBeforeToggle).to.equal('DISABLED');
    expect(statusAfterToggle).to.equal('ENABLED');
  });

  it('given a toggle call for help enabling status request, after updating the post status, then should return the updated post', async () => {
    const post = aCallForHelpPostCreationRequest();
    const { postId } = await postsManager.createCallForHelpPost(post);

    const returned = await postsManager.toggleCallForHelpPostEnablingStatus({
      postId,
      userId: post.publisherId,
    });

    const updated = await postsManager.getCallForHelpPost({ postId });

    expect(updated).to.deep.equal(returned);
  });
});
