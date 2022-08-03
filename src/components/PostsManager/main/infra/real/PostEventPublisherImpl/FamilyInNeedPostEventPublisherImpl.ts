import { FamilyInNeedPost } from '../../../core/domain/FamilyInNeedPost';
import { FamilyInNeedPostEventPublisher } from '../../../core/domain/services/PostEventPublisher/FamilyInNeedPostEventPublisher';

import { EventBus } from '../../../../../_shared_/event-bus/EventBus';

class FamilyInNeedPostEventPublisherImpl implements FamilyInNeedPostEventPublisher {
    constructor(private readonly eventBus: EventBus) {}

    publishPostCreated(post: FamilyInNeedPost): void {
        this.eventBus.publish('FAMILY_IN_NEED_POST_CREATED').withPayload(this.toPayload(post));
    }

    publishPostUpdated(post: FamilyInNeedPost): void {
        this.eventBus.publish('FAMILY_IN_NEED_POST_UPDATED').withPayload(this.toPayload(post));
    }

    publishPostDeleted(post: FamilyInNeedPost): void {
        this.eventBus.publish('FAMILY_IN_NEED_POST_DELETED').withPayload(this.toPayload(post));
    }

    publishEnablingStatusToggled(post: FamilyInNeedPost): void {
        this.eventBus
            .publish('FAMILY_IN_NEED_POST_ENABLING_STATUS_TOGGLED')
            .withPayload(this.toPayload(post));
    }

    private toPayload(post: FamilyInNeedPost) {
        return {
            postId: post.postId.value(),
            title: post.title.value(),
            description: post.description.value(),
            publisherId: post.publisherId.value(),
            wilayaNumber: post.wilayaNumber.value(),
            pictures: post.pictures.map(pic => pic.url()),
            ccp: post.ccp?.number(),
            status: post.status,
            ccpKey: post.ccp?.key(),
            baridiMobNumber: post.baridiMobNumber?.value(),
            createdAt: post.createdAt,
        };
    }
}

export { FamilyInNeedPostEventPublisherImpl };
