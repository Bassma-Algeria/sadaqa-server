import { Namespace } from 'socket.io';

import { InMemoryEventBus } from '../../../EventBus/main/InMemoryEventBus';

const orchestrateUsersEventsWithSocketServer = (wss: Namespace) => {
    const eventBus = InMemoryEventBus.instance();

    eventBus.subscribeTo('USER_BECAME_ONLINE').by(payload => {
        wss.emit('user-became-online', payload);
    });

    eventBus.subscribeTo('USER_GO_OFFLINE').by(payload => {
        wss.emit('user-go-offline', payload);
    });
};

export { orchestrateUsersEventsWithSocketServer };


