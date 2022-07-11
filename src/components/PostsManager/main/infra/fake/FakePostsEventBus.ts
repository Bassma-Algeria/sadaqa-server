import { PostsEventBus } from '../../core/domain/services/PostsEventBus';

class FakePostsEventBus implements PostsEventBus {
  publishDonationPostCreated() {
    // ...
  }
}

export { FakePostsEventBus };
