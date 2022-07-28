import { spy } from 'sinon';
import { expect } from 'chai';
import { faker } from '@faker-js/faker';
import { anything, instance, mock, when } from 'ts-mockito';

import { cleanData } from './base/cleanData';
import { aPostsManagerFacade } from '../base/aPostsManagerFacade';
import { aFamilyInNeedPostCreationRequest } from '../base/requests/aFamilyInNeedPostCreationRequest';

import { UsersService } from '../../../../main/core/domain/services/UsersService';
import { WilayasService } from '../../../../main/core/domain/services/WilayasService';

import { InvalidCCPException } from '../../../../main/core/domain/exceptions/InvalidCCPException';
import { ShortPostTitleException } from '../../../../main/core/domain/exceptions/ShortPostTitleException';
import { MultiLanguagesException } from '../../../../main/core/domain/exceptions/MultiLanguagesException';
import { InvalidWilayaNumberException } from '../../../../main/core/domain/exceptions/InvalidWilayaNumberException';
import { InvalidBaridiMobNumberException } from '../../../../main/core/domain/exceptions/InvalidBaridiMobNumberException';
import { NotAuthorizedToPublishThisPostException } from '../../../../main/core/domain/exceptions/NotAuthorizedToPublishThisPostException';

import { EventBus } from '../../../../../_shared_/event-bus/EventBus';

describe('Create Family In Need Post', () => {
  const mockUsersService = mock<UsersService>();
  const mockWilayasService = mock<WilayasService>();

  const postsManager = aPostsManagerFacade({
    usersService: instance(mockUsersService),
    wilayasService: instance(mockWilayasService),
  });

  beforeEach(async () => {
    when(mockUsersService.isExist(anything())).thenResolve(true);
    when(mockUsersService.isActiveAssociation(anything())).thenResolve(true);

    when(mockWilayasService.isExist(anything())).thenResolve(true);

    await cleanData();
  });

  it('given a family in need creation request, the title should have more than 3 characters', async () => {
    await expect(
      postsManager.createFamilyInNeedPost(aFamilyInNeedPostCreationRequest({ title: 'sd' })),
    )
      .to.eventually.be.rejectedWith(ShortPostTitleException)
      .and.to.be.an.instanceOf(MultiLanguagesException);
  });

  it('given a family in need creation request, the wilaya number should be valid', async () => {
    when(mockWilayasService.isExist(anything())).thenResolve(false);

    const INVALID_WILAYA_NUMBER = 1334234;

    await expect(
      postsManager.createFamilyInNeedPost(
        aFamilyInNeedPostCreationRequest({ wilayaNumber: INVALID_WILAYA_NUMBER }),
      ),
    )
      .to.eventually.be.rejectedWith(InvalidWilayaNumberException)
      .and.to.be.an.instanceOf(MultiLanguagesException);
  });

  it('given a family in need creation request, the publisherId should be an id of an active association', async () => {
    when(mockUsersService.isActiveAssociation(anything())).thenResolve(false);

    const NOT_ACTIVE_ASSOCIATION_ID = faker.datatype.uuid();

    await expect(
      postsManager.createFamilyInNeedPost(
        aFamilyInNeedPostCreationRequest({ publisherId: NOT_ACTIVE_ASSOCIATION_ID }),
      ),
    ).to.eventually.be.rejectedWith(NotAuthorizedToPublishThisPostException);
  });

  it('given a family in need creation request, if ccp and ccp key exist, the ccp should be valid', async () => {
    const INVALID_CCP = faker.datatype.number().toString();

    await expect(
      postsManager.createFamilyInNeedPost(aFamilyInNeedPostCreationRequest({ ccp: INVALID_CCP })),
    )
      .to.eventually.be.rejectedWith(InvalidCCPException)
      .and.be.be.an.instanceOf(MultiLanguagesException);
  });

  it('given a family in need creation request, if ccp and ccp key exist, the ccp key should be valid', async () => {
    const INVALID_CCP_KEY = faker.datatype.number({ min: 1000 }).toString();

    await expect(
      postsManager.createFamilyInNeedPost(
        aFamilyInNeedPostCreationRequest({ ccpKey: INVALID_CCP_KEY }),
      ),
    )
      .to.eventually.be.rejectedWith(InvalidCCPException)
      .and.be.be.an.instanceOf(MultiLanguagesException);
  });

  it('given a family in need creation request, if there is a ccp there should be a ccp key', async () => {
    await expect(
      postsManager.createFamilyInNeedPost(aFamilyInNeedPostCreationRequest({ ccpKey: undefined })),
    )
      .to.eventually.be.rejectedWith(InvalidCCPException)
      .and.be.be.an.instanceOf(MultiLanguagesException);
  });

  it('given a family in need creation request, if there is a ccp key there should be a ccp', async () => {
    await expect(
      postsManager.createFamilyInNeedPost(aFamilyInNeedPostCreationRequest({ ccp: undefined })),
    )
      .to.eventually.be.rejectedWith(InvalidCCPException)
      .and.be.be.an.instanceOf(MultiLanguagesException);
  });

  it('given a family in need creation request, should be able to create a post without the ccp and ccp key', async () => {
    await expect(
      postsManager.createFamilyInNeedPost(
        aFamilyInNeedPostCreationRequest({ ccp: undefined, ccpKey: undefined }),
      ),
    ).to.eventually.fulfilled;
  });

  it('given a family in need creation request, baridiMobNumber if exist, should be valid', async () => {
    const INVALID_BARIDI_MOB_NUMBER = '0918283091802938';

    await expect(
      postsManager.createFamilyInNeedPost(
        aFamilyInNeedPostCreationRequest({ baridiMobNumber: INVALID_BARIDI_MOB_NUMBER }),
      ),
    )
      .to.eventually.be.rejectedWith(InvalidBaridiMobNumberException)
      .and.to.be.an.instanceOf(MultiLanguagesException);
  });

  it('given a family in need creation request, should be able to create a post without the baridiMobNumber', async () => {
    await expect(
      postsManager.createFamilyInNeedPost(
        aFamilyInNeedPostCreationRequest({ baridiMobNumber: undefined }),
      ),
    ).to.eventually.fulfilled;
  });

  it('given a family in need creation request, should register the creation time when creating a new family in need post', async () => {
    const { postId } = await postsManager.createFamilyInNeedPost(
      aFamilyInNeedPostCreationRequest(),
    );
    const { createdAt } = await postsManager.getFamilyInNeedPost({ postId });

    const ONE_SECOND = 1000;
    expect(new Date().getTime() - createdAt.getTime()).to.be.lessThan(ONE_SECOND);
  });

  it('given a family in need creation request, should upload the pictures before saving them', async () => {
    const request = aFamilyInNeedPostCreationRequest();
    const { postId } = await postsManager.createFamilyInNeedPost(request);

    const { pictures } = await postsManager.getFamilyInNeedPost({ postId });

    expect(pictures.length).to.equal(request.pictures.length);
  });

  it('given a family in need creation request, should return a unique post id for every request', async () => {
    const { postId: id1 } = await postsManager.createFamilyInNeedPost(
      aFamilyInNeedPostCreationRequest(),
    );
    const { postId: id2 } = await postsManager.createFamilyInNeedPost(
      aFamilyInNeedPostCreationRequest(),
    );
    const { postId: id3 } = await postsManager.createFamilyInNeedPost(
      aFamilyInNeedPostCreationRequest(),
    );

    expect(id1).to.not.equal(id2).and.to.not.equal(id3);
  });

  it('given a family in need creation request,  should publish a new family in need post created event', async () => {
    const mockFun = spy();

    EventBus.getInstance().subscribeTo('FAMILY_IN_NEED_POST_CREATED').by(mockFun);

    const request = aFamilyInNeedPostCreationRequest();
    await postsManager.createFamilyInNeedPost(request);

    expect(mockFun.calledOnce).to.equal(true);
    expect(mockFun.args[0][0]).to.have.property('publisherId', request.publisherId);
    expect(mockFun.args[0][0]).to.have.property('wilayaNumber', request.wilayaNumber);
  });

  it('given a family in need post creation request, when every think is ok, then the status of the post should be ENABLED', async () => {
    const { postId } = await postsManager.createFamilyInNeedPost(
      aFamilyInNeedPostCreationRequest(),
    );

    const { status } = await postsManager.getFamilyInNeedPost({ postId });

    expect(status).to.equal('ENABLED');
  });
});
