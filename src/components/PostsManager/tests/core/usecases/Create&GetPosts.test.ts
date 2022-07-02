import { expect } from 'chai';
import { PostsManagerFacade } from '../../../main/PostsManagerFacade';

describe('Create & Get posts', () => {
  const postsManagerFacade = new PostsManagerFacade();

  it("should create a post, and be able to get it by it's id", async () => {
    const { postId } = await postsManagerFacade.createNewPost(postCreationBody);
    const postInfo = await postsManagerFacade.getById({ postId });

    expect(postInfo).to.deep.equal(postCreationBody);
  });
});
