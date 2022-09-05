import Sinon from 'sinon';
import { expect } from 'chai';

import { InMemoryEventBus } from '../main/InMemoryEventBus';

describe('Event Bus', () => {
    const eventBus = InMemoryEventBus.instance();

    it('given some subscribers to an event, when that event published, then notify all of them', () => {
        const subscriber = Sinon.spy();
        const subscriber2 = Sinon.spy();

        const payload: any = {};

        eventBus.subscribeTo('DONATION_POST_CREATED').by(subscriber);
        eventBus.subscribeTo('DONATION_POST_CREATED').by(subscriber2);

        eventBus.publish('DONATION_POST_CREATED').withPayload(payload);

        expect(subscriber.calledOnce).to.equal(true);
        expect(subscriber2.calledOnce).to.equal(true);

        expect(subscriber.calledWith(payload)).to.equal(true);
    });

    it('given a subscriber of an event, when that subscriber unsubscribe from that event, then do not notify him again', () => {
        const subscriber = Sinon.spy();

        const payload: any = {};

        eventBus.subscribeTo('DONATION_POST_CREATED').by(subscriber);

        eventBus.unsubscribeFrom('DONATION_POST_CREATED').by(subscriber);

        eventBus.publish('DONATION_POST_CREATED').withPayload(payload);

        expect(subscriber.calledOnce).to.equal(false);
    });

    it('given a subscriber to all events, when any event occurs, then notify that subscriber', () => {
        const subscriber = Sinon.spy();

        eventBus.subscribeToAllEvents().by(subscriber);

        const payload1: any = {};
        const payload2: any = {};
        eventBus.publish('USER_START_TYPING').withPayload(payload1);
        eventBus.publish('DONATION_POST_CREATED').withPayload(payload2);

        expect(subscriber.calledTwice).to.equal(true);
        expect(subscriber.args[0][0]).to.equal('USER_START_TYPING');
        expect(subscriber.args[0][1]).to.equal(payload1);

        expect(subscriber.args[1][0]).to.equal('DONATION_POST_CREATED');
        expect(subscriber.args[1][1]).to.equal(payload2);
    });
});
