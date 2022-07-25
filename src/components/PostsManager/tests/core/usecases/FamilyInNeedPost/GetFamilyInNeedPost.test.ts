import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { cleanData } from './base/cleanData';
import { aPostsManagerFacade } from '../base/aPostsManagerFacade';
import { aFamilyInNeedPostCreationRequest } from '../base/requests/aFamilyInNeedPostCreationRequest';

import { PostNotFoundException } from '../../../../main/core/domain/exceptions/PostNotFoundException';

describe('Get Family In Need', () => {
  const postsManager = aPostsManagerFacade();

  beforeEach(async () => {
    await cleanData();
  });

  it("should create a family in need post and get it by it's id", async () => {
    const familyInNeedPostInfo = aFamilyInNeedPostCreationRequest();

    const { postId } = await postsManager.createFamilyInNeedPost(familyInNeedPostInfo);
    const { pictures, wilayaNumber, publisherId } = await postsManager.getFamilyInNeedPost({
      postId,
    });

    expect(familyInNeedPostInfo.pictures.length).to.equal(pictures.length);
    expect(familyInNeedPostInfo.wilayaNumber).to.equal(wilayaNumber);
    expect(familyInNeedPostInfo.publisherId).to.equal(publisherId);
  });

  it('should throw when no post found with the provided id', async () => {
    const NOT_EXIST = faker.datatype.uuid();

    await expect(
      postsManager.getFamilyInNeedPost({ postId: NOT_EXIST }),
    ).to.eventually.be.rejectedWith(PostNotFoundException);
  });
});