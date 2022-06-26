import { LoginUseCase } from './core/usecases/LoginUseCase/LoginUseCase';
import { LoginUseCaseRequest } from './core/usecases/LoginUseCase/LoginUseCaseRequest';

import { RegisterUserUseCase } from './core/usecases/RegisterUserUseCase/RegisterUserUseCase';
import { RegisterUserUseCaseRequest } from './core/usecases/RegisterUserUseCase/RegisterUserUseCaseRequest';

import { UserIdGenerator } from './core/domain/UserIdGenerator';
import { UsersRepository } from './core/domain/UsersRepository';
import { PasswordEncryptor } from './core/domain/PasswordEncryptor';

class UsersManagerFacade {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userIdGenerator: UserIdGenerator,
    private readonly passwordEncryptor: PasswordEncryptor,
  ) {}

  async login(request: LoginUseCaseRequest) {
    return new LoginUseCase(this.usersRepository, this.passwordEncryptor).handle(request);
  }

  async register(request: RegisterUserUseCaseRequest) {
    return new RegisterUserUseCase(
      this.usersRepository,
      this.userIdGenerator,
      this.passwordEncryptor,
    ).handle(request);
  }
}

export { UsersManagerFacade };
