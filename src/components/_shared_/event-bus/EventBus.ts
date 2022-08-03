import { Events } from './Events';

type Subscribers = {
    [Key in keyof Events]: Array<(payload: Events[Key]) => void>;
};

class EventBus {
    private static readonly eventBus = new EventBus();

    static getInstance() {
        return EventBus.eventBus;
    }

    private constructor() {}

    private readonly subscribers: Partial<Subscribers> = {};

    subscribeTo<E extends keyof Events>(event: E) {
        return {
            by: (subscriber: (payload: Events[E]) => void) => {
                if (!this.subscribers[event]) this.subscribers[event] = [];

                this.subscribers[event]?.push(subscriber);
            },
        };
    }

    unsubscribeFrom<E extends keyof Events>(event: E) {
        return {
            by: (unsubscriber: (payload: Events[E]) => void) => {
                this.subscribers[event] = this.subscribers[event]?.filter(
                    subscriber => subscriber !== unsubscriber,
                ) as Subscribers[E];
            },
        };
    }

    publish<E extends keyof Events>(event: E) {
        return {
            withPayload: (payload: Events[E]) => {
                this.subscribers[event]?.forEach(subscriber => subscriber(payload));
            },
        };
    }
}

export { EventBus };
