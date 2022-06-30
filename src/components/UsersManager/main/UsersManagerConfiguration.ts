import { FakePasswordEncryptor } from './infra/fake/FakePasswordEncryptor';
import { FakeUserIdGenerator } from './infra/fake/FakeUserIdGenerator';
import { FakeWilayasService } from './infra/fake/FakeWilayasService';
import { InMemoryUserAccountRepository } from './infra/fake/InMemoryUserAccountRepository';
import { UsersManagerFacade } from './UsersManagerFacade';

class UsersManagerConfiguration {
  static aUsersManagerFacade(): UsersManagerFacade {
    return new UsersManagerFacade(
      new InMemoryUserAccountRepository(),
      new FakeUserIdGenerator(),
      new FakePasswordEncryptor(),
      new FakeWilayasService(),
    );
  }
}

export { UsersManagerConfiguration };
