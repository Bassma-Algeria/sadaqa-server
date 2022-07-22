import { UsersManagerFacade } from '../../../../main/UsersManagerFacade';

import { FakeUsersEventBus } from '../../../../main/infra/fake/FakeUsersEventBus';
import { FakeWilayasService } from '../../../../main/infra/fake/FakeWilayasService';
import { FakeUserIdGenerator } from '../../../../main/infra/fake/FakeUserIdGenerator';
import { FakePasswordEncryptor } from '../../../../main/infra/fake/FakePasswordEncryptor';
import { InMemoryAssociationAccountRepository } from '../../../../main/infra/fake/InMemoryAssociationAccountRepository';
import { InMemoryRegularUserAccountRepository } from '../../../../main/infra/fake/InMemoryRegularUserAccountRepository';

import { UsersEventBus } from '../../../../main/core/domain/services/UsersEventBus';
import { WilayasService } from '../../../../main/core/domain/services/WilayasService';
import { UserIdGenerator } from '../../../../main/core/domain/services/UserIdGenerator';
import { PasswordEncryptor } from '../../../../main/core/domain/services/PasswordEncryptor';
import { AssociationAccountRepository } from '../../../../main/core/domain/services/AssociationAccountRepository';
import { RegularUserAccountRepository } from '../../../../main/core/domain/services/RegularUserAccountRepository';

interface Dependencies {
  readonly regularUserAccountRepository?: RegularUserAccountRepository;
  readonly userIdGenerator?: UserIdGenerator;
  readonly passwordEncryptor?: PasswordEncryptor;
  readonly wilayasService?: WilayasService;
  readonly associationAccountRepository?: AssociationAccountRepository;
  readonly usersEventBus?: UsersEventBus;
}

const aUsersManagerFacade = (dependencies?: Dependencies) => {
  return new UsersManagerFacade(
    dependencies?.regularUserAccountRepository || new InMemoryRegularUserAccountRepository(),
    dependencies?.userIdGenerator || new FakeUserIdGenerator(),
    dependencies?.passwordEncryptor || new FakePasswordEncryptor(),
    dependencies?.wilayasService || new FakeWilayasService(),
    dependencies?.associationAccountRepository || new InMemoryAssociationAccountRepository(),
    dependencies?.usersEventBus || new FakeUsersEventBus(),
  );
};

export { aUsersManagerFacade };
