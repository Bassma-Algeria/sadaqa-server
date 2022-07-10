import { spy } from 'sinon';
import { expect } from 'chai';
import { mock, instance, when, anything } from 'ts-mockito';

import { UsersService } from '../../../main/core/domain/services/UsersService';
import { WilayasService } from '../../../main/core/domain/services/WilayasService';

import { MultiLanguagesException } from '../../../main/core/domain/exceptions/MultiLanguagesException';
import { ShortPostTitleException } from '../../../main/core/domain/exceptions/ShortPostTitleException';
import { InvalidPublisherIdException } from '../../../main/core/domain/exceptions/InvalidPublisherIdException';
import { InvalidWilayaNumberException } from '../../../main/core/domain/exceptions/InvalidWilayaNumberException';
import { CategoryNotSupportedException } from '../../../main/core/domain/exceptions/CategoryNotSupportedException';

import { FakeMediaService } from '../../../main/infra/fake/FakeMediaService';

import { aPostsManagerFacade } from './base/PostsManagerFacadeFactory';
import { FakePostsEventBus } from '../../../main/infra/fake/FakePostsEventBus';
import { aDonationPostCreationRequest } from './base/CreateDonationRequestFactory';

describe('CreateDonationPostUseCase', () => {
  const mockUsersService = mock<UsersService>();
  const mockWilayasService = mock<WilayasService>();
  const mediaService = new FakeMediaService();
  const postsEventBus = new FakePostsEventBus();

  const postsManagerFacade = aPostsManagerFacade({
    usersService: instance(mockUsersService),
    wilayasService: instance(mockWilayasService),
    mediaService,
    postsEventBus,
  });

  beforeEach(() => {
    when(mockUsersService.isExist(anything())).thenResolve(true);
    when(mockWilayasService.isExist(anything())).thenResolve(true);
  });

  it('should not have a title that have less than 3 characters', async () => {
    const INVALID_TITLE = 'kd';
    const postCreationBody = aDonationPostCreationRequest({ title: INVALID_TITLE });

    await expect(postsManagerFacade.createDonationPost(postCreationBody))
      .to.eventually.be.rejectedWith(ShortPostTitleException)
      .which.is.an.instanceOf(MultiLanguagesException);
  });

  it('the wilaya should be valid', async () => {
    when(mockWilayasService.isExist(anything())).thenResolve(false);

    const INVALID_WILAYA_NUMBER = 122;
    const postCreationBody = aDonationPostCreationRequest({ wilayaNumber: INVALID_WILAYA_NUMBER });

    await expect(
      postsManagerFacade.createDonationPost(postCreationBody),
    ).to.eventually.be.rejectedWith(InvalidWilayaNumberException);
  });

  it('the category should be valid', async () => {
    const INVALID_CATEGORY = 'some random words or empty string';

    const postCreationBody = aDonationPostCreationRequest({ category: INVALID_CATEGORY });

    await expect(
      postsManagerFacade.createDonationPost(postCreationBody),
    ).to.eventually.be.rejectedWith(CategoryNotSupportedException);
  });

  it('the publisherId should be a valid id of an existing users', async () => {
    when(mockUsersService.isExist(anything())).thenResolve(false);

    const INVALID_ID = 'some random id';
    const postCreationBody = aDonationPostCreationRequest({ publisherId: INVALID_ID });

    await expect(
      postsManagerFacade.createDonationPost(postCreationBody),
    ).to.eventually.be.rejectedWith(InvalidPublisherIdException);
  });

  it('should upload pictures before saving them', async () => {
    const uploadPicturesSpy = spy(mediaService, 'uploadPictures');

    const postCreationBody = aDonationPostCreationRequest();
    await postsManagerFacade.createDonationPost(postCreationBody);

    expect(uploadPicturesSpy.calledOnce).to.equal(true);
    expect(uploadPicturesSpy.calledWith(postCreationBody.pictures)).to.equal(true);

    uploadPicturesSpy.restore();
  });

  it('the post id should be unique', async () => {
    const { postId: id1 } = await postsManagerFacade.createDonationPost(
      aDonationPostCreationRequest(),
    );
    const { postId: id2 } = await postsManagerFacade.createDonationPost(
      aDonationPostCreationRequest(),
    );
    const { postId: id3 } = await postsManagerFacade.createDonationPost(
      aDonationPostCreationRequest(),
    );

    expect(id1).to.not.equal(id2).to.not.equal(id3);
  });

  it('should publish a donation-post-created event when everything complete correctly', async () => {
    const publishDonationPostCreatedSpy = spy(postsEventBus, 'publishDonationPostCreated');

    await postsManagerFacade.createDonationPost(aDonationPostCreationRequest());

    expect(publishDonationPostCreatedSpy.calledOnce).to.equal(true);
  });
});
