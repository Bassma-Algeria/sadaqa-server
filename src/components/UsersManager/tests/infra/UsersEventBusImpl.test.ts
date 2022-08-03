import { anything, instance, mock, verify, when } from 'ts-mockito';

import { anAssociationAccount } from './base/anAssociationAccount';
import { AssociationDocs } from '../../main/core/domain/AssociationDocs';

import { UsersEventBusImpl } from '../../main/infra/real/UsersEventBusImpl';

import { EventBus } from '../../../_shared_/event-bus/EventBus';
import { aRegularUserAccount } from './base/aRegularUserAccount';
import { UserId } from '../../main/core/domain/UserId';
import { faker } from '@faker-js/faker';

describe('UsersEventBusImpl', () => {
    const eventBusMock = mock<EventBus>();
    const usersEventBus = new UsersEventBusImpl(instance(eventBusMock));

    before(() => {
        when(eventBusMock.publish(anything())).thenReturn({
            withPayload: (data: any) => {},
        });
    });

    it('should publish a NEW_ASSOCIATION_REGISTERED event', () => {
        usersEventBus.publishAssociationRegisteredEvent({
            associationAccount: anAssociationAccount(),
            associationDocs: new AssociationDocs([Buffer.alloc(10)]),
        });

        verify(eventBusMock.publish('ASSOCIATION_REGISTERED')).called();
    });

    it('should publish a NEW_REGULAR_USER_REGISTERED event', () => {
        usersEventBus.publishRegularUserRegisteredEvent(aRegularUserAccount());

        verify(eventBusMock.publish('REGULAR_USER_REGISTERED')).called();
    });

    it('should publish a NEW_USER_LOGIN event', () => {
        usersEventBus.publishUserLoginEvent(new UserId(faker.datatype.uuid()));

        verify(eventBusMock.publish('USER_LOGIN')).called();
    });
});
