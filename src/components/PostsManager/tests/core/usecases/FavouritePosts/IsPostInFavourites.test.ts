import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { aDonationPostsManager } from '../base/aDonationPostsManager';
import { aFavouritePostsManager } from '../base/aFavouritePostsManager';
import { aCallForHelpPostsManager } from '../base/aCallForHelpPostsManager';
import { aFamilyInNeedPostsManager } from '../base/aFamilyInNeedPostsManager';
import { aDonationRequestPostsManager } from '../base/aDonationRequestPostsManager';
import { anIsPostInFavouriteRequest } from '../base/requests/anIsPostInFavouriteRequest';
import { aDonationPostCreationRequest } from '../base/requests/aDonationPostCreationRequest';
import { aCallForHelpPostCreationRequest } from '../base/requests/aCallForHelpPostCreationRequest';
import { aFamilyInNeedPostCreationRequest } from '../base/requests/aFamilyInNeedPostCreationRequest';

import { ExceptionMessages } from '../../../../main/core/domain/exceptions/ExceptionMessages';
import { ValidationException } from '../../../../main/core/domain/exceptions/ValidationException';

describe('Is Post In Favourites', () => {
    const favouritePostsManager = aFavouritePostsManager();

    const donationPostsManager = aDonationPostsManager();
    const callForHelpPostsManager = aCallForHelpPostsManager();
    const familyInNeedPostsManager = aFamilyInNeedPostsManager();
    const donationRequestPostsManager = aDonationRequestPostsManager();

    it('given an is post in favourite request, when the post type does not exist, then should fail', async () => {
        const SOME_RANDOM = faker.datatype.string(8);
        await expect(
            favouritePostsManager.isPostInFavourite(
                anIsPostInFavouriteRequest({ postType: SOME_RANDOM }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.INVALID_POST_TYPE)
            .and.to.be.an.instanceof(ValidationException);
    });

    it('given a donation post in favourite request, when the donation post is not in favourites, then should return false', async () => {
        const userId = faker.datatype.uuid();

        const { postId } = await donationPostsManager.create(aDonationPostCreationRequest());

        const { isFavourite } = await favouritePostsManager.isPostInFavourite(
            anIsPostInFavouriteRequest({ postId, userId, postType: 'donation' }),
        );

        expect(isFavourite).to.equal(false);
    });

    it('given a donation post in favourite request, when the donation post is in favourites, then should return true', async () => {
        const userId = faker.datatype.uuid();

        const { postId } = await donationPostsManager.create(aDonationPostCreationRequest());

        await favouritePostsManager.addToFavourite({ postId, userId, postType: 'donation' });

        const { isFavourite } = await favouritePostsManager.isPostInFavourite(
            anIsPostInFavouriteRequest({ postId, userId, postType: 'donation' }),
        );

        expect(isFavourite).to.equal(true);
    });

    it('given a donation request post in favourite request, when the donation request post is not in favourites, then should return false', async () => {
        const userId = faker.datatype.uuid();

        const { postId } = await donationRequestPostsManager.create(aDonationPostCreationRequest());

        const { isFavourite } = await favouritePostsManager.isPostInFavourite(
            anIsPostInFavouriteRequest({ postId, userId, postType: 'donation-request' }),
        );

        expect(isFavourite).to.equal(false);
    });

    it('given a donation request post in favourite request, when the donation request post is in favourites, then should return true', async () => {
        const userId = faker.datatype.uuid();

        const { postId } = await donationRequestPostsManager.create(aDonationPostCreationRequest());

        await favouritePostsManager.addToFavourite({
            postId,
            userId,
            postType: 'donation-request',
        });

        const { isFavourite } = await favouritePostsManager.isPostInFavourite(
            anIsPostInFavouriteRequest({ postId, userId, postType: 'donation-request' }),
        );

        expect(isFavourite).to.equal(true);
    });

    it('given a family in need post in favourite request, when the family in need post is not in favourites, then should return false', async () => {
        const userId = faker.datatype.uuid();

        const { postId } = await familyInNeedPostsManager.create(
            aFamilyInNeedPostCreationRequest(),
        );

        const { isFavourite } = await favouritePostsManager.isPostInFavourite(
            anIsPostInFavouriteRequest({ postId, userId, postType: 'family-in-need' }),
        );

        expect(isFavourite).to.equal(false);
    });

    it('given a family in need post in favourite request, when the family in need post is in favourites, then should return true', async () => {
        const userId = faker.datatype.uuid();

        const { postId } = await familyInNeedPostsManager.create(
            aFamilyInNeedPostCreationRequest(),
        );

        await favouritePostsManager.addToFavourite({
            postId,
            userId,
            postType: 'family-in-need',
        });

        const { isFavourite } = await favouritePostsManager.isPostInFavourite(
            anIsPostInFavouriteRequest({ postId, userId, postType: 'family-in-need' }),
        );

        expect(isFavourite).to.equal(true);
    });

    it('given a call for help post in favourite request, when the call for help post is not in favourites, then should return false', async () => {
        const userId = faker.datatype.uuid();

        const { postId } = await callForHelpPostsManager.create(aCallForHelpPostCreationRequest());

        const { isFavourite } = await favouritePostsManager.isPostInFavourite(
            anIsPostInFavouriteRequest({ postId, userId, postType: 'call-for-help' }),
        );

        expect(isFavourite).to.equal(false);
    });

    it('given a call for help post in favourite request, when the call for help post is in favourites, then should return true', async () => {
        const userId = faker.datatype.uuid();

        const { postId } = await callForHelpPostsManager.create(aCallForHelpPostCreationRequest());

        await favouritePostsManager.addToFavourite({
            postId,
            userId,
            postType: 'call-for-help',
        });

        const { isFavourite } = await favouritePostsManager.isPostInFavourite(
            anIsPostInFavouriteRequest({ postId, userId, postType: 'call-for-help' }),
        );

        expect(isFavourite).to.equal(true);
    });
});