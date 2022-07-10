import { PostsEventBus } from '../../core/domain/services/PostsEventBus';

class FakePostsEventBus implements PostsEventBus {
  publishDonationPostCreated() {
    // mock
  }
}

export { FakePostsEventBus };
