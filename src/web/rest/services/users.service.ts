import { Injectable } from '@nestjs/common';

import { LoginUseCaseRequest } from '../../../components/UsersManager/main/core/usecases/LoginUseCase/LoginUseCaseRequest';
import { RegisterUserUseCaseRequest } from '../../../components/UsersManager/main/core/usecases/RegisterUserUseCase/RegisterUserUseCaseRequest';

import { UsersManagerConfiguration } from '../../../components/UsersManager/main/UsersManagerConfiguration';
import { AuthenticationManagerConfiguration } from '../../../components/AuthenticationManager/main/AuthenticationManagerConfiguration';

@Injectable()
class UsersService {
  private readonly usersManager = UsersManagerConfiguration.aUsersManagerFacade();
  private readonly authenticationManager =
    AuthenticationManagerConfiguration.anAuthenticationManagerFacade();

  async login(loginBody: LoginUseCaseRequest) {
    const { userId } = await this.usersManager.login(loginBody);
    const { accessToken } = await this.authenticationManager.generateAccessToken({ userId });

    return { accessToken };
  }

  async register(registrationBody: RegisterUserUseCaseRequest) {
    const { userId } = await this.usersManager.register(registrationBody);
    const { accessToken } = await this.authenticationManager.generateAccessToken({ userId });

    return { accessToken };
  }
}

export { UsersService };
