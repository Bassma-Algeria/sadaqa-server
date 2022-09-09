import { handleError } from '../handleError';

import { InMemoryEventBus } from '../../EventBus/main/InMemoryEventBus';
import { NotificationsManagerConfiguration } from '../../NotificationsManager/main/NotificationsManagerConfiguration';

const orchestratePostsEvents = () => {
    const eventBus = InMemoryEventBus.instance();

    eventBus.subscribeTo('DONATION_POST_CREATED').by(payload => {
        NotificationsManagerConfiguration.aNotificationsManager()
            .createNewDonationPostNotification(payload)
            .catch(e => handleError('Error while creating Donation Post Notification', e));
    });

    eventBus.subscribeTo('DONATION_REQUEST_POST_CREATED').by(payload => {
        NotificationsManagerConfiguration.aNotificationsManager()
            .createNewDonationRequestPostNotification(payload)
            .catch(e => handleError('Error while creating Donation Request Post Notification', e));
    });

    eventBus.subscribeTo('FAMILY_IN_NEED_POST_CREATED').by(payload => {
        NotificationsManagerConfiguration.aNotificationsManager()
            .createNewFamilyInNeedPostNotification(payload)
            .catch(e => handleError('Error while creating Family In Need Post Notification', e));
    });

    eventBus.subscribeTo('CALL_FOR_HELP_POST_CREATED').by(payload => {
        NotificationsManagerConfiguration.aNotificationsManager()
            .createNewCallForHelpPostNotification(payload)
            .catch(e => handleError('Error while creating Call For Help Post Notification', e));
    });
};

export { orchestratePostsEvents };
