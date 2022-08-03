import { DonationPost } from '../../../core/domain/DonationPost';
import { DonationPostEventPublisher } from '../../../core/domain/services/PostEventPublisher/DonationPostEventPublisher';

import { EventBus } from '../../../../../_shared_/event-bus/EventBus';

class DonationPostEventPublisherImpl implements DonationPostEventPublisher {
    constructor(private readonly eventBus: EventBus) {}

    publishPostCreated(post: DonationPost): void {
        this.eventBus.publish('DONATION_POST_CREATED').withPayload(this.toPayload(post));
    }

    publishPostUpdated(post: DonationPost): void {
        this.eventBus.publish('DONATION_POST_UPDATED').withPayload(this.toPayload(post));
    }

    publishPostDeleted(post: DonationPost): void {
        this.eventBus.publish('DONATION_POST_DELETED').withPayload(this.toPayload(post));
    }

    publishEnablingStatusToggled(post: DonationPost): void {
        this.eventBus
            .publish('DONATION_REQUEST_POST_ENABLING_STATUS_TOGGLED')
            .withPayload(this.toPayload(post));
    }

    private toPayload(post: DonationPost) {
        return {
            title: post.title.value(),
            postId: post.postId.value(),
            category: post.category.value(),
            publisherId: post.publisherId.value(),
            description: post.description.value(),
            wilayaNumber: post.wilayaNumber.value(),
            status: post.status,
            pictures: post.pictures.map(pic => pic.url()),
            createdAt: post.createdAt,
        };
    }
}

export { DonationPostEventPublisherImpl };
