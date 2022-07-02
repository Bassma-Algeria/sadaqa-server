import { UsersManagerFacade } from './UsersManagerFacade';

import { UuidUserIdGenerator } from './infra/real/UuidUserIdGenerator';
import { BcryptPasswordEncryptor } from './infra/real/BcryptPasswordEncryptor';
import { RegionsManagerWilayasService } from './infra/real/RegionsManagerWilayasService';
import { PostgresUserAccountRepository } from './infra/real/PostgresUserAccountRepository';

import { RegionsManagerConfiguration } from '../../RegionsManager/main/RegionsManagerConfiguration';

class UsersManagerConfiguration {
  static aUsersManagerFacade(): UsersManagerFacade {
    return new UsersManagerFacade(
      new PostgresUserAccountRepository(),
      new UuidUserIdGenerator(),
      new BcryptPasswordEncryptor(),
      new RegionsManagerWilayasService(RegionsManagerConfiguration.aRegionsManagerFacade()),
    );
  }
}

export { UsersManagerConfiguration };
