import { UsersManagerFacade } from './UsersManagerFacade';

import { FakeWilayasService } from './infra/fake/FakeWilayasService';
import { UuidUserIdGenerator } from './infra/real/UuidUserIdGenerator';
import { BcryptPasswordEncryptor } from './infra/real/BcryptPasswordEncryptor';
import { InMemoryUserAccountRepository } from './infra/fake/InMemoryUserAccountRepository';

class UsersManagerConfiguration {
  static aUsersManagerFacade(): UsersManagerFacade {
    return new UsersManagerFacade(
      new InMemoryUserAccountRepository(),
      new UuidUserIdGenerator(),
      new BcryptPasswordEncryptor(),
      new FakeWilayasService(),
    );
  }
}

export { UsersManagerConfiguration };
