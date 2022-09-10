import { Events } from './Events';

export type EventSubscriber<E extends keyof Events> = (payload: Events[E]) => void;

export type AllEventsSubscriber<E extends keyof Events> = (event: E, payload: Events[E]) => void;

export interface EventBus {
    publish<E extends keyof Events>(event: E): { withPayload(payload: Events[E]): void };

    subscribeTo<E extends keyof Events>(e: E): { by(subscriber: EventSubscriber<E>): void };

    unsubscribeFrom<E extends keyof Events>(e: E): { by(subscriber: EventSubscriber<E>): void };

    subscribeToAllEvents<E extends keyof Events>(): {
        by(subscriber: AllEventsSubscriber<E>): { excluding: (events: E[]) => void };
    };
}
