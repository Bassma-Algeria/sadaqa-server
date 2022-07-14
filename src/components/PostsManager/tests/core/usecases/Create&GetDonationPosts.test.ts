import { expect } from 'chai';
import { instance, mock, when } from 'ts-mockito';

import { aPostsManagerFacade } from './base/PostsManagerFacadeFactory';
import { aDonationPostCreationRequest } from './base/CreateDonationRequestFactory';

import { DateTimeService } from '../../../main/core/domain/services/DateTimeService';

import { PostsManagerFacade } from '../../../main/PostsManagerFacade';
import { faker } from '@faker-js/faker';
import { CategoryNotSupportedException } from '../../../main/core/domain/exceptions/CategoryNotSupportedException';

describe('Create & Get Donations Posts', () => {
  const mockDateTimeService = mock<DateTimeService>();

  let postsManagerFacade: PostsManagerFacade;

  beforeEach(() => {
    when(mockDateTimeService.now()).thenReturn(new Date());

    postsManagerFacade = aPostsManagerFacade({
      dateTimeService: instance(mockDateTimeService),
    });
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
    expect(postInfo.createdAt.toISOString()).to.equal(creationTime.toISOString());
  });

  it('as a user, i should be able to get all the donation posts for a specific category', async () => {
    const foodDonation = aDonationPostCreationRequest({ category: 'food' });
    const toysDonation = aDonationPostCreationRequest({ category: 'toys' });

    await postsManagerFacade.createDonationPost(foodDonation);
    await postsManagerFacade.createDonationPost(toysDonation);

    const { donationsPosts: foodDonations } = await postsManagerFacade.getDonationsPosts({
      category: 'food',
    });
    const { donationsPosts: toysDonations } = await postsManagerFacade.getDonationsPosts({
      category: 'toys',
    });

    expect(foodDonations).to.have.lengthOf(1);
    expect(toysDonations).to.have.lengthOf(1);

    expect(foodDonations[0]).to.have.property('publisherId', foodDonation.publisherId);
  });

  it('should not be able to get donations of none existing categories', async () => {
    const SOME_RANDOM_WORD = faker.word.noun();

    await expect(
      postsManagerFacade.getDonationsPosts({ category: SOME_RANDOM_WORD }),
    ).to.be.rejectedWith(CategoryNotSupportedException);
  });

  it('as a user, i should be able to get donations for a specific category, in a specific wilaya', async () => {
    const foodDonationAtWilaya1 = aDonationPostCreationRequest({
      wilayaNumber: 1,
      category: 'food',
    });

    await postsManagerFacade.createDonationPost(foodDonationAtWilaya1);

    const { donationsPosts: donationsAtWilaya1 } = await postsManagerFacade.getDonationsPosts({
      category: 'food',
      wilayaNumber: 1,
    });
    const { donationsPosts: donationsAtAnotherWilaya } = await postsManagerFacade.getDonationsPosts(
      {
        category: 'food',
        wilayaNumber: 2,
      },
    );

    expect(donationsAtWilaya1).to.have.lengthOf(1);
    expect(donationsAtAnotherWilaya).to.have.lengthOf(0);
  });

  it('should get the first 20 donations that satisfy the filters by default', async () => {
    const CATEGORY = 'food';
    const addedDonations = await create30DonationsOfCategory(CATEGORY);

    const { donationsPosts } = await postsManagerFacade.getDonationsPosts({ category: CATEGORY });

    expect(donationsPosts).to.have.lengthOf(20);
    expect(donationsPosts[0]).to.have.property('publisherId', addedDonations[0].publisherId);
    expect(donationsPosts[19]).to.have.property('publisherId', addedDonations[19].publisherId);
  });

  it('should be able to get the donations in any specific page', async () => {
    const CATEGORY = 'food';
    const addedDonations = await create30DonationsOfCategory(CATEGORY);

    const { donationsPosts } = await postsManagerFacade.getDonationsPosts({
      category: CATEGORY,
      page: 2,
    });

    expect(donationsPosts).to.have.lengthOf(10);
    expect(donationsPosts[0]).to.have.property('publisherId', addedDonations[20].publisherId);
    expect(donationsPosts[9]).to.have.property('publisherId', addedDonations[29].publisherId);
  });

  async function create30DonationsOfCategory(CATEGORY: string) {
    const donationsPostsOfSameCategory = Array.from({ length: 30 }).map(() =>
      aDonationPostCreationRequest({ category: CATEGORY }),
    );

    for (const donation of donationsPostsOfSameCategory) {
      await postsManagerFacade.createDonationPost(donation);
    }

    return donationsPostsOfSameCategory;
  }
});
