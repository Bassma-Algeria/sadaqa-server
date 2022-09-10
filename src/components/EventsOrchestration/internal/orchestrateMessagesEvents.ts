import { handleError } from '../handleError';

import { InMemoryEventBus } from '../../EventBus/main/InMemoryEventBus';
import { NotificationsManagerConfiguration } from '../../NotificationsManager/main/NotificationsManagerConfiguration';

const orchestrateMessagesEvents = () => {
    const eventBus = InMemoryEventBus.instance();

    eventBus.subscribeTo('TEXT_MESSAGE_SENT').by(payload => {
        NotificationsManagerConfiguration.aNotificationsManager()
            .createTextMessageNotification(payload)
            .catch(e => handleError('Error while creating Donation Text Message Notification', e));
    });
};

export { orchestrateMessagesEvents };
