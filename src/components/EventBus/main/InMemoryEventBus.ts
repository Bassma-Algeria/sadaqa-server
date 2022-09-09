import { Events } from './Events';
import { AllEventsSubscriber, EventBus, EventSubscriber } from './EventBus';

type Subscribers = {
    [Key in keyof Events]: EventSubscriber<Key>[];
};

type AllEventsSubscriberElement<E extends keyof Events> = {
    subscriber: AllEventsSubscriber<E>;
    excludedEvents: E[];
};

class InMemoryEventBus implements EventBus {
    private static readonly eventBus = new InMemoryEventBus();

    static instance() {
        return InMemoryEventBus.eventBus;
    }

    private constructor() {}

    private readonly subscribers: Partial<Subscribers> = {};
    private readonly subscribersToAll: AllEventsSubscriberElement<any>[] = [];

    subscribeTo<E extends keyof Events>(event: E) {
        return {
            by: (subscriber: (payload: Events[E]) => void) => {
                if (!this.subscribers[event]) this.subscribers[event] = [];

                this.subscribers[event]?.push(subscriber);
            },
        };
    }

    subscribeToAllEvents<E extends keyof Events>() {
        return {
            by: (subscriber: AllEventsSubscriber<E>) => {
                const subscriberToAll: AllEventsSubscriberElement<E> = {
                    subscriber,
                    excludedEvents: [],
                };

                this.subscribersToAll.push(subscriberToAll);

                return {
                    excluding: (excluded: E[]) => {
                        subscriberToAll.excludedEvents = excluded;
                    },
                };
            },
        };
    }

    unsubscribeFrom<E extends keyof Events>(event: E) {
        return {
            by: (target: (payload: Events[E]) => void) => {
                this.subscribers[event] = this.subscribers[event]?.filter(
                    subscriber => subscriber !== target,
                ) as Subscribers[E];
            },
        };
    }

    publish<E extends keyof Events>(event: E) {
        return {
            withPayload: (payload: Events[E]) => {
                this.subscribers[event]?.forEach(subscriber => subscriber({ ...payload }));

                this.subscribersToAll
                    .filter(s => !s.excludedEvents.includes(event))
                    .forEach(({ subscriber }) => subscriber(event, { ...payload }));
            },
        };
    }
}

export { InMemoryEventBus };
