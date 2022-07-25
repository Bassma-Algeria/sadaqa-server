import { expect } from 'chai';

import { cleanData } from './base/cleanData';
import { aPostsManagerFacade } from '../base/aPostsManagerFacade';
import { aDonationPostCreationRequest } from '../base/requests/aDonationPostCreationRequest';

import { PostNotFoundException } from '../../../../main/core/domain/exceptions/PostNotFoundException';

describe('Get DonationPost Post', () => {
  const postsManager = aPostsManagerFacade();

  beforeEach(async () => {
    await cleanData();
  });

  it("should create a donation post, and be able to get it by it's id", async () => {
    const postCreationBody = aDonationPostCreationRequest();

    const { postId } = await postsManager.createDonationPost(postCreationBody);
    const postInfo = await postsManager.getDonationPost({ postId });

    expect(postInfo.postId).to.equal(postId);
    expect(postInfo.category).to.equal(postCreationBody.category);
    expect(postInfo.publisherId).to.equal(postCreationBody.publisherId);
    expect(postInfo.wilayaNumber).to.equal(postCreationBody.wilayaNumber);
  });

  it('given a non existing id, should throw a not found exception', async () => {
    const NOT_EXISING_POST = 'some random';

    await expect(
      postsManager.getDonationPost({ postId: NOT_EXISING_POST }),
    ).to.eventually.be.rejectedWith(PostNotFoundException);
  });
});
