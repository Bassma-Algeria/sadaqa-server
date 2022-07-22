import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { cleanData } from './base/cleanData';
import { aPostsManagerFacade } from '../base/aPostsManagerFacade';
import { aCallForHelpPostCreationRequest } from './base/aCallForHelpPostCreationRequest';

import { PostNotFoundException } from '../../../../main/core/domain/exceptions/PostNotFoundException';

describe('Get Call For Help', () => {
  const postsManager = aPostsManagerFacade();

  beforeEach(async () => {
    await cleanData();
  });

  it("should create a call for help post and get it by it's id", async () => {
    const familyInNeedPostInfo = aCallForHelpPostCreationRequest();

    const { postId } = await postsManager.createCallForHelpPost(familyInNeedPostInfo);
    const { pictures, wilayaNumber, publisherId } = await postsManager.getCallForHelpPost({
      postId,
    });

    expect(familyInNeedPostInfo.pictures.length).to.equal(pictures.length);
    expect(familyInNeedPostInfo.wilayaNumber).to.equal(wilayaNumber);
    expect(familyInNeedPostInfo.publisherId).to.equal(publisherId);
  });

  it('should throw when no post found with the provided id', async () => {
    const NOT_EXIST = faker.datatype.uuid();

    await expect(
      postsManager.getCallForHelpPost({ postId: NOT_EXIST }),
    ).to.eventually.be.rejectedWith(PostNotFoundException);
  });
});