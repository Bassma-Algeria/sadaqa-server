import { EventBus } from './_shared_/event-bus/EventBus';
import { NotificationsManagerConfiguration } from './NotificationsManager/main/NotificationsManagerConfiguration';

const eventBus = EventBus.getInstance();

eventBus.subscribeTo('DONATION_POST_CREATED').by(payload => {
    NotificationsManagerConfiguration.aNotificationsManager().createNewDonationPostNotification(
        payload,
    );
});

eventBus.subscribeTo('DONATION_REQUEST_POST_CREATED').by(payload => {
    NotificationsManagerConfiguration.aNotificationsManager().createNewDonationRequestPostNotification(
        payload,
    );
});

eventBus.subscribeTo('FAMILY_IN_NEED_POST_CREATED').by(payload => {
    NotificationsManagerConfiguration.aNotificationsManager().createNewFamilyInNeedPostNotification(
        payload,
    );
});

eventBus.subscribeTo('CALL_FOR_HELP_POST_CREATED').by(payload => {
    NotificationsManagerConfiguration.aNotificationsManager().createNewCallForHelpPostNotification(
        payload,
    );
});