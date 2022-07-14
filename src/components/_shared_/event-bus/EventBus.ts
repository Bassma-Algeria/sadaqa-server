import { Events } from './Events';

type Subscribers<E extends keyof Events> = {
  [Key in E]: Array<(payload: Events[Key]) => void>;
};

class EventBus {
  private readonly subscribers: Subscribers<keyof Events> = {
    NEW_DONATION_CREATED: [],
  };

  subscribeTo<E extends keyof Events>(event: E) {
    return {
      by: (subscriber: (payload: Events[E]) => void) => {
        this.subscribers[event].push(subscriber);
      },
    };
  }

  unsubscribeFrom<E extends keyof Events>(event: E) {
    return {
      by: (unsubscriber: (payload: Events[E]) => void) => {
        this.subscribers[event] = this.subscribers[event].filter(
          subscriber => subscriber !== unsubscriber,
        );
      },
    };
  }

  publish<E extends keyof Events>(event: E) {
    return {
      withPayload: (payload: Events[E]) => {
        this.subscribers[event].forEach(subscriber => subscriber(payload));
      },
    };
  }
}

const eventBus = new EventBus();

export { EventBus, eventBus };
