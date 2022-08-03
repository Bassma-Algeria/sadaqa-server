import { expect } from 'chai';

import { cleanData } from './base/cleanData';
import { aCallForHelpPostsManager } from '../base/aCallForHelpPostsManager';
import { aCallForHelpPostCreationRequest } from '../base/requests/aCallForHelpPostCreationRequest';

describe('Get Call For Help Posts List', () => {
    const postsManager = aCallForHelpPostsManager();

    beforeEach(async () => {
        await cleanData();
    });

    it('should get the call for help posts posts list', async () => {
        const post1 = aCallForHelpPostCreationRequest();
        const post2 = aCallForHelpPostCreationRequest();

        await postsManager.create(post1);
        await postsManager.create(post2);

        const { list } = await postsManager.getList();

        expect(list.length).to.equal(2);
        expect(list[0].publisherId).to.equal(post2.publisherId);
        expect(list[1].publisherId).to.equal(post1.publisherId);
    });

    it('should get all the call for help posts page per page 20 one per time, ordered by creation time descending', async () => {
        await create30CallForHelp();

        const { list } = await postsManager.getList();

        expect(list.length).to.equal(20);
        expect(list[0].createdAt.getTime())
            .to.be.greaterThan(list[1].createdAt.getTime())
            .to.be.greaterThan(list[10].createdAt.getTime());
    });

    it('should be able to get the call for help posts any specific page', async () => {
        const postsCreated = await create30CallForHelp();

        const { list } = await postsManager.getList({ page: 2 });

        expect(list.length).to.equal(10);
        expect(postsCreated[9].publisherId).to.equal(list[0].publisherId);
        expect(postsCreated[0].publisherId).to.equal(list[9].publisherId);
    });

    it('should return the total number of call for help posts existing', async () => {
        await postsManager.create(aCallForHelpPostCreationRequest());

        const { total } = await postsManager.getList();

        expect(total).to.equal(1);
    });

    it('should return the total number of call for help posts in a specific wilaya', async () => {
        await postsManager.create(aCallForHelpPostCreationRequest({ wilayaNumber: 3 }));
        await postsManager.create(aCallForHelpPostCreationRequest({ wilayaNumber: 3 }));
        await postsManager.create(aCallForHelpPostCreationRequest({ wilayaNumber: 1 }));

        const { total } = await postsManager.getList({ wilayaNumber: 3 });

        expect(total).to.equal(2);
    });

    it('should get the call for help posts filtered by wilaya', async () => {
        await postsManager.create(aCallForHelpPostCreationRequest({ wilayaNumber: 3 }));
        await postsManager.create(aCallForHelpPostCreationRequest({ wilayaNumber: 3 }));
        await postsManager.create(aCallForHelpPostCreationRequest({ wilayaNumber: 1 }));

        const { list } = await postsManager.getList({ wilayaNumber: 3 });

        expect(list.length).to.equal(2);
    });

    it('should be able to access the current page we are in', async () => {
        await create30CallForHelp();

        const { page } = await postsManager.getList({ page: 2 });

        expect(page).to.equal(2);
    });

    it('the page returned should be by default the first one when no page provided', async () => {
        const { page } = await postsManager.getList();

        expect(page).to.equal(1);
    });

    it('should know if we reach the end page or not', async () => {
        await create30CallForHelp();

        const { end: isEndFromFirstPage } = await postsManager.getList({ page: 1 });
        const { end: isEndFromSecondPage } = await postsManager.getList({ page: 2 });

        expect(isEndFromFirstPage).to.equal(false);
        expect(isEndFromSecondPage).to.equal(true);
    });

    const create30CallForHelp = async () => {
        const callsForHelpPosts = Array.from({ length: 30 }).map(() =>
            aCallForHelpPostCreationRequest(),
        );

        for (const post of callsForHelpPosts) {
            await postsManager.create(post);
        }

        return callsForHelpPosts;
    };
});
