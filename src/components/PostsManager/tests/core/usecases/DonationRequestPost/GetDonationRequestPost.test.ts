import { expect } from 'chai';

import { cleanData } from './base/cleanData';
import { aPostsManagerFacade } from '../base/aPostsManagerFacade';

import { PostNotFoundException } from '../../../../main/core/domain/exceptions/PostNotFoundException';
import { aDonationRequestPostCreationRequest } from './base/aDonationRequestPostCreationRequest';

describe('Get Donation Request Post', () => {
  const postsManager = aPostsManagerFacade();

  beforeEach(async () => {
    await cleanData();
  });

  it("should create a donation request post, and be able to get it by it's id", async () => {
    const postCreationBody = aDonationRequestPostCreationRequest();

    const { postId } = await postsManager.createDonationRequestPost(postCreationBody);
    const postInfo = await postsManager.getDonationRequestPost({ postId });

    expect(postInfo.postId).to.equal(postId);
    expect(postInfo.category).to.equal(postCreationBody.category);
    expect(postInfo.publisherId).to.equal(postCreationBody.publisherId);
    expect(postInfo.wilayaNumber).to.equal(postCreationBody.wilayaNumber);
  });

  it('given a non existing id, should throw a not found exception', async () => {
    const NOT_EXISING_POST = 'some random';

    await expect(
      postsManager.getDonationRequestPost({ postId: NOT_EXISING_POST }),
    ).to.eventually.be.rejectedWith(PostNotFoundException);
  });
});
