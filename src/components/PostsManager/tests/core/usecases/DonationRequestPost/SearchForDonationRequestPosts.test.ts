import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { cleanData } from './base/cleanData';
import { aDonationRequestPostsManager } from '../base/aDonationRequestPostsManager';
import { aDonationRequestPostCreationRequest } from '../base/requests/aDonationRequestPostCreationRequest';

describe('Search For Donation Request Posts', () => {
    const postsManager = aDonationRequestPostsManager();

    beforeEach(async () => {
        await cleanData();
    });

    it('given a search for donation request posts request, when the keyword provided not exist, then list should be empty', async () => {
        const { list } = await postsManager.search({ keyword: 'NOT_EXIST' });

        expect(list).to.have.lengthOf(0);
    });

    it('given a search for donation request posts request, when the keyword provided is a part of the title of an existing post, then the result list should contains that post', async () => {
        const title = faker.lorem.words(3);
        const { postId } = await postsManager.create(
            aDonationRequestPostCreationRequest({ title }),
        );

        const keyword = title.split(' ')[1].slice(3);
        const { list } = await postsManager.search({ keyword });

        expect(list).to.have.lengthOf(1);
        expect(list[0]).to.have.property('postId', postId);
    });

    it('given a search for donation request posts request, when the keyword provided is a part of the description of an existing post, then the result list should contains that post', async () => {
        const description = faker.lorem.words(30);
        const { postId } = await postsManager.create(
            aDonationRequestPostCreationRequest({ description }),
        );

        const keyword = description.split(' ')[20];
        const { list } = await postsManager.search({ keyword });

        expect(list).to.have.lengthOf(1);
        expect(list[0]).to.have.property('postId', postId);
    });

    it('given a search for donation request posts request, then the result list should not contains the disabled posts', async () => {
        const description = faker.lorem.words(30);

        const request = aDonationRequestPostCreationRequest({ description });
        const { postId } = await postsManager.create(request);

        await postsManager.toggleEnablingStatus({ postId, userId: request.publisherId });

        const keyword = description.split(' ')[20];
        const { list } = await postsManager.search({ keyword });

        expect(list).to.have.lengthOf(0);
    });

    it('given a search for donation request posts request, when there is a wilayaNumber filter, then the should show only the posts in that wilaya', async () => {
        const description = faker.lorem.words(30);
        const { postId } = await postsManager.create(
            aDonationRequestPostCreationRequest({ description, wilayaNumber: 1 }),
        );

        await postsManager.create(
            aDonationRequestPostCreationRequest({ description, wilayaNumber: 2 }),
        );

        const keyword = description.split(' ')[20];
        const { list } = await postsManager.search({ keyword, wilayaNumber: 1 });

        expect(list).to.have.lengthOf(1);
        expect(list[0]).to.have.property('postId', postId);
    });

    it('given a search for donation request posts request, when there are matches, then the posts list should be ordered by creation time descending', async () => {
        const title = faker.lorem.words(3);
        await postsManager.create(aDonationRequestPostCreationRequest({ title }));
        await postsManager.create(aDonationRequestPostCreationRequest({ title }));

        const keyword = title.split(' ')[1].slice(3);
        const { list } = await postsManager.search({ keyword });

        expect(list).to.have.lengthOf(2);
        expect(list[0].createdAt).to.be.greaterThan(list[1].createdAt);
    });

    it('given a search for donation request posts request, when there are a lot of matches, then should return them page per page 20 post per page', async () => {
        const title = faker.lorem.words(3);
        await create25PostWithTitle(title);

        const keyword = title.split(' ')[1].slice(3);
        const { list } = await postsManager.search({ keyword });

        expect(list).to.have.lengthOf(20);
    });

    it('given a search for donation request posts request, when there are a lot of matches, then should be able to get a target page', async () => {
        const title = faker.lorem.words(3);
        await create25PostWithTitle(title);

        const keyword = title.split(' ')[1].slice(3);
        const { list } = await postsManager.search({ keyword, page: 2 });

        expect(list).to.have.lengthOf(5);
    });

    it('given a search for donation request posts request, when there are a lot of matches, then should return the number of the page requested', async () => {
        const title = faker.lorem.words(3);
        await create25PostWithTitle(title);

        const keyword = title.split(' ')[1];
        const { page } = await postsManager.search({ keyword, page: 2 });

        expect(page).to.equal(2);
    });

    it('given a search for donation request posts request, when there are a lot of matches, then should return the total number of posts found', async () => {
        const title = faker.lorem.words(3);

        await postsManager.create(aDonationRequestPostCreationRequest({ title }));
        await postsManager.create(aDonationRequestPostCreationRequest({ title }));

        await postsManager.create(aDonationRequestPostCreationRequest({ title: 'NOT_MATCH' }));

        const keyword = title.split(' ')[1];
        const { total } = await postsManager.search({ keyword });

        expect(total).to.equal(2);
    });

    it('given a search for donation request posts request, when there are a lot of matches, then should return either we are in the last page or not', async () => {
        const title = faker.lorem.words(3);
        await create25PostWithTitle(title);

        const keyword = title.split(' ')[1].slice(3);
        const { end: end1 } = await postsManager.search({ keyword, page: 1 });
        const { end: end2 } = await postsManager.search({ keyword, page: 2 });

        expect(end1).to.equal(false);
        expect(end2).to.equal(true);
    });

    const create25PostWithTitle = async (title: string) => {
        for (const _ of Array.from({ length: 25 }))
            await postsManager.create(aDonationRequestPostCreationRequest({ title }));
    };
});
