import { FavouritePost } from './FavouritePost';
import { UserId } from './UserId';
import { PostId } from './PostId';
import { PostType } from './PostType';

class FavouritePostBuilder {
  static aBuilder() {
    return new FavouritePostBuilder();
  }

  private userId!: UserId;
  private postId!: PostId;
  private postType!: PostType;

  withUserId(userId: UserId) {
    this.userId = userId;
    return this;
  }

  withPostId(postId: PostId) {
    this.postId = postId;
    return this;
  }

  withPostType(postType: PostType) {
    this.postType = postType;
    return this;
  }

  build(): FavouritePost {
    return new FavouritePost(this.userId, this.postId, this.postType);
  }
}

export { FavouritePostBuilder };