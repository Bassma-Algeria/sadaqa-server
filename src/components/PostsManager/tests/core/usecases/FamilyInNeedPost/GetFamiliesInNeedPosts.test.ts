import { expect } from 'chai';

import { cleanData } from './base/cleanData';
import { aPostsManagerFacade } from '../base/aPostsManagerFacade';
import { aFamilyInNeedPostCreationRequest } from '../base/requests/aFamilyInNeedPostCreationRequest';

describe('Get Families In Need Posts', function () {
  const postsManager = aPostsManagerFacade();

  beforeEach(async () => {
    await cleanData();
  });

  it('should get the families in need posts list', async () => {
    const post1 = aFamilyInNeedPostCreationRequest();
    const post2 = aFamilyInNeedPostCreationRequest();

    await postsManager.createFamilyInNeedPost(post1);
    await postsManager.createFamilyInNeedPost(post2);

    const { familiesInNeed } = await postsManager.getFamilyInNeedPosts();

    expect(familiesInNeed.length).to.equal(2);
    expect(familiesInNeed[0].publisherId).to.equal(post2.publisherId);
    expect(familiesInNeed[1].publisherId).to.equal(post1.publisherId);
  });

  it('should get all the families in need page per page 20 one per time, ordered by creation time descending', async () => {
    await create30FamilyInNeed();

    const { familiesInNeed } = await postsManager.getFamilyInNeedPosts();

    expect(familiesInNeed.length).to.equal(20);
    expect(familiesInNeed[0].createdAt.getTime())
      .to.be.greaterThan(familiesInNeed[1].createdAt.getTime())
      .to.be.greaterThan(familiesInNeed[10].createdAt.getTime());
  });

  it('should be able to get the families in need any specific page', async () => {
    const postsCreated = await create30FamilyInNeed();

    const { familiesInNeed } = await postsManager.getFamilyInNeedPosts({ page: 2 });

    expect(familiesInNeed.length).to.equal(10);
    expect(postsCreated[9].publisherId).to.equal(familiesInNeed[0].publisherId);
    expect(postsCreated[0].publisherId).to.equal(familiesInNeed[9].publisherId);
  });

  it('should return the total number of families in need existing', async () => {
    await postsManager.createFamilyInNeedPost(aFamilyInNeedPostCreationRequest());

    const { total } = await postsManager.getFamilyInNeedPosts();

    expect(total).to.equal(1);
  });

  it('should return the total number of families in need in a specific wilaya', async () => {
    await postsManager.createFamilyInNeedPost(
      aFamilyInNeedPostCreationRequest({ wilayaNumber: 3 }),
    );
    await postsManager.createFamilyInNeedPost(
      aFamilyInNeedPostCreationRequest({ wilayaNumber: 3 }),
    );
    await postsManager.createFamilyInNeedPost(
      aFamilyInNeedPostCreationRequest({ wilayaNumber: 1 }),
    );

    const { total } = await postsManager.getFamilyInNeedPosts({ wilayaNumber: 3 });

    expect(total).to.equal(2);
  });

  it('should get the families in need filtered by wilaya', async () => {
    await postsManager.createFamilyInNeedPost(
      aFamilyInNeedPostCreationRequest({ wilayaNumber: 3 }),
    );
    await postsManager.createFamilyInNeedPost(
      aFamilyInNeedPostCreationRequest({ wilayaNumber: 3 }),
    );
    await postsManager.createFamilyInNeedPost(
      aFamilyInNeedPostCreationRequest({ wilayaNumber: 1 }),
    );

    const { familiesInNeed } = await postsManager.getFamilyInNeedPosts({ wilayaNumber: 3 });

    expect(familiesInNeed.length).to.equal(2);
  });

  it('should be able to access the current page we are in', async () => {
    await create30FamilyInNeed();

    const { page } = await postsManager.getFamilyInNeedPosts({ page: 2 });

    expect(page).to.equal(2);
  });

  it('the page returned should be by default the first one when no page provided', async () => {
    const { page } = await postsManager.getFamilyInNeedPosts();

    expect(page).to.equal(1);
  });

  it('should know if we reach the end page or not', async () => {
    await create30FamilyInNeed();

    const { end: isEndFromFirstPage } = await postsManager.getFamilyInNeedPosts({ page: 1 });
    const { end: isEndFromSecondPage } = await postsManager.getFamilyInNeedPosts({ page: 2 });

    expect(isEndFromFirstPage).to.equal(false);
    expect(isEndFromSecondPage).to.equal(true);
  });

  const create30FamilyInNeed = async () => {
    const familiesInNeedPosts = Array.from({ length: 30 }).map(() =>
      aFamilyInNeedPostCreationRequest(),
    );

    for (const post of familiesInNeedPosts) {
      await postsManager.createFamilyInNeedPost(post);
    }

    return familiesInNeedPosts;
  };
});
