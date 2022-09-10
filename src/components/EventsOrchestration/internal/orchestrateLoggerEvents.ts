import { handleError } from '../handleError';

import { InMemoryEventBus } from '../../EventBus/main/InMemoryEventBus';
import { LoggerConfiguration } from '../../Logger/main/LoggerConfiguration';

const orchestrateLoggerEvents = () => {
    const eventBus = InMemoryEventBus.instance();

    eventBus.subscribeTo('ASSOCIATION_REGISTERED').by(payload => {
        // @ts-ignore
        delete (payload.associationDocs as any);

        LoggerConfiguration.aLogger()
            .info({ message: 'ASSOCIATION_REGISTERED', payload })
            .catch(e => handleError('Error While logging Association Registered Event', e));
    });

    eventBus
        .subscribeToAllEvents()
        .by((ev, payload) => {
            LoggerConfiguration.aLogger()
                .info({ message: ev, payload })
                .catch(e => handleError(`Error while logging ${ev} event`, e));
        })
        .excluding(['ASSOCIATION_REGISTERED']);
};

export { orchestrateLoggerEvents };
