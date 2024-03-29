import { Notification } from '../core/domain/Notification';
import { TextMessageNotification } from '../core/domain/TextMessageNotification';
import { DonationPostNotification } from '../core/domain/DonationPostNotification';
import { CallForHelpPostNotification } from '../core/domain/CallForHelpPostNotification';
import { FamilyInNeedPostNotification } from '../core/domain/FamilyInNeedPostNotification';
import { NotificationEventPublisher } from '../core/domain/services/NotificationEventPublisher';
import { DonationRequestPostNotification } from '../core/domain/DonationRequestPostNotification';

import { EventBus } from '../../../EventBus/main/EventBus';

class NotificationEventPublisherImpl implements NotificationEventPublisher {
    constructor(private readonly eventBus: EventBus) {}

    notificationRead(notification: Notification): void {
        this.eventBus.publish('NOTIFICATION_READ').withPayload({
            notificationId: notification.notificationId.value(),
        });
    }

    notificationClicked(notification: Notification): void {
        this.eventBus.publish('NOTIFICATION_CLICKED').withPayload({
            notificationId: notification.notificationId.value(),
        });
    }

    newDonationPostNotificationCreated(notification: DonationPostNotification) {
        this.eventBus.publish('NEW_DONATION_POST_NOTIFICATION').withPayload({
            notificationId: notification.notificationId.value(),
            receiverId: notification.receiverId.value(),
            postId: notification.postId.value(),
            reason: notification.reason,
            createdAt: notification.createdAt,
        });
    }

    newDonationRequestPostNotificationCreated(notification: DonationRequestPostNotification): void {
        this.eventBus.publish('NEW_DONATION_REQUEST_POST_NOTIFICATION').withPayload({
            notificationId: notification.notificationId.value(),
            receiverId: notification.receiverId.value(),
            postId: notification.postId.value(),
            reason: notification.reason,
            createdAt: notification.createdAt,
        });
    }

    newCallForHelpPostNotificationCreated(notification: CallForHelpPostNotification): void {
        this.eventBus.publish('NEW_CALL_FOR_HELP_POST_NOTIFICATION').withPayload({
            notificationId: notification.notificationId.value(),
            receiverId: notification.receiverId.value(),
            postId: notification.postId.value(),
            reason: notification.reason,
            createdAt: notification.createdAt,
        });
    }

    newFamilyInNeedPostNotificationCreated(notification: FamilyInNeedPostNotification): void {
        this.eventBus.publish('NEW_FAMILY_IN_NEED_POST_NOTIFICATION').withPayload({
            notificationId: notification.notificationId.value(),
            receiverId: notification.receiverId.value(),
            postId: notification.postId.value(),
            reason: notification.reason,
            createdAt: notification.createdAt,
        });
    }

    newTextMessageNotificationCreated(notification: TextMessageNotification) {
        this.eventBus.publish('NEW_TEXT_MESSAGE_NOTIFICATION').withPayload({
            notificationId: notification.notificationId.value(),
            receiverId: notification.receiverId.value(),
            messageSenderId: notification.messageSenderId.value(),
            messageContent: notification.messageContent,
            createdAt: notification.createdAt,
        });
    }
}

export { NotificationEventPublisherImpl };
