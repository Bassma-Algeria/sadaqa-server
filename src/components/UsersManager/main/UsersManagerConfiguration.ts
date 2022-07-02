import { UsersManagerFacade } from './UsersManagerFacade';

import { UuidUserIdGenerator } from './infra/real/UuidUserIdGenerator';
import { BcryptPasswordEncryptor } from './infra/real/BcryptPasswordEncryptor';
import { RegionsManagerWilayasService } from './infra/real/RegionsManagerWilayasService';
import { InMemoryUserAccountRepository } from './infra/fake/InMemoryUserAccountRepository';

import { RegionsManagerConfiguration } from '../../RegionsManager/main/RegionsManagerConfiguration';

class UsersManagerConfiguration {
  static aUsersManagerFacade(): UsersManagerFacade {
    return new UsersManagerFacade(
      new InMemoryUserAccountRepository(),
      new UuidUserIdGenerator(),
      new BcryptPasswordEncryptor(),
      new RegionsManagerWilayasService(RegionsManagerConfiguration.aRegionsManagerFacade()),
    );
  }
}

export { UsersManagerConfiguration };
