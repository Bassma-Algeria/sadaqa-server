import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { cleanData } from './base/cleanData';
import { aPostsManagerFacade } from '../base/aPostsManagerFacade';
import { aDonationPostCreationRequest } from '../base/requests/aDonationPostCreationRequest';

import { CategoryNotSupportedException } from '../../../../main/core/domain/exceptions/CategoryNotSupportedException';

describe('Get Donations Posts', () => {
  const postsManager = aPostsManagerFacade();

  beforeEach(async () => {
    await cleanData();
  });

  it('as a user, i should be able to get all the donation posts for a specific category', async () => {
    const foodDonation = aDonationPostCreationRequest({ category: 'food' });
    const toysDonation = aDonationPostCreationRequest({ category: 'toys' });

    await postsManager.createDonationPost(foodDonation);
    await postsManager.createDonationPost(toysDonation);

    const { donations: foodDonations } = await postsManager.getDonationsPosts({
      category: 'food',
    });
    const { donations: toysDonations } = await postsManager.getDonationsPosts({
      category: 'toys',
    });

    expect(foodDonations).to.have.lengthOf(1);
    expect(toysDonations).to.have.lengthOf(1);

    expect(foodDonations[0]).to.have.property('publisherId', foodDonation.publisherId);
  });

  it('should not be able to get donations of none existing categories', async () => {
    const SOME_RANDOM_WORD = faker.word.noun();

    await expect(postsManager.getDonationsPosts({ category: SOME_RANDOM_WORD })).to.be.rejectedWith(
      CategoryNotSupportedException,
    );
  });

  it('as a user, i should be able to get donations for a specific category, in a specific wilaya', async () => {
    const foodDonationAtWilaya1 = aDonationPostCreationRequest({
      wilayaNumber: 1,
      category: 'food',
    });

    await postsManager.createDonationPost(foodDonationAtWilaya1);

    const { donations: donationsAtWilaya1 } = await postsManager.getDonationsPosts({
      category: 'food',
      wilayaNumber: 1,
    });
    const { donations: donationsAtAnotherWilaya } = await postsManager.getDonationsPosts({
      category: 'food',
      wilayaNumber: 2,
    });

    expect(donationsAtWilaya1).to.have.lengthOf(1);
    expect(donationsAtAnotherWilaya).to.have.lengthOf(0);
  });

  it('should get all the donations of a specific category page per page 20 one per time, ordered by creation time descending', async () => {
    await create30DonationsOfCategory('food');

    const { donations } = await postsManager.getDonationsPosts({ category: 'food' });

    expect(donations.length).to.equal(20);
    expect(donations[0].createdAt.getTime())
      .to.be.greaterThan(donations[1].createdAt.getTime())
      .to.be.greaterThan(donations[10].createdAt.getTime());
  });

  it('should get the first 20 donations that satisfy the filters by default', async () => {
    const CATEGORY = 'food';
    const addedDonations = await create30DonationsOfCategory(CATEGORY);

    const { donations } = await postsManager.getDonationsPosts({ category: CATEGORY });

    expect(donations).to.have.lengthOf(20);
    expect(donations[0]).to.have.property('publisherId', addedDonations[29].publisherId);
    expect(donations[19]).to.have.property('publisherId', addedDonations[10].publisherId);
  });

  it('should be able to get the donations in any specific page', async () => {
    const CATEGORY = 'food';
    const addedDonations = await create30DonationsOfCategory(CATEGORY);

    const { donations } = await postsManager.getDonationsPosts({
      category: CATEGORY,
      page: 2,
    });

    expect(donations).to.have.lengthOf(10);
    expect(donations[0]).to.have.property('publisherId', addedDonations[9].publisherId);
    expect(donations[9]).to.have.property('publisherId', addedDonations[0].publisherId);
  });

  it('should return the total number of donations existing in a specific category', async () => {
    await postsManager.createDonationPost(aDonationPostCreationRequest({ category: 'food' }));

    const { total } = await postsManager.getDonationsPosts({ category: 'food' });

    expect(total).to.equal(1);
  });

  it('should return the total number of donations exist in a specific wilaya in a specific category', async () => {
    await postsManager.createDonationPost(
      aDonationPostCreationRequest({ wilayaNumber: 3, category: 'food' }),
    );
    await postsManager.createDonationPost(
      aDonationPostCreationRequest({ wilayaNumber: 3, category: 'food' }),
    );
    await postsManager.createDonationPost(
      aDonationPostCreationRequest({ wilayaNumber: 1, category: 'food' }),
    );

    const { total } = await postsManager.getDonationsPosts({
      wilayaNumber: 3,
      category: 'food',
    });

    expect(total).to.equal(2);
  });

  it('should be able to access the current page we are in', async () => {
    await create30DonationsOfCategory('food');

    const { page } = await postsManager.getDonationsPosts({ category: 'food', page: 2 });

    expect(page).to.equal(2);
  });

  it('the page returned should be by default the first one when no page provided', async () => {
    const { page } = await postsManager.getDonationsPosts({ category: 'food' });

    expect(page).to.equal(1);
  });

  it('should know if we reach the end page or not', async () => {
    await create30DonationsOfCategory('food');

    const { end: isEndFromFirstPage } = await postsManager.getDonationsPosts({
      category: 'food',
      page: 1,
    });
    const { end: isEndFromSecondPage } = await postsManager.getDonationsPosts({
      category: 'food',
      page: 2,
    });

    expect(isEndFromFirstPage).to.equal(false);
    expect(isEndFromSecondPage).to.equal(true);
  });

  const create30DonationsOfCategory = async (CATEGORY: string) => {
    const donationsPostsOfSameCategory = Array.from({ length: 30 }).map(() =>
      aDonationPostCreationRequest({ category: CATEGORY }),
    );

    for (const donation of donationsPostsOfSameCategory) {
      await postsManager.createDonationPost(donation);
    }

    return donationsPostsOfSameCategory;
  };
});
