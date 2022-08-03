import { DonationRequestPost } from '../../../core/domain/DonationRequestPost';
import { DonationRequestPostEventPublisher } from '../../../core/domain/services/PostEventPublisher/DonationRequestPostEventPublisher';

import { EventBus } from '../../../../../_shared_/event-bus/EventBus';

class DonationRequestPostEventPublisherImpl implements DonationRequestPostEventPublisher {
    constructor(private readonly eventBus: EventBus) {}

    publishPostCreated(post: DonationRequestPost): void {
        this.eventBus.publish('DONATION_REQUEST_POST_CREATED').withPayload(this.toPayload(post));
    }

    publishPostUpdated(post: DonationRequestPost): void {
        this.eventBus.publish('DONATION_REQUEST_POST_UPDATED').withPayload(this.toPayload(post));
    }

    publishPostDeleted(post: DonationRequestPost): void {
        this.eventBus.publish('DONATION_REQUEST_POST_DELETED').withPayload(this.toPayload(post));
    }

    publishEnablingStatusToggled(post: DonationRequestPost): void {
        this.eventBus
            .publish('DONATION_REQUEST_POST_ENABLING_STATUS_TOGGLED')
            .withPayload(this.toPayload(post));
    }

    private toPayload(post: DonationRequestPost) {
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

export { DonationRequestPostEventPublisherImpl };
