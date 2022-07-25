import { spy } from 'sinon';
import { expect } from 'chai';
import { anything, instance, mock, when } from 'ts-mockito';

import { UsersService } from '../../../../main/core/domain/services/UsersService';
import { WilayasService } from '../../../../main/core/domain/services/WilayasService';

import { UserNotExistException } from '../../../../main/core/domain/exceptions/UserNotExistException';
import { MultiLanguagesException } from '../../../../main/core/domain/exceptions/MultiLanguagesException';
import { ShortPostTitleException } from '../../../../main/core/domain/exceptions/ShortPostTitleException';
import { InvalidWilayaNumberException } from '../../../../main/core/domain/exceptions/InvalidWilayaNumberException';
import { CategoryNotSupportedException } from '../../../../main/core/domain/exceptions/CategoryNotSupportedException';

import { cleanData } from './base/cleanData';
import { aPostsManagerFacade } from '../base/aPostsManagerFacade';
import { aDonationPostCreationRequest } from './base/aDonationPostCreationRequest';

import { EventBus } from '../../../../../_shared_/event-bus/EventBus';

describe('Create Donation Post', () => {
  const mockUsersService = mock<UsersService>();
  const mockWilayasService = mock<WilayasService>();

  const postsManager = aPostsManagerFacade({
    usersService: instance(mockUsersService),
    wilayasService: instance(mockWilayasService),
  });

  beforeEach(async () => {
    when(mockUsersService.isExist(anything())).thenResolve(true);
    when(mockWilayasService.isExist(anything())).thenResolve(true);

    await cleanData();
  });

  it('should not have a title that have less than 3 characters', async () => {
    const INVALID_TITLE = 'kd';
    const postCreationBody = aDonationPostCreationRequest({ title: INVALID_TITLE });

    await expect(postsManager.createDonationPost(postCreationBody))
      .to.eventually.be.rejectedWith(ShortPostTitleException)
      .which.is.an.instanceOf(MultiLanguagesException);
  });

  it('the wilaya should be valid', async () => {
    when(mockWilayasService.isExist(anything())).thenResolve(false);

    const INVALID_WILAYA_NUMBER = 122;
    const postCreationBody = aDonationPostCreationRequest({ wilayaNumber: INVALID_WILAYA_NUMBER });

    await expect(postsManager.createDonationPost(postCreationBody)).to.eventually.be.rejectedWith(
      InvalidWilayaNumberException,
    );
  });

  it('the category should be valid', async () => {
    const INVALID_CATEGORY = 'some random words or empty string';

    const postCreationBody = aDonationPostCreationRequest({ category: INVALID_CATEGORY });

    await expect(postsManager.createDonationPost(postCreationBody)).to.eventually.be.rejectedWith(
      CategoryNotSupportedException,
    );
  });

  it('the publisherId should be a valid id of an existing users', async () => {
    when(mockUsersService.isExist(anything())).thenResolve(false);

    const INVALID_ID = 'some random id';
    const postCreationBody = aDonationPostCreationRequest({ publisherId: INVALID_ID });

    await expect(postsManager.createDonationPost(postCreationBody)).to.eventually.be.rejectedWith(
      UserNotExistException,
    );
  });

  it('should register the creation time when creating a new donation post', async () => {
    const { postId } = await postsManager.createDonationPost(aDonationPostCreationRequest());
    const { createdAt } = await postsManager.getDonationPost({ postId });

    const ONE_SECOND = 1000;
    expect(new Date().getTime() - createdAt.getTime()).to.be.lessThan(ONE_SECOND);
  });

  it('should upload pictures before saving them', async () => {
    const postCreationBody = aDonationPostCreationRequest();
    const { postId } = await postsManager.createDonationPost(postCreationBody);

    const { pictures } = await postsManager.getDonationPost({ postId });

    expect(pictures.length).to.equal(postCreationBody.pictures.length);
  });

  it('the post id should be unique', async () => {
    const { postId: id1 } = await postsManager.createDonationPost(aDonationPostCreationRequest());
    const { postId: id2 } = await postsManager.createDonationPost(aDonationPostCreationRequest());
    const { postId: id3 } = await postsManager.createDonationPost(aDonationPostCreationRequest());

    expect(id1).to.not.equal(id2).to.not.equal(id3);
  });

  it('should publish a NEW_DONATION_POST_CREATED event when everything complete correctly', async () => {
    const mockFunction = spy();
    EventBus.getInstance().subscribeTo('DONATION_POST_CREATED').by(mockFunction);

    const donationPost = aDonationPostCreationRequest();
    await postsManager.createDonationPost(donationPost);

    expect(mockFunction.calledOnce).to.equal(true);
    expect(mockFunction.args[0][0]).to.have.property('category', donationPost.category);
    expect(mockFunction.args[0][0]).to.have.property('publisherId', donationPost.publisherId);
  });
});
