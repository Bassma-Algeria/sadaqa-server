import { EventBus } from './_shared_/event-bus/EventBus';

import { EmailsManagerConfiguration } from './EmailsManager/main/EmailsManagerConfiguration';
import { NotificationsManagerConfiguration } from './NotificationsManager/main/NotificationsManagerConfiguration';
import { LoggerConfiguration } from './Logger/main/LoggerConfiguration';

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

eventBus.subscribeTo('TEXT_MESSAGE_SENT').by(payload => {
    NotificationsManagerConfiguration.aNotificationsManager().createTextMessageNotification(
        payload,
    );
});

eventBus.subscribeTo('ASSOCIATION_REGISTERED').by(payload => {
    EmailsManagerConfiguration.anEmailsManager().sendAssociationApprovalEmail(payload);
});

eventBus.subscribeToAllEvents().by((ev, payload) => {
    if (ev === 'ASSOCIATION_REGISTERED') {
        // @ts-ignore
        delete payload.associationDocs;
    }

    LoggerConfiguration.aLogger().info({ message: ev, payload });
});
