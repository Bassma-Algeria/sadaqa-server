import { Namespace } from 'socket.io';

import { InMemoryEventBus } from '../../../EventBus/main/InMemoryEventBus';

const orchestrateMessagesEventsWithSocketServer = (wss: Namespace) => {
    const eventBus = InMemoryEventBus.instance();

    eventBus.subscribeTo('USER_START_TYPING').by(payload => {
        wss.to(payload.receiverId).emit('user-start-typing', payload);
    });

    eventBus.subscribeTo('USER_STOP_TYPING').by(payload => {
        wss.to(payload.receiverId).emit('user-stop-typing', payload);
    });

    eventBus.subscribeTo('MESSAGE_READ').by(payload => {
        wss.to(payload.senderId).emit('message-read', payload);
    });

    eventBus.subscribeTo('TEXT_MESSAGE_SENT').by(payload => {
        wss.to(payload.receiverId).emit('new-text-message', payload);
    });
};

export { orchestrateMessagesEventsWithSocketServer };


