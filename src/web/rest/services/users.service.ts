import { Injectable } from '@nestjs/common';

import { LoginUseCaseRequest } from '../../../components/UsersManager/main/core/usecases/LoginUseCase/LoginUseCaseRequest';
import { GetAccountByIdUseCaseRequest } from '../../../components/UsersManager/main/core/usecases/GetAccountByIdUseCase/GetAccountByIdUseCaseRequest';
import { RegisterRegularUserUseCaseRequest } from '../../../components/UsersManager/main/core/usecases/RegisterUseCases/RegisterRegularUserUseCase/RegisterRegularUserUseCaseRequest';
import { RegisterAssociationUseCaseRequest } from '../../../components/UsersManager/main/core/usecases/RegisterUseCases/RegisterAssociationUseCase/RegisterAssociationUseCaseRequest';

import { UsersManagerConfiguration } from '../../../components/UsersManager/main/UsersManagerConfiguration';
import { AuthenticationManagerConfiguration } from '../../../components/AuthenticationManager/main/AuthenticationManagerConfiguration';

@Injectable()
class UsersService {
    private readonly usersManager = UsersManagerConfiguration.aUsersManagerFacade();
    private readonly authenticationManager =
        AuthenticationManagerConfiguration.anAuthenticationManager();

    async login(loginBody: LoginUseCaseRequest) {
        const { accountId } = await this.usersManager.login(loginBody);
        const { accessToken } = await this.authenticationManager.generateAccessToken({
            userId: accountId,
        });

        return { accessToken };
    }

    async registerRegularUser(registrationBody: RegisterRegularUserUseCaseRequest) {
        const { accountId } = await this.usersManager.registerRegularUser(registrationBody);
        const { accessToken } = await this.authenticationManager.generateAccessToken({
            userId: accountId,
        });

        return { accessToken };
    }

    async getAuthenticatedRegularUser(accessToken: string) {
        const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });

        return this.getRegularUserById({ accountId: userId });
    }

    getRegularUserById(request: GetAccountByIdUseCaseRequest) {
        return this.usersManager.getRegularUserById(request);
    }

    async registerAssociation(registrationBody: RegisterAssociationUseCaseRequest) {
        const { accountId } = await this.usersManager.registerAssociation(registrationBody);
        const { accessToken } = await this.authenticationManager.generateAccessToken({
            userId: accountId,
        });

        return { accessToken };
    }

    async getAuthenticatedAssociation(accessToken: string) {
        const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });

        return this.getAssociationById({ accountId: userId });
    }

    async getAssociationById(request: GetAccountByIdUseCaseRequest) {
        return this.usersManager.getAssociationById(request);
    }
}

export { UsersService };
