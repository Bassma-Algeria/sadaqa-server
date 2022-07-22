import { DonationPost } from '../../core/domain/DonationPost';
import { FamilyInNeedPost } from '../../core/domain/FamilyInNeedPost';
import { DonationRequestPost } from '../../core/domain/DonationRequestPost';

import { PostsEventBus } from '../../core/domain/services/PostsEventBus';

import { EventBus } from '../../../../_shared_/event-bus/EventBus';
import { CallForHelpPost } from '../../core/domain/CallForHelpPost';

class PostsEventBusImpl implements PostsEventBus {
  constructor(private readonly eventBus: EventBus) {}

  publishDonationPostCreated(donationPost: DonationPost) {
    this.eventBus.publish('NEW_DONATION_POST_CREATED').withPayload({
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
    this.eventBus.publish('NEW_FAMILY_IN_NEED_POST_CREATED').withPayload({
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
    this.eventBus.publish('NEW_DONATION_REQUEST_POST_CREATED').withPayload({
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
    this.eventBus.publish('NEW_CALL_FOR_HELP_POST_CREATED').withPayload({
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

export { PostsEventBusImpl };
