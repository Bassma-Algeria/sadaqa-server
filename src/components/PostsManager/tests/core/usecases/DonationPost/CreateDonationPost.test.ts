import { spy } from 'sinon';
import { expect } from 'chai';
import { anything, instance, mock, when } from 'ts-mockito';

import { aDonationPostsManager } from '../base/aDonationPostsManager';
import { aDonationPostCreationRequest } from '../base/requests/aDonationPostCreationRequest';

import { UsersService } from '../../../../main/core/domain/services/UsersService';
import { WilayasService } from '../../../../main/core/domain/services/WilayasService';

import { ExceptionsMessages } from '../../../../main/core/domain/exceptions/ExceptionsMessages';
import { AuthorizationException } from '../../../../main/core/domain/exceptions/AuthorizationException';
import { MultiLanguagesValidationException } from '../../../../main/core/domain/exceptions/MultiLanguagesValidationException';

import { EventBus } from '../../../../../_shared_/event-bus/EventBus';

describe('Create Donation Post', () => {
    const mockUsersService = mock<UsersService>();
    const mockWilayasService = mock<WilayasService>();

    const donationPostsManager = aDonationPostsManager({
        usersService: instance(mockUsersService),
        wilayasService: instance(mockWilayasService),
    });

    beforeEach(async () => {
        when(mockUsersService.isExist(anything())).thenResolve(true);
        when(mockWilayasService.isExist(anything())).thenResolve(true);
    });

    it('should not have a title that have less than 3 characters', async () => {
        const INVALID_TITLE = 'kd';
        const postCreationBody = aDonationPostCreationRequest({ title: INVALID_TITLE });

        await expect(donationPostsManager.create(postCreationBody))
            .to.eventually.be.rejectedWith(ExceptionsMessages.SHORT_TITLE.en)
            .which.is.an.instanceOf(MultiLanguagesValidationException);
    });

    it('the wilaya should be valid', async () => {
        when(mockWilayasService.isExist(anything())).thenResolve(false);

        const INVALID_WILAYA_NUMBER = 122;
        const postCreationBody = aDonationPostCreationRequest({
            wilayaNumber: INVALID_WILAYA_NUMBER,
        });

        await expect(donationPostsManager.create(postCreationBody))
            .to.eventually.be.rejectedWith(ExceptionsMessages.INVALID_WILAYA_NUMBER.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('the category should be valid', async () => {
        const INVALID_CATEGORY = 'some random words or empty string';

        const postCreationBody = aDonationPostCreationRequest({ category: INVALID_CATEGORY });

        await expect(donationPostsManager.create(postCreationBody))
            .to.eventually.be.rejectedWith(ExceptionsMessages.INVALID_CATEGORY.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('the publisherId should be a valid id of an existing users', async () => {
        when(mockUsersService.isExist(anything())).thenResolve(false);

        const INVALID_ID = 'some random id';
        const postCreationBody = aDonationPostCreationRequest({ publisherId: INVALID_ID });

        await expect(donationPostsManager.create(postCreationBody))
            .to.eventually.be.rejectedWith(ExceptionsMessages.NOT_AUTHORIZED_TO_PUBLISH)
            .and.to.be.an.instanceOf(AuthorizationException);
    });

    it('should register the creation time when creating a new donation post', async () => {
        const { postId } = await donationPostsManager.create(aDonationPostCreationRequest());
        const { createdAt } = await donationPostsManager.getById({ postId });

        const ONE_SECOND = 1000;
        expect(new Date().getTime() - createdAt.getTime()).to.be.lessThan(ONE_SECOND);
    });

    it('should upload pictures before saving them', async () => {
        const postCreationBody = aDonationPostCreationRequest();
        const { postId } = await donationPostsManager.create(postCreationBody);

        const { pictures } = await donationPostsManager.getById({ postId });

        expect(pictures.length).to.equal(postCreationBody.pictures.length);
    });

    it('the post id should be unique', async () => {
        const { postId: id1 } = await donationPostsManager.create(aDonationPostCreationRequest());
        const { postId: id2 } = await donationPostsManager.create(aDonationPostCreationRequest());
        const { postId: id3 } = await donationPostsManager.create(aDonationPostCreationRequest());

        expect(id1).to.not.equal(id2).to.not.equal(id3);
    });

    it('should publish a NEW_DONATION_POST_CREATED event when everything complete correctly', async () => {
        const mockFunction = spy();
        EventBus.getInstance().subscribeTo('DONATION_POST_CREATED').by(mockFunction);

        const donationPost = aDonationPostCreationRequest();
        await donationPostsManager.create(donationPost);

        expect(mockFunction.calledOnce).to.equal(true);
        expect(mockFunction.args[0][0]).to.have.property('category', donationPost.category);
        expect(mockFunction.args[0][0]).to.have.property('publisherId', donationPost.publisherId);
    });

    it('given a donation post creation request, when every think is ok, then the status of the post should be ENABLED', async () => {
        const { postId } = await donationPostsManager.create(aDonationPostCreationRequest());

        const { status } = await donationPostsManager.getById({ postId });

        expect(status).to.equal('ENABLED');
    });
});
