import { expect } from 'chai';

import { cleanData } from './base/cleanData';
import { aDonationRequestPostCreationRequest } from '../base/requests/aDonationRequestPostCreationRequest';
import { aDonationRequestPostsManager } from '../base/aDonationRequestPostsManager';
import { faker } from '@faker-js/faker';
import { ExceptionsMessages } from '../../../../main/core/domain/exceptions/ExceptionsMessages';
import { MultiLanguagesValidationException } from '../../../../main/core/domain/exceptions/MultiLanguagesValidationException';

describe('Get Donation Requests Posts', () => {
    const postsManager = aDonationRequestPostsManager();

    beforeEach(async () => {
        await cleanData();
    });

    it('as a user, i should be able to get all the donation posts for a specific category', async () => {
        const foodDonation = aDonationRequestPostCreationRequest({ category: 'food' });
        const toysDonation = aDonationRequestPostCreationRequest({ category: 'toys' });

        await postsManager.create(foodDonation);
        await postsManager.create(toysDonation);

        const { list: foodDonations } = await postsManager.getList({
            category: 'food',
        });
        const { list: toysDonations } = await postsManager.getList({
            category: 'toys',
        });

        expect(foodDonations).to.have.lengthOf(1);
        expect(toysDonations).to.have.lengthOf(1);

        expect(foodDonations[0]).to.have.property('publisherId', foodDonation.publisherId);
    });

    it('should not be able to get donations requests of none existing categories', async () => {
        const SOME_RANDOM_WORD = faker.word.noun();

        await expect(postsManager.getList({ category: SOME_RANDOM_WORD }))
            .to.eventually.be.rejectedWith(ExceptionsMessages.INVALID_CATEGORY.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('as a user, i should be able to get all the donations requests of all the categories', async () => {
        await postsManager.create(aDonationRequestPostCreationRequest({ category: 'food' }));
        await postsManager.create(aDonationRequestPostCreationRequest({ category: 'toys' }));

        const { list } = await postsManager.getList();

        expect(list).to.have.lengthOf(2);
    });

    it('as a user, i should be able to get donations requests for a specific category, in a specific wilaya', async () => {
        const foodDonationAtWilaya1 = aDonationRequestPostCreationRequest({
            wilayaNumber: 1,
            category: 'food',
        });

        await postsManager.create(foodDonationAtWilaya1);

        const { list: donationsAtWilaya1 } = await postsManager.getList({
            category: 'food',
            wilayaNumber: 1,
        });
        const { list: donationsAtAnotherWilaya } = await postsManager.getList({
            category: 'food',
            wilayaNumber: 2,
        });

        expect(donationsAtWilaya1).to.have.lengthOf(1);
        expect(donationsAtAnotherWilaya).to.have.lengthOf(0);
    });

    it('should get all the donation requests page per page 20 one per time, ordered by creation time descending', async () => {
        await create30DonationRequests();

        const { list } = await postsManager.getList();

        expect(list.length).to.equal(20);
        expect(list[0].createdAt.getTime())
            .to.be.greaterThan(list[1].createdAt.getTime())
            .to.be.greaterThan(list[10].createdAt.getTime());
    });

    it('should get the first 20 donation requests that satisfy the filters by default', async () => {
        const addedDonations = await create30DonationRequests();

        const { list } = await postsManager.getList();

        expect(list).to.have.lengthOf(20);
        expect(list[0]).to.have.property('publisherId', addedDonations[29].publisherId);
        expect(list[19]).to.have.property('publisherId', addedDonations[10].publisherId);
    });

    it('should be able to get the donation requests in any specific page', async () => {
        const addedDonations = await create30DonationRequests();

        const { list } = await postsManager.getList({
            page: 2,
        });

        expect(list).to.have.lengthOf(10);
        expect(list[0]).to.have.property('publisherId', addedDonations[9].publisherId);
        expect(list[9]).to.have.property('publisherId', addedDonations[0].publisherId);
    });

    it('should return the total number of donation requests exist in a specific wilaya', async () => {
        await postsManager.create(aDonationRequestPostCreationRequest({ wilayaNumber: 3 }));
        await postsManager.create(aDonationRequestPostCreationRequest({ wilayaNumber: 3 }));
        await postsManager.create(aDonationRequestPostCreationRequest({ wilayaNumber: 1 }));

        const { total } = await postsManager.getList({ wilayaNumber: 3 });

        expect(total).to.equal(2);
    });

    it('should be able to access the current page we are in', async () => {
        await create30DonationRequests();

        const { page } = await postsManager.getList({ page: 2 });

        expect(page).to.equal(2);
    });

    it('the page returned should be by default the first one when no page provided', async () => {
        const { page } = await postsManager.getList();

        expect(page).to.equal(1);
    });

    it('should know if we reach the end page or not', async () => {
        await create30DonationRequests();

        const { end: isEndFromFirstPage } = await postsManager.getList({ page: 1 });
        const { end: isEndFromSecondPage } = await postsManager.getList({ page: 2 });

        expect(isEndFromFirstPage).to.equal(false);
        expect(isEndFromSecondPage).to.equal(true);
    });

    const create30DonationRequests = async () => {
        const donationRequestsPost = Array.from({ length: 30 }).map(() =>
            aDonationRequestPostCreationRequest(),
        );

        for (const donationRequest of donationRequestsPost) {
            await postsManager.create(donationRequest);
        }

        return donationRequestsPost;
    };
});
