import Sinon from 'sinon';
import { expect } from 'chai';

import { EventBus } from '../../src/components/_shared_/event-bus/EventBus';

describe('EventBus', () => {
    const eventBus = EventBus.getInstance();

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
});
