import { DonationPost } from '../../core/domain/DonationPost';
import { CallForHelpPost } from '../../core/domain/CallForHelpPost';
import { FamilyInNeedPost } from '../../core/domain/FamilyInNeedPost';
import { DonationRequestPost } from '../../core/domain/DonationRequestPost';

import { PostsEventPublisher } from '../../core/domain/services/PostsEventPublisher';

import { EventBus } from '../../../../_shared_/event-bus/EventBus';

class PostsEventPublisherImpl implements PostsEventPublisher {
  constructor(private readonly eventBus: EventBus) {}

  publishDonationPostCreated(donationPost: DonationPost) {
    this.eventBus.publish('DONATION_POST_CREATED').withPayload({
      title: donationPost.title.value(),
      postId: donationPost.postId.value(),
      category: donationPost.category.value(),
      publisherId: donationPost.publisherId.value(),
      description: donationPost.description.value(),
      wilayaNumber: donationPost.wilayaNumber.value(),
      pictures: donationPost.pictures.map(pic => pic.url()),
      createdAt: donationPost.createdAt,
    });
  }

  publishFamilyInNeedPostCreated(post: FamilyInNeedPost) {
    this.eventBus.publish('FAMILY_IN_NEED_POST_CREATED').withPayload({
      postId: post.postId.value(),
      title: post.title.value(),
      description: post.description.value(),
      publisherId: post.publisherId.value(),
      wilayaNumber: post.wilayaNumber.value(),
      pictures: post.pictures.map(pic => pic.url()),
      ccp: post.ccp?.number(),
      ccpKey: post.ccp?.key(),
      baridiMobNumber: post.baridiMobNumber?.value(),
      createdAt: post.createdAt,
    });
  }

  publishDonationRequestPostCreated(post: DonationRequestPost) {
    this.eventBus.publish('DONATION_REQUEST_POST_CREATED').withPayload({
      title: post.title.value(),
      postId: post.postId.value(),
      category: post.category.value(),
      publisherId: post.publisherId.value(),
      description: post.description.value(),
      wilayaNumber: post.wilayaNumber.value(),
      pictures: post.pictures.map(pic => pic.url()),
      createdAt: post.createdAt,
    });
  }

  publishCallForHelpPostCreated(post: CallForHelpPost) {
    this.eventBus.publish('CALL_FOR_HELP_POST_CREATED').withPayload({
      postId: post.postId.value(),
      title: post.title.value(),
      description: post.description.value(),
      publisherId: post.publisherId.value(),
      wilayaNumber: post.wilayaNumber.value(),
      pictures: post.pictures.map(pic => pic.url()),
      ccp: post.ccp?.number(),
      ccpKey: post.ccp?.key(),
      baridiMobNumber: post.baridiMobNumber?.value(),
      createdAt: post.createdAt,
    });
  }
}

export { PostsEventPublisherImpl };
