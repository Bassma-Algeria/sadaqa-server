import { Events } from './Events';
import { AllEventsSubscriber, EventBus, EventSubscriber } from './EventBus';

type Subscribers = {
    [Key in keyof Events]: EventSubscriber<Key>[];
};

class InMemoryEventBus implements EventBus {
    private static readonly eventBus = new InMemoryEventBus();

    static instance() {
        return InMemoryEventBus.eventBus;
    }

    private constructor() {}

    private readonly subscribers: Partial<Subscribers> = {};
    private readonly subscribersToAll: AllEventsSubscriber<any>[] = [];

    subscribeTo<E extends keyof Events>(event: E) {
        return {
            by: (subscriber: (payload: Events[E]) => void) => {
                if (!this.subscribers[event]) this.subscribers[event] = [];

                this.subscribers[event]?.push(subscriber);
            },
        };
    }

    subscribeToAllEvents() {
        return {
            by: (subscriber: AllEventsSubscriber<any>) => {
                this.subscribersToAll.push(subscriber);
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
                this.subscribers[event]?.forEach(subscriber => subscriber(payload));
                this.subscribersToAll.map(subscriber => subscriber(event, payload));
            },
        };
    }
}

export { InMemoryEventBus };
