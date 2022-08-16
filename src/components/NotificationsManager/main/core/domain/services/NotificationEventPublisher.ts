import { Notification } from '../Notification';
import { TextMessageNotification } from '../TextMessageNotification';
import { DonationPostNotification } from '../DonationPostNotification';
import { CallForHelpPostNotification } from '../CallForHelpPostNotification';
import { FamilyInNeedPostNotification } from '../FamilyInNeedPostNotification';
import { DonationRequestPostNotification } from '../DonationRequestPostNotification';

export interface NotificationEventPublisher {
    newDonationPostNotificationCreated(notification: DonationPostNotification): void;

    newDonationRequestPostNotificationCreated(notification: DonationRequestPostNotification): void;

    newFamilyInNeedPostNotificationCreated(notification: FamilyInNeedPostNotification): void;

    newCallForHelpPostNotificationCreated(notification: CallForHelpPostNotification): void;

    newTextMessageNotificationCreated(notification: TextMessageNotification): void;

    notificationRead(notification: Notification): void;

    notificationClicked(notification: Notification): void;
}
