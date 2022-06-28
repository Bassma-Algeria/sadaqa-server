import { UsersManagerFacade } from './UsersManagerFacade';

import { WilayasService } from './core/domain/services/WilayasService';
import { UserAccountRepository } from './core/domain/services/UserAccountRepository';
import { UserIdGenerator } from './core/domain/services/UserIdGenerator';
import { PasswordEncryptor } from './core/domain/services/PasswordEncryptor';

import { FakeWilayasService } from './infra/fake/FakeWilayasService';
import { FakeUserIdGenerator } from './infra/fake/FakeUserIdGenerator';
import { FakePasswordEncryptor } from './infra/fake/FakePasswordEncryptor';
import { InMemoryUserAccountRepository } from './infra/fake/InMemoryUserAccountRepository';

class UsersManagerConfiguration {
  constructor(
    private readonly userAccountRepository?: UserAccountRepository,
    private readonly passwordEncryptor?: PasswordEncryptor,
    private readonly userIdGenerator?: UserIdGenerator,
    private readonly wilayasService?: WilayasService,
  ) {}

  aUsersManagerFacade(): UsersManagerFacade {
    return new UsersManagerFacade(
      this.userAccountRepository || new InMemoryUserAccountRepository(),
      this.userIdGenerator || new FakeUserIdGenerator(),
      this.passwordEncryptor || new FakePasswordEncryptor(),
      this.wilayasService || new FakeWilayasService(),
    );
  }
}

export { UsersManagerConfiguration };
