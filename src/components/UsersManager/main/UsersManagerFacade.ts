import { LoginUseCase } from './core/usecases/LoginUseCase/LoginUseCase';
import { LoginUseCaseRequest } from './core/usecases/LoginUseCase/LoginUseCaseRequest';

import { RegisterUserUseCase } from './core/usecases/RegisterUserUseCase/RegisterUserUseCase';
import { RegisterUserUseCaseRequest } from './core/usecases/RegisterUserUseCase/RegisterUserUseCaseRequest';

import { WilayasService } from './core/domain/services/WilayasService';
import { UserIdGenerator } from './core/domain/services/UserIdGenerator';
import { PasswordEncryptor } from './core/domain/services/PasswordEncryptor';
import { UserAccountRepository } from './core/domain/services/UserAccountRepository';

class UsersManagerFacade {
  constructor(
    private readonly userAccountRepository: UserAccountRepository,
    private readonly userIdGenerator: UserIdGenerator,
    private readonly passwordEncryptor: PasswordEncryptor,
    private readonly wilayasService: WilayasService,
  ) {}

  async login(request: LoginUseCaseRequest) {
    return new LoginUseCase(this.userAccountRepository, this.passwordEncryptor).handle(request);
  }

  async register(request: RegisterUserUseCaseRequest) {
    return new RegisterUserUseCase(
      this.userAccountRepository,
      this.userIdGenerator,
      this.passwordEncryptor,
      this.wilayasService,
    ).handle(request);
  }
}

export { UsersManagerFacade };
