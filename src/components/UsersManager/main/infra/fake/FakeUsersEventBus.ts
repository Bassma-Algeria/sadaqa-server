import { UsersEventBus } from '../../core/domain/services/UsersEventBus';

class FakeUsersEventBus implements UsersEventBus {
  publishAssociationRegisteredEvent(): void {
    // ...
  }

  publishRegularUserRegisteredEvent(): void {
    // ...
  }

  publishUserLoginEvent(): void {
    // ...
  }
}

export { FakeUsersEventBus };
