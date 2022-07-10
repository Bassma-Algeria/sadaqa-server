import { expect } from 'chai';
import { instance, mock, when } from 'ts-mockito';

import { DateTimeService } from '../../../main/core/domain/services/DateTimeService';

import { aDonationPostCreationRequest } from './base/CreateDonationRequestFactory';

import { aPostsManagerFacade } from './base/PostsManagerFacadeFactory';

describe('Create & Get posts', () => {
  const mockDateTimeService = mock<DateTimeService>();

  const postsManagerFacade = aPostsManagerFacade({
    dateTimeService: instance(mockDateTimeService),
  });

  beforeEach(() => {
    when(mockDateTimeService.now()).thenReturn(new Date());
  });

  it("should create a donation post, and be able to get it by it's id", async () => {
    const creationTime = new Date();
    when(mockDateTimeService.now()).thenReturn(creationTime);

    const postCreationBody = aDonationPostCreationRequest();

    const { postId } = await postsManagerFacade.createDonationPost(postCreationBody);
    const postInfo = await postsManagerFacade.getDonationPost({ postId });

    expect(postInfo.postId).to.equal(postId);
    expect(postInfo.category).to.equal(postCreationBody.category);
    expect(postInfo.publisherId).to.equal(postCreationBody.publisherId);
    expect(postInfo.wilayaNumber).to.equal(postCreationBody.wilayaNumber);
    expect(postInfo.createdAt).to.equal(creationTime.toISOString());
  });
});
