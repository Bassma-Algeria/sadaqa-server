import { expect } from 'chai';

import { cleanData } from './base/cleanData';
import { aPostsManagerFacade } from '../base/aPostsManagerFacade';
import { aDonationRequestPostCreationRequest } from './base/aDonationRequestPostCreationRequest';

describe('Get Donation Requests Posts', () => {
  const postsManager = aPostsManagerFacade();

  beforeEach(async () => {
    await cleanData();
  });

  it('as a user, i should be able to get donation requests in a specific wilaya', async () => {
    const foodDonationAtWilaya1 = aDonationRequestPostCreationRequest({
      wilayaNumber: 1,
    });

    await postsManager.createDonationRequestPost(foodDonationAtWilaya1);

    const { donationRequests: donationsAtWilaya1 } = await postsManager.getDonationRequestPosts({
      wilayaNumber: 1,
    });
    const { donationRequests: donationsAtAnotherWilaya } =
      await postsManager.getDonationRequestPosts({
        wilayaNumber: 2,
      });

    expect(donationsAtWilaya1).to.have.lengthOf(1);
    expect(donationsAtAnotherWilaya).to.have.lengthOf(0);
  });

  it('should get all the donation requests page per page 20 one per time, ordered by creation time descending', async () => {
    await create30DonationRequests();

    const { donationRequests } = await postsManager.getDonationRequestPosts();

    expect(donationRequests.length).to.equal(20);
    expect(donationRequests[0].createdAt.getTime())
      .to.be.greaterThan(donationRequests[1].createdAt.getTime())
      .to.be.greaterThan(donationRequests[10].createdAt.getTime());
  });

  it('should get the first 20 donation requests that satisfy the filters by default', async () => {
    const addedDonations = await create30DonationRequests();

    const { donationRequests } = await postsManager.getDonationRequestPosts();

    expect(donationRequests).to.have.lengthOf(20);
    expect(donationRequests[0]).to.have.property('publisherId', addedDonations[29].publisherId);
    expect(donationRequests[19]).to.have.property('publisherId', addedDonations[10].publisherId);
  });

  it('should be able to get the donation requests in any specific page', async () => {
    const addedDonations = await create30DonationRequests();

    const { donationRequests } = await postsManager.getDonationRequestPosts({
      page: 2,
    });

    expect(donationRequests).to.have.lengthOf(10);
    expect(donationRequests[0]).to.have.property('publisherId', addedDonations[9].publisherId);
    expect(donationRequests[9]).to.have.property('publisherId', addedDonations[0].publisherId);
  });

  it('should return the total number of donation requests exist in a specific wilaya', async () => {
    await postsManager.createDonationRequestPost(
      aDonationRequestPostCreationRequest({ wilayaNumber: 3 }),
    );
    await postsManager.createDonationRequestPost(
      aDonationRequestPostCreationRequest({ wilayaNumber: 3 }),
    );
    await postsManager.createDonationRequestPost(
      aDonationRequestPostCreationRequest({ wilayaNumber: 1 }),
    );

    const { total } = await postsManager.getDonationRequestPosts({
      wilayaNumber: 3,
    });

    expect(total).to.equal(2);
  });

  it('should be able to access the current page we are in', async () => {
    await create30DonationRequests();

    const { page } = await postsManager.getDonationRequestPosts({ page: 2 });

    expect(page).to.equal(2);
  });

  it('the page returned should be by default the first one when no page provided', async () => {
    const { page } = await postsManager.getDonationRequestPosts();

    expect(page).to.equal(1);
  });

  it('should know if we reach the end page or not', async () => {
    await create30DonationRequests();

    const { end: isEndFromFirstPage } = await postsManager.getDonationRequestPosts({
      page: 1,
    });
    const { end: isEndFromSecondPage } = await postsManager.getDonationRequestPosts({
      page: 2,
    });

    expect(isEndFromFirstPage).to.equal(false);
    expect(isEndFromSecondPage).to.equal(true);
  });

  const create30DonationRequests = async () => {
    const donationRequestsPost = Array.from({ length: 30 }).map(() =>
      aDonationRequestPostCreationRequest(),
    );

    for (const donationRequest of donationRequestsPost) {
      await postsManager.createDonationRequestPost(donationRequest);
    }

    return donationRequestsPost;
  };
});
