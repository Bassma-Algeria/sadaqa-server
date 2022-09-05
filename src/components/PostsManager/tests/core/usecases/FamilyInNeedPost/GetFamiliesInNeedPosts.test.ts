import { expect } from 'chai';

import { cleanData } from './base/cleanData';
import { aFamilyInNeedPostsManager } from '../base/aFamilyInNeedPostsManager';
import { aFamilyInNeedPostCreationRequest } from '../base/requests/aFamilyInNeedPostCreationRequest';

describe('Get Families In Need Posts', function () {
    const postsManager = aFamilyInNeedPostsManager();

    beforeEach(async () => {
        await cleanData();
    });

    it('should get the families in need posts list', async () => {
        const post1 = aFamilyInNeedPostCreationRequest();
        const post2 = aFamilyInNeedPostCreationRequest();

        await postsManager.create(post1);
        await postsManager.create(post2);

        const { list } = await postsManager.getList();

        expect(list.length).to.equal(2);
        expect(list[0].publisherId).to.equal(post2.publisherId);
        expect(list[1].publisherId).to.equal(post1.publisherId);
    });

    it('should not get the disabled families in need posts', async () => {
        const request = aFamilyInNeedPostCreationRequest();
        const { postId } = await postsManager.create(request);

        await postsManager.toggleEnablingStatus({ postId, userId: request.publisherId });

        const { list } = await postsManager.getList();

        expect(list.length).to.equal(0);
    });

    it('should get all the families in need page per page 20 one per time, ordered by creation time descending', async () => {
        await create30FamilyInNeed();

        const { list } = await postsManager.getList();

        expect(list.length).to.equal(20);
        expect(list[0].createdAt.getTime())
            .to.be.greaterThan(list[1].createdAt.getTime())
            .to.be.greaterThan(list[10].createdAt.getTime());
    });

    it('should be able to get the families in need any specific page', async () => {
        const postsCreated = await create30FamilyInNeed();

        const { list } = await postsManager.getList({ page: 2 });

        expect(list.length).to.equal(10);
        expect(postsCreated[9].publisherId).to.equal(list[0].publisherId);
        expect(postsCreated[0].publisherId).to.equal(list[9].publisherId);
    });

    it('should return the total number of families in need existing', async () => {
        await postsManager.create(aFamilyInNeedPostCreationRequest());

        const { total } = await postsManager.getList();

        expect(total).to.equal(1);
    });

    it('should return the total number of families in need in a specific wilaya', async () => {
        await postsManager.create(aFamilyInNeedPostCreationRequest({ wilayaNumber: 3 }));
        await postsManager.create(aFamilyInNeedPostCreationRequest({ wilayaNumber: 3 }));
        await postsManager.create(aFamilyInNeedPostCreationRequest({ wilayaNumber: 1 }));

        const { total } = await postsManager.getList({ wilayaNumber: 3 });

        expect(total).to.equal(2);
    });

    it('should get the families in need filtered by wilaya', async () => {
        await postsManager.create(aFamilyInNeedPostCreationRequest({ wilayaNumber: 3 }));
        await postsManager.create(aFamilyInNeedPostCreationRequest({ wilayaNumber: 3 }));
        await postsManager.create(aFamilyInNeedPostCreationRequest({ wilayaNumber: 1 }));

        const { list } = await postsManager.getList({ wilayaNumber: 3 });

        expect(list.length).to.equal(2);
    });

    it('should be able to access the current page we are in', async () => {
        await create30FamilyInNeed();

        const { page } = await postsManager.getList({ page: 2 });

        expect(page).to.equal(2);
    });

    it('the page returned should be by default the first one when no page provided', async () => {
        const { page } = await postsManager.getList();

        expect(page).to.equal(1);
    });

    it('should know if we reach the end page or not', async () => {
        await create30FamilyInNeed();

        const { end: isEndFromFirstPage } = await postsManager.getList({ page: 1 });
        const { end: isEndFromSecondPage } = await postsManager.getList({ page: 2 });

        expect(isEndFromFirstPage).to.equal(false);
        expect(isEndFromSecondPage).to.equal(true);
    });

    const create30FamilyInNeed = async () => {
        const familiesInNeedPosts = Array.from({ length: 30 }).map(() =>
            aFamilyInNeedPostCreationRequest(),
        );

        for (const post of familiesInNeedPosts) {
            await postsManager.create(post);
        }

        return familiesInNeedPosts;
    };
});
