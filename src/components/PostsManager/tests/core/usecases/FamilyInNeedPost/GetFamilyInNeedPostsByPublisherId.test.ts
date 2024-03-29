import { expect } from 'chai';
import { faker } from '@faker-js/faker';
import { anything, instance, mock, when } from 'ts-mockito';

import { aFamilyInNeedPostsManager } from '../base/aFamilyInNeedPostsManager';
import { aFamilyInNeedPostCreationRequest } from '../base/requests/aFamilyInNeedPostCreationRequest';

import { UsersService } from '../../../../main/core/domain/services/UsersService';

import { ExceptionMessages } from '../../../../main/core/domain/exceptions/ExceptionMessages';
import { NotFoundException } from '../../../../main/core/domain/exceptions/NotFoundException';

describe('Get Family in Need Posts List by publisher id', () => {
    const mockUsersService = mock<UsersService>();

    const postsManager = aFamilyInNeedPostsManager({
        usersService: instance(mockUsersService),
    });

    beforeEach(() => {
        when(mockUsersService.isExist(anything())).thenResolve(true);
        when(mockUsersService.isActiveAssociation(anything())).thenResolve(true);
    });

    it('given a user do not exist, when trying to get his family in need posts, then should fail', async () => {
        when(mockUsersService.isExist(anything())).thenResolve(false);

        const PUBLISHER_NOT_EXIST = faker.datatype.uuid();

        await expect(postsManager.getByPublisherId({ publisherId: PUBLISHER_NOT_EXIST }))
            .to.eventually.be.rejectedWith(ExceptionMessages.USER_NOT_FOUND)
            .and.to.be.an.instanceof(NotFoundException);
    });
    it('given a user who have no family in need posts, when trying to get the posts that user publish, then return an empty list', async () => {
        const PUBLISHER_WITH_NO_POSTS = faker.datatype.uuid();

        const { list } = await postsManager.getByPublisherId({
            publisherId: PUBLISHER_WITH_NO_POSTS,
        });

        expect(list).to.have.lengthOf(0);
    });

    it('given a user who one family in need posts, when trying to get the posts that user publish, then return that post', async () => {
        const publisherId = faker.datatype.uuid();

        const { postId } = await postsManager.create(
            aFamilyInNeedPostCreationRequest({ publisherId }),
        );

        const { list } = await postsManager.getByPublisherId({ publisherId });

        const post = await postsManager.getById({ postId });

        expect(list).to.have.lengthOf(1);
        expect(list[0]).to.deep.equal(post);
    });

    it('given a user who a lot of family in need posts, when trying to get the posts that user publish, then return all those posts ordered by creation time descending', async () => {
        const publisherId = faker.datatype.uuid();

        const { postId: id1 } = await postsManager.create(
            aFamilyInNeedPostCreationRequest({ publisherId }),
        );
        const { postId: id2 } = await postsManager.create(
            aFamilyInNeedPostCreationRequest({ publisherId }),
        );
        const { postId: id3 } = await postsManager.create(
            aFamilyInNeedPostCreationRequest({ publisherId }),
        );

        const { list } = await postsManager.getByPublisherId({ publisherId });

        expect(list).to.have.lengthOf(3);
        expect(list[0]).to.have.property('postId', id3);
        expect(list[1]).to.have.property('postId', id2);
        expect(list[2]).to.have.property('postId', id1);
    });
});

