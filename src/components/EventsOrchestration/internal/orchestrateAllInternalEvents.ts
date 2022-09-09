import { orchestratePostsEvents } from './orchestratePostsEvents';
import { orchestrateUsersEvents } from './orchestrateUsersEvents';
import { orchestrateLoggerEvents } from './orchestrateLoggerEvents';
import { orchestrateMessagesEvents } from './orchestrateMessagesEvents';

const orchestrateAllInternalEvents = () => {
    orchestrateLoggerEvents();

    orchestrateMessagesEvents();

    orchestratePostsEvents();

    orchestrateUsersEvents();
};

export { orchestrateAllInternalEvents };
