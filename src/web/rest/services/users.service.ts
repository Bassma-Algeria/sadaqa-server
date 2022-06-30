import { Injectable } from '@nestjs/common';

import { LoginUseCaseRequest } from '../../../components/UsersManager/main/core/usecases/LoginUseCase/LoginUseCaseRequest';
import { RegisterUserUseCaseRequest } from '../../../components/UsersManager/main/core/usecases/RegisterUserUseCase/RegisterUserUseCaseRequest';

import { UsersManagerConfiguration } from '../../../components/UsersManager/main/UsersManagerConfiguration';

@Injectable()
class UsersService {
  private readonly usersManager = UsersManagerConfiguration.aUsersManagerFacade();

  login(loginBody: LoginUseCaseRequest) {
    return this.usersManager.login(loginBody);
  }

  register(registrationBody: RegisterUserUseCaseRequest) {
    return this.usersManager.register(registrationBody);
  }
}

export { UsersService };
