import { UsersEventBus } from '../../core/domain/services/UsersEventBus';

import { UserId } from '../../core/domain/UserId';
import { AssociationDocs } from '../../core/domain/AssociationDocs';
import { RegularUserAccount } from '../../core/domain/RegularUserAccount';
import { AssociationAccount } from '../../core/domain/AssociationAccount';

import { EventBus } from '../../../../_shared_/event-bus/EventBus';

class UsersEventBusImpl implements UsersEventBus {
  constructor(private readonly eventBus: EventBus) {}

  publishAssociationRegisteredEvent(payload: {
    associationAccount: AssociationAccount;
    associationDocs: AssociationDocs;
  }): void {
    this.eventBus.publish('ASSOCIATION_REGISTERED').withPayload({
      associationId: payload.associationAccount.associationId.value(),
      wilayaNumber: payload.associationAccount.wilayaNumber.value(),
      associationName: payload.associationAccount.associationName.value(),
      password: payload.associationAccount.password.value(),
      phoneNumber: payload.associationAccount.phone.value(),
      email: payload.associationAccount.email.value(),
      active: payload.associationAccount.active,
      createdAt: payload.associationAccount.createdAt,
      associationDocs: payload.associationDocs.docs(),
    });
  }

  publishRegularUserRegisteredEvent(regularUser: RegularUserAccount): void {
    this.eventBus.publish('REGULAR_USER_REGISTERED').withPayload({
      userId: regularUser.userId.value(),
      firstName: regularUser.firstName.value(),
      lastName: regularUser.lastName.value(),
      wilayaNumber: regularUser.wilayaNumber.value(),
      phoneNumber: regularUser.phone.value(),
      email: regularUser.email.value(),
      password: regularUser.password.value(),
      createdAt: regularUser.createdAt,
    });
  }

  publishUserLoginEvent(userId: UserId): void {
    this.eventBus.publish('USER_LOGIN').withPayload({ userId: userId.value() });
  }
}

export { UsersEventBusImpl };
