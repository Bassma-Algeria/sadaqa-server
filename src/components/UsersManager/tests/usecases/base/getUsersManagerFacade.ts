import { UsersManagerFacade } from '../../../main/UsersManagerFacade';

import { FakeWilayasService } from '../../../main/infra/fake/FakeWilayasService';
import { FakeUserIdGenerator } from '../../../main/infra/fake/FakeUserIdGenerator';
import { FakePasswordEncryptor } from '../../../main/infra/fake/FakePasswordEncryptor';
import { InMemoryUserAccountRepository } from '../../../main/infra/fake/InMemoryUserAccountRepository';

import { WilayasService } from '../../../main/core/domain/services/WilayasService';
import { UserIdGenerator } from '../../../main/core/domain/services/UserIdGenerator';
import { PasswordEncryptor } from '../../../main/core/domain/services/PasswordEncryptor';
import { UserAccountRepository } from '../../../main/core/domain/services/UserAccountRepository';

interface Dependencies {
  readonly userAccountRepository?: UserAccountRepository;
  readonly userIdGenerator?: UserIdGenerator;
  readonly passwordEncryptor?: PasswordEncryptor;
  readonly wilayasService?: WilayasService;
}

const getUsersManagerFacade = (dependencies?: Dependencies) => {
  return new UsersManagerFacade(
    dependencies?.userAccountRepository || new InMemoryUserAccountRepository(),
    dependencies?.userIdGenerator || new FakeUserIdGenerator(),
    dependencies?.passwordEncryptor || new FakePasswordEncryptor(),
    dependencies?.wilayasService || new FakeWilayasService(),
  );
};

export { getUsersManagerFacade };
