import { DonationPost } from '../../core/domain/DonationPost';
import { PostsEventBus } from '../../core/domain/services/PostsEventBus';

import { EventBus } from '../../../../_shared_/event-bus/EventBus';

class PostsEventBusImpli implements PostsEventBus {
  constructor(private readonly eventBus: EventBus) {}

  publishDonationPostCreated(donationPost: DonationPost) {
    this.eventBus.publish('NEW_DONATION_CREATED').withPayload({
      title: donationPost.title.value(),
      postId: donationPost.postId.value(),
      category: donationPost.category.value(),
      publisherId: donationPost.postId.value(),
      description: donationPost.description.value(),
      wilayaNumber: donationPost.wilayaNumber.value(),
      pictures: donationPost.pictures.map(pic => pic.url()),
      createdAt: donationPost.createdAt,
    });
  }
}

export { PostsEventBusImpli };