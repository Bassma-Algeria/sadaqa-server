import { expect } from 'chai';
import { faker } from '@faker-js/faker';
import { anything, instance, mock, when } from 'ts-mockito';

import { aFamilyInNeedPostsManager } from '../base/aFamilyInNeedPostsManager';
import { aFamilyInNeedPostCreationRequest } from '../base/requests/aFamilyInNeedPostCreationRequest';

import { UsersService } from '../../../../main/core/domain/services/UsersService';
import { WilayasService } from '../../../../main/core/domain/services/WilayasService';

import { ExceptionMessages } from '../../../../main/core/domain/exceptions/ExceptionMessages';
import { AuthorizationException } from '../../../../main/core/domain/exceptions/AuthorizationException';
import { MultiLanguagesValidationException } from '../../../../main/core/domain/exceptions/MultiLanguagesValidationException';

describe('Create Family In Need Post', () => {
    const mockUsersService = mock<UsersService>();
    const mockWilayasService = mock<WilayasService>();

    const postsManager = aFamilyInNeedPostsManager({
        usersService: instance(mockUsersService),
        wilayasService: instance(mockWilayasService),
    });

    beforeEach(async () => {
        when(mockUsersService.isExist(anything())).thenResolve(true);
        when(mockUsersService.isActiveAssociation(anything())).thenResolve(true);

        when(mockWilayasService.isExist(anything())).thenResolve(true);
    });

    it('given a family in need creation request, the title should have more than 3 characters', async () => {
        await expect(postsManager.create(aFamilyInNeedPostCreationRequest({ title: 'sd' })))
            .to.eventually.be.rejectedWith(ExceptionMessages.SHORT_TITLE.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given a family in need creation request, the wilaya number should be valid', async () => {
        when(mockWilayasService.isExist(anything())).thenResolve(false);

        const INVALID_WILAYA_NUMBER = 1334234;

        await expect(
            postsManager.create(
                aFamilyInNeedPostCreationRequest({ wilayaNumber: INVALID_WILAYA_NUMBER }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.INVALID_WILAYA_NUMBER.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given a family in need creation request, the publisherId should be an id of an active association', async () => {
        when(mockUsersService.isActiveAssociation(anything())).thenResolve(false);

        const NOT_ACTIVE_ASSOCIATION_ID = faker.datatype.uuid();

        await expect(
            postsManager.create(
                aFamilyInNeedPostCreationRequest({ publisherId: NOT_ACTIVE_ASSOCIATION_ID }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.NOT_AUTHORIZED_TO_PUBLISH)
            .and.to.be.an.instanceOf(AuthorizationException);
    });

    it('given a family in need creation request, if ccp and ccp key exist, the ccp should be valid', async () => {
        const INVALID_CCP = faker.datatype.number().toString();

        await expect(postsManager.create(aFamilyInNeedPostCreationRequest({ ccp: INVALID_CCP })))
            .to.eventually.be.rejectedWith(ExceptionMessages.INVALID_CCP.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given a family in need creation request, if ccp and ccp key exist, the ccp key should be valid', async () => {
        const INVALID_CCP_KEY = faker.datatype.number({ min: 1000 }).toString();

        await expect(
            postsManager.create(aFamilyInNeedPostCreationRequest({ ccpKey: INVALID_CCP_KEY })),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.INVALID_CCP.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given a family in need creation request, if there is a ccp there should be a ccp key', async () => {
        await expect(postsManager.create(aFamilyInNeedPostCreationRequest({ ccpKey: undefined })))
            .to.eventually.be.rejectedWith(ExceptionMessages.INVALID_CCP.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given a family in need creation request, if there is a ccp key there should be a ccp', async () => {
        await expect(postsManager.create(aFamilyInNeedPostCreationRequest({ ccp: undefined })))
            .to.eventually.be.rejectedWith(ExceptionMessages.INVALID_CCP.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given a family in need creation request, should be able to create a post without the ccp and ccp key', async () => {
        await expect(
            postsManager.create(
                aFamilyInNeedPostCreationRequest({ ccp: undefined, ccpKey: undefined }),
            ),
        ).to.eventually.fulfilled;
    });

    it('given a family in need creation request, baridiMobNumber if exist, should be valid', async () => {
        const INVALID_BARIDI_MOB_NUMBER = '0918283091802938';

        await expect(
            postsManager.create(
                aFamilyInNeedPostCreationRequest({ baridiMobNumber: INVALID_BARIDI_MOB_NUMBER }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.INVALID_BARIDI_MOB_NUMBER.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given a family in need creation request, should be able to create a post without the baridiMobNumber', async () => {
        await expect(
            postsManager.create(aFamilyInNeedPostCreationRequest({ baridiMobNumber: undefined })),
        ).to.eventually.fulfilled;
    });

    it('given a family in need creation request, should register the creation time when creating a new family in need post', async () => {
        const { postId } = await postsManager.create(aFamilyInNeedPostCreationRequest());
        const { createdAt } = await postsManager.getById({ postId });

        const ONE_SECOND = 1000;
        expect(new Date().getTime() - createdAt.getTime()).to.be.lessThan(ONE_SECOND);
    });

    it('given a family in need creation request, should upload the pictures before saving them', async () => {
        const request = aFamilyInNeedPostCreationRequest();
        const { postId } = await postsManager.create(request);

        const { pictures } = await postsManager.getById({ postId });

        expect(pictures.length).to.equal(request.pictures.length);
    });

    it('given a family in need creation request, should return a unique post id for every request', async () => {
        const { postId: id1 } = await postsManager.create(aFamilyInNeedPostCreationRequest());
        const { postId: id2 } = await postsManager.create(aFamilyInNeedPostCreationRequest());
        const { postId: id3 } = await postsManager.create(aFamilyInNeedPostCreationRequest());

        expect(id1).to.not.equal(id2).and.to.not.equal(id3);
    });

    it('given a family in need post creation request, when every think is ok, then the status of the post should be ENABLED', async () => {
        const { postId } = await postsManager.create(aFamilyInNeedPostCreationRequest());

        const { status } = await postsManager.getById({ postId });

        expect(status).to.equal('ENABLED');
    });
});
