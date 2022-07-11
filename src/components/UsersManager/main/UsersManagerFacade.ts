import { LoginUseCase } from './core/usecases/LoginUseCase/LoginUseCase';
import { LoginUseCaseRequest } from './core/usecases/LoginUseCase/LoginUseCaseRequest';

import { GetUserByIdUseCase } from './core/usecases/GetUserByIdUseCase/GetUserByIdUseCase';
import { GetUserByIdUseCaseRequest } from './core/usecases/GetUserByIdUseCase/GetUserByIdUseCaseRequest';

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

  login(request: LoginUseCaseRequest) {
    return new LoginUseCase(this.userAccountRepository, this.passwordEncryptor).handle(request);
  }

  register(request: RegisterUserUseCaseRequest) {
    return new RegisterUserUseCase(
      this.userAccountRepository,
      this.userIdGenerator,
      this.passwordEncryptor,
      this.wilayasService,
    ).handle(request);
  }

  getUserById(request: GetUserByIdUseCaseRequest) {
    return new GetUserByIdUseCase(this.userAccountRepository).handle(request);
  }
}

export { UsersManagerFacade };
