import { expect } from 'chai';
import { faker } from '@faker-js/faker';
import { anything, instance, mock, when } from 'ts-mockito';

import { aCallForHelpPostsManager } from '../base/aCallForHelpPostsManager';
import { aGeneralPostOperationsManager } from '../base/aGeneralPostOperationsManager';

import { aSharePostRequest } from '../base/requests/aSharePostRequest';
import { aCallForHelpPostCreationRequest } from '../base/requests/aCallForHelpPostCreationRequest';

import { UsersService } from '../../../../main/core/domain/services/UsersService';

import { ExceptionMessages } from '../../../../main/core/domain/exceptions/ExceptionMessages';
import { NotFoundException } from '../../../../main/core/domain/exceptions/NotFoundException';

describe('Share Call For Help Post', () => {
    const mockUsersService = mock<UsersService>();
    const generalPostOperationsManager = aGeneralPostOperationsManager();
    const callForHelpPostsManager = aCallForHelpPostsManager({
        usersService: instance(mockUsersService),
    });

    beforeEach(() => {
        when(mockUsersService.isExist(anything())).thenResolve(true);
        when(mockUsersService.isActiveAssociation(anything())).thenResolve(true);
    });

    it("given a share call for help post request, when the post doesn't exist, then should fail", async () => {
        const NOT_EXIST = faker.datatype.uuid();

        await expect(callForHelpPostsManager.share(aSharePostRequest({ postId: NOT_EXIST })))
            .to.eventually.be.rejectedWith(ExceptionMessages.POST_NOT_FOUND)
            .instanceOf(NotFoundException);
    });

    it('given a share call for help post request, when the post exist and no userId sent, then should register the share with a null userId', async () => {
        const { postId } = await callForHelpPostsManager.create(aCallForHelpPostCreationRequest());

        await callForHelpPostsManager.share(aSharePostRequest({ postId, userId: undefined }));

        const { list } = await generalPostOperationsManager.getShares();

        expect(list[0].userId).to.equal(null);
        expect(list[0].postId).to.equal(postId);
        expect(list[0].postType).to.equal('call-for-help');
    });

    it('given a share call for help post request, when sharing the post, then should register the share creation time', async () => {
        const { postId } = await callForHelpPostsManager.create(aCallForHelpPostCreationRequest());

        await callForHelpPostsManager.share(aSharePostRequest({ postId }));

        const { list } = await generalPostOperationsManager.getShares();

        const ONE_SECOND = 1000;
        const now = new Date();
        expect(now.getTime() - list[0].createdAt.getTime()).to.be.lessThan(ONE_SECOND);
    });

    it('given a share call for help post request, when there is a userId, then the user should exist', async () => {
        const { postId } = await callForHelpPostsManager.create(aCallForHelpPostCreationRequest());

        when(mockUsersService.isExist(anything())).thenResolve(false);

        await expect(callForHelpPostsManager.share(aSharePostRequest({ postId })))
            .to.eventually.be.rejectedWith(ExceptionMessages.USER_NOT_FOUND)
            .instanceOf(NotFoundException);
    });

    it('given a share call for help post request, when there is a valid userId, then the should regiter it', async () => {
        const { postId } = await callForHelpPostsManager.create(aCallForHelpPostCreationRequest());

        const request = aSharePostRequest({ postId });
        await callForHelpPostsManager.share(request);

        const { list } = await generalPostOperationsManager.getShares();

        expect(list[0].userId).to.deep.equal(request.userId);
    });
});
