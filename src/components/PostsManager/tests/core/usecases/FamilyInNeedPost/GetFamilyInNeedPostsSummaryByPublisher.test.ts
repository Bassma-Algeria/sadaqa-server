import { expect } from 'chai';
import { faker } from '@faker-js/faker';
import { anything, instance, mock, when } from 'ts-mockito';

import { aFamilyInNeedPostsManager } from '../base/aFamilyInNeedPostsManager';
import { aFamilyInNeedPostCreationRequest } from '../base/requests/aFamilyInNeedPostCreationRequest';

import { UsersService } from '../../../../main/core/domain/services/UsersService';

import { ExceptionMessages } from '../../../../main/core/domain/exceptions/ExceptionMessages';
import { NotFoundException } from '../../../../main/core/domain/exceptions/NotFoundException';

describe('Get Family In Need Posts Summary By Publisher', () => {
    const mockUsersService = mock<UsersService>();

    const postsManager = aFamilyInNeedPostsManager({
        usersService: instance(mockUsersService),
    });

    beforeEach(() => {
        when(mockUsersService.isExist(anything())).thenResolve(true);
        when(mockUsersService.isActiveAssociation(anything())).thenResolve(true);
    });

    it('given a publisher id who did no exist, when trying to get his posts summary, then should fail', async () => {
        when(mockUsersService.isExist(anything())).thenResolve(false);

        const NOT_EXIST = faker.datatype.uuid();

        await expect(postsManager.getSummaryByPublisherId({ publisherId: NOT_EXIST }))
            .to.eventually.be.rejectedWith(ExceptionMessages.USER_NOT_EXIST)
            .and.to.be.an.instanceof(NotFoundException);
    });

    it('given a publisher id who have no posts, when trying to get his posts summary, then should return every thing as 0', async () => {
        const EXIST = faker.datatype.uuid();

        const { total, ENABLED, DISABLED, BLOCKED } = await postsManager.getSummaryByPublisherId({
            publisherId: EXIST,
        });

        expect(total).to.equal(ENABLED).to.equal(DISABLED).to.equal(BLOCKED).to.equal(0);
    });

    it('given a publisher id who have no posts, when trying to get his posts summary, then should return the total of all the posts', async () => {
        const publisherId = faker.datatype.uuid();

        await postsManager.create(aFamilyInNeedPostCreationRequest({ publisherId }));
        await postsManager.create(aFamilyInNeedPostCreationRequest({ publisherId }));

        const { total } = await postsManager.getSummaryByPublisherId({ publisherId });

        expect(total).to.equal(2);
    });

    it('given a publisher id who have no posts, when trying to get his posts summary, then should return the total of enabled posts', async () => {
        const publisherId = faker.datatype.uuid();

        await postsManager.create(aFamilyInNeedPostCreationRequest({ publisherId }));
        await postsManager.create(aFamilyInNeedPostCreationRequest({ publisherId }));

        const { ENABLED } = await postsManager.getSummaryByPublisherId({ publisherId });

        expect(ENABLED).to.equal(2);
    });

    it('given a publisher id who have no posts, when trying to get his posts summary, then should return the total of disabled posts', async () => {
        const publisherId = faker.datatype.uuid();

        await postsManager.create(aFamilyInNeedPostCreationRequest({ publisherId }));
        const { postId } = await postsManager.create(
            aFamilyInNeedPostCreationRequest({ publisherId }),
        );

        await postsManager.toggleEnablingStatus({ postId, userId: publisherId });

        const { DISABLED, ENABLED } = await postsManager.getSummaryByPublisherId({ publisherId });

        expect(ENABLED).to.equal(1);
        expect(DISABLED).to.equal(1);
    });

    it('given a publisher id who have no posts, when trying to get his posts summary, then should return the total of blocked posts', async () => {
        const publisherId = faker.datatype.uuid();

        await postsManager.create(aFamilyInNeedPostCreationRequest({ publisherId }));
        await postsManager.create(aFamilyInNeedPostCreationRequest({ publisherId }));

        const { BLOCKED } = await postsManager.getSummaryByPublisherId({ publisherId });

        expect(BLOCKED).to.equal(0);
    });
});
