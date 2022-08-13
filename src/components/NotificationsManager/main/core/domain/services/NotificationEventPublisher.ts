import { DonationPostNotification } from '../DonationPostNotification';
import { DonationRequestPostNotification } from '../DonationRequestPostNotification';
import { FamilyInNeedPostNotification } from '../FamilyInNeedPostNotification';
import { CallForHelpPostNotification } from '../CallForHelpPostNotification';

export interface NotificationEventPublisher {
    newDonationPostNotificationCreated(notification: DonationPostNotification): void;

    newDonationRequestPostNotificationCreated(notification: DonationRequestPostNotification): void;

    newFamilyInNeedPostNotificationCreated(notification: FamilyInNeedPostNotification): void;

    newCallForHelpPostNotificationCreated(notification: CallForHelpPostNotification): void;
}