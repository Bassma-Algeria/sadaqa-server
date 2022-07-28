import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { aPostsManagerFacade } from '../base/aPostsManagerFacade';
import { aDeletePostRequest } from '../base/requests/aDeletePostRequest';

import { ExceptionsMessages } from '../../../../main/core/domain/exceptions/ExceptionsMessages';
import { PostNotFoundException } from '../../../../main/core/domain/exceptions/PostNotFoundException';
import { NotAuthorizedException } from '../../../../main/core/domain/exceptions/NotAuthorizedException';
import { aCallForHelpPostCreationRequest } from '../base/requests/aCallForHelpPostCreationRequest';

describe('Delete Call For Help Post', () => {
  const postsManager = aPostsManagerFacade();

  it('given a delete call for help post request, when the post id is not an id of an existing post, then reject', async () => {
    const NOT_EXIST = faker.datatype.uuid();

    await expect(
      postsManager.deleteCallForHelpPost(aDeletePostRequest({ postId: NOT_EXIST })),
    ).to.eventually.be.rejectedWith(PostNotFoundException);
  });

  it('given a delete call for help post request, when the user id is not the publisher of the target post, then forbid', async () => {
    const NOT_PUBLISHER = faker.datatype.uuid();
    const { postId } = await postsManager.createCallForHelpPost(aCallForHelpPostCreationRequest());

    await expect(
      postsManager.deleteCallForHelpPost(aDeletePostRequest({ postId, userId: NOT_PUBLISHER })),
    )
      .to.eventually.be.rejectedWith(ExceptionsMessages.NOT_AUTHORIZED_TO_DELETE)
      .and.to.be.an.instanceOf(NotAuthorizedException);
  });

  it('given a delete call for help post request, when userId and postId are valid, then delete the post', async () => {
    const post = aCallForHelpPostCreationRequest();
    const { postId } = await postsManager.createCallForHelpPost(post);

    await postsManager.deleteCallForHelpPost({ postId, userId: post.publisherId });

    await expect(postsManager.getCallForHelpPost({ postId })).to.eventually.be.rejectedWith(
      PostNotFoundException,
    );
  });
});
