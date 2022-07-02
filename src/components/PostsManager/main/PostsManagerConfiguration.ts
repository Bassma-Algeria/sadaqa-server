import { PostsManagerFacade } from './PostsManagerFacade';

class PostsManagerConfiguration {
  static aPostsManagerFacade() {
    return new PostsManagerFacade();
  }
}

export { PostsManagerConfiguration };
