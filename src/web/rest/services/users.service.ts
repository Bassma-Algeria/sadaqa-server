import { Injectable } from '@nestjs/common';

import { LoginUseCaseRequest } from '../../../components/UsersManager/main/core/usecases/LoginUseCase/LoginUseCaseRequest';
import { GetRegularUserByIdUseCaseRequest } from '../../../components/UsersManager/main/core/usecases/GetRegularUserByIdUseCase/GetRegularUserByIdUseCaseRequest';
import { GetAssociationByIdUseCaseRequest } from '../../../components/UsersManager/main/core/usecases/GetAssociationByIdUseCase/GetAssociationByIdUseCaseRequest';
import { RegisterRegularUserUseCaseRequest } from '../../../components/UsersManager/main/core/usecases/RegisterRegularUserUseCase/RegisterRegularUserUseCaseRequest';
import { RegisterAssociationUseCaseRequest } from '../../../components/UsersManager/main/core/usecases/RegisterAssociationUseCase/RegisterAssociationUseCaseRequest';

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

  async registerRegularUser(registrationBody: RegisterRegularUserUseCaseRequest) {
    const { regularUserId } = await this.usersManager.registerRegularUser(registrationBody);
    const { accessToken } = await this.authenticationManager.generateAccessToken({
      userId: regularUserId,
    });

    return { accessToken };
  }

  async getAuthenticatedRegularUser(accessToken: string) {
    const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });

    return this.getRegularUserById({ regularUserId: userId });
  }

  getRegularUserById(request: GetRegularUserByIdUseCaseRequest) {
    return this.usersManager.getRegularUserById(request);
  }

  async registerAssociation(registrationBody: RegisterAssociationUseCaseRequest) {
    const { associationId } = await this.usersManager.registerAssociation(registrationBody);
    const { accessToken } = await this.authenticationManager.generateAccessToken({
      userId: associationId,
    });

    return { accessToken };
  }

  async getAuthenticatedAssociation(accessToken: string) {
    const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });

    return this.getAssociationById({ associationId: userId });
  }

  async getAssociationById(request: GetAssociationByIdUseCaseRequest) {
    return this.usersManager.getAssociationById(request);
  }
}


export { UsersService };
