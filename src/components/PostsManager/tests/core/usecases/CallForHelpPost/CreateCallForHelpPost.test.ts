import { spy } from 'sinon';
import { expect } from 'chai';
import { faker } from '@faker-js/faker';
import { anything, instance, mock, when } from 'ts-mockito';

import { aCallForHelpPostsManager } from '../base/aCallForHelpPostsManager';
import { aCallForHelpPostCreationRequest } from '../base/requests/aCallForHelpPostCreationRequest';

import { UsersService } from '../../../../main/core/domain/services/UsersService';
import { WilayasService } from '../../../../main/core/domain/services/WilayasService';

import { ExceptionMessages } from '../../../../main/core/domain/exceptions/ExceptionMessages';
import { AuthorizationException } from '../../../../main/core/domain/exceptions/AuthorizationException';
import { MultiLanguagesValidationException } from '../../../../main/core/domain/exceptions/MultiLanguagesValidationException';

import { EventBus } from '../../../../../_shared_/event-bus/EventBus';

describe('Create Call For Help Post', () => {
    const mockUsersService = mock<UsersService>();
    const mockWilayasService = mock<WilayasService>();

    const callForHelpPostsManager = aCallForHelpPostsManager({
        usersService: instance(mockUsersService),
        wilayasService: instance(mockWilayasService),
    });

    beforeEach(() => {
        when(mockUsersService.isExist(anything())).thenResolve(true);
        when(mockUsersService.isActiveAssociation(anything())).thenResolve(true);

        when(mockWilayasService.isExist(anything())).thenResolve(true);
    });

    it('given a call for help creation request, the title should have more than 3 characters', async () => {
        await expect(
            callForHelpPostsManager.create(aCallForHelpPostCreationRequest({ title: 'sd' })),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.SHORT_TITLE.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given a call for help creation request, the wilaya number should be valid', async () => {
        when(mockWilayasService.isExist(anything())).thenResolve(false);

        const INVALID_WILAYA_NUMBER = 1334234;

        await expect(
            callForHelpPostsManager.create(
                aCallForHelpPostCreationRequest({ wilayaNumber: INVALID_WILAYA_NUMBER }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.INVALID_WILAYA_NUMBER.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given a call for help creation request, the publisherId should be an id of an active association', async () => {
        when(mockUsersService.isActiveAssociation(anything())).thenResolve(false);

        const NOT_ACTIVE_ASSOCIATION_ID = faker.datatype.uuid();

        await expect(
            callForHelpPostsManager.create(
                aCallForHelpPostCreationRequest({ publisherId: NOT_ACTIVE_ASSOCIATION_ID }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.NOT_AUTHORIZED_TO_PUBLISH)
            .and.to.be.an.instanceOf(AuthorizationException);
    });

    it('given a call for help creation request,  if ccp and ccp key exist, the ccp should be valid', async () => {
        const INVALID_CCP = faker.datatype.number().toString();

        await expect(
            callForHelpPostsManager.create(aCallForHelpPostCreationRequest({ ccp: INVALID_CCP })),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.INVALID_CCP.en)
            .and.be.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given a call for help creation request,  if ccp and ccp key exist, the ccp key should be valid', async () => {
        const INVALID_CCP_KEY = faker.datatype.number({ min: 1000 }).toString();

        await expect(
            callForHelpPostsManager.create(
                aCallForHelpPostCreationRequest({ ccpKey: INVALID_CCP_KEY }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.INVALID_CCP.en)
            .and.be.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given a call for help creation request,  should be able to create a post without the ccp and ccp key', async () => {
        await expect(
            callForHelpPostsManager.create(
                aCallForHelpPostCreationRequest({ ccp: undefined, ccpKey: undefined }),
            ),
        ).to.eventually.fulfilled;
    });

    it('given a call for help creation request, baridiMobNumber if exist, should be valid', async () => {
        const INVALID_BARIDI_MOB_NUMBER = '0918283091802938';

        await expect(
            callForHelpPostsManager.create(
                aCallForHelpPostCreationRequest({ baridiMobNumber: INVALID_BARIDI_MOB_NUMBER }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.INVALID_BARIDI_MOB_NUMBER.en)
            .and.be.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given a call for help creation request, should be able to create a post without the baridiMobNumber', async () => {
        await expect(
            callForHelpPostsManager.create(
                aCallForHelpPostCreationRequest({ baridiMobNumber: undefined }),
            ),
        ).to.eventually.fulfilled;
    });

    it('given a call for help creation request, should register the creation time when creating a new call for help post', async () => {
        const { postId } = await callForHelpPostsManager.create(aCallForHelpPostCreationRequest());
        const { createdAt } = await callForHelpPostsManager.getById({ postId });

        const ONE_SECOND = 1000;
        expect(new Date().getTime() - createdAt.getTime()).to.be.lessThan(ONE_SECOND);
    });

    it('given a call for help creation request, should upload the pictures before saving them', async () => {
        const request = aCallForHelpPostCreationRequest();
        const { postId } = await callForHelpPostsManager.create(request);

        const { pictures } = await callForHelpPostsManager.getById({ postId });

        expect(pictures.length).to.equal(request.pictures.length);
    });

    it('given a call for help creation request, should return a unique post id for every request', async () => {
        const { postId: id1 } = await callForHelpPostsManager.create(
            aCallForHelpPostCreationRequest(),
        );
        const { postId: id2 } = await callForHelpPostsManager.create(
            aCallForHelpPostCreationRequest(),
        );
        const { postId: id3 } = await callForHelpPostsManager.create(
            aCallForHelpPostCreationRequest(),
        );

        expect(id1).to.not.equal(id2).and.to.not.equal(id3);
    });

    it('given a call for help creation request, should publish a new call for help post created event', async () => {
        const mockFun = spy();

        EventBus.getInstance().subscribeTo('CALL_FOR_HELP_POST_CREATED').by(mockFun);

        const request = aCallForHelpPostCreationRequest();
        await callForHelpPostsManager.create(request);

        expect(mockFun.calledOnce).to.equal(true);
        expect(mockFun.args[0][0]).to.have.property('publisherId', request.publisherId);
        expect(mockFun.args[0][0]).to.have.property('wilayaNumber', request.wilayaNumber);
    });

    it('given a call for help creation request, when every think is ok, then the status of the post should be ENABLED', async () => {
        const { postId } = await callForHelpPostsManager.create(aCallForHelpPostCreationRequest());

        const { status } = await callForHelpPostsManager.getById({ postId });

        expect(status).to.equal('ENABLED');
    });
});
