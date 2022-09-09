import { Namespace } from 'socket.io';

import { InMemoryEventBus } from '../../../EventBus/main/InMemoryEventBus';

const orchestrateNotificationsEventsWithSocketServer = (wss: Namespace) => {
    const eventBus = InMemoryEventBus.instance();

    eventBus.subscribeTo('NEW_TEXT_MESSAGE_NOTIFICATION').by(payload => {
        wss.to(payload.receiverId).emit('new-text-message-notification', payload);
    });

    eventBus.subscribeTo('NEW_DONATION_POST_NOTIFICATION').by(payload => {
        wss.to(payload.receiverId).emit('new-donation-post-notification', payload);
    });

    eventBus.subscribeTo('NEW_DONATION_REQUEST_POST_NOTIFICATION').by(payload => {
        wss.to(payload.receiverId).emit('new-donation-request-post-notification', payload);
    });

    eventBus.subscribeTo('NEW_FAMILY_IN_NEED_POST_NOTIFICATION').by(payload => {
        wss.to(payload.receiverId).emit('new-family-in-need-post-notification', payload);
    });

    eventBus.subscribeTo('NEW_CALL_FOR_HELP_POST_NOTIFICATION').by(payload => {
        wss.to(payload.receiverId).emit('new-call-for-help-post-notification', payload);
    });
};

export { orchestrateNotificationsEventsWithSocketServer };


