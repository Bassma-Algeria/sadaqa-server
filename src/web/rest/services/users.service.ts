import { Injectable } from '@nestjs/common';

import { LoginUseCaseRequest } from '../../../components/UsersManager/main/core/usecases/LoginUseCase/LoginUseCaseRequest';
import { GetAccountByIdUseCaseRequest } from '../../../components/UsersManager/main/core/usecases/GetAccountByIdUseCase/GetAccountByIdUseCaseRequest';
import { RegisterRegularUserUseCaseRequest } from '../../../components/UsersManager/main/core/usecases/RegisterUseCases/RegisterRegularUserUseCase/RegisterRegularUserUseCaseRequest';
import { RegisterAssociationUseCaseRequest } from '../../../components/UsersManager/main/core/usecases/RegisterUseCases/RegisterAssociationUseCase/RegisterAssociationUseCaseRequest';
import { EditAssociationAccountInfoUseCaseRequest } from '../../../components/UsersManager/main/core/usecases/EditAccountInfoUseCases/EditAssociationAccountInfoUseCase/EditAssociationAccountInfoUseCaseRequest';
import { EditRegularUserAccountInfoUseCaseRequest } from '../../../components/UsersManager/main/core/usecases/EditAccountInfoUseCases/EditRegularUserAccountInfoUseCase/EditRegularUserAccountInfoUseCaseRequest';
import { EditAssociationAccountCredentialsUseCaseRequest } from '../../../components/UsersManager/main/core/usecases/EditAccountCredentialsUseCases/EditAssociationAccountCredentialsUseCase/EditAssociationAccountCredentialsUseCaseRequest';
import { EditRegularUserAccountCredentialsUseCaseRequest } from '../../../components/UsersManager/main/core/usecases/EditAccountCredentialsUseCases/EditRegularUseAccountCredentialsUseCase/EditRegularUserAccountCredentialsUseCaseRequest';

import { UsersManagerConfiguration } from '../../../components/UsersManager/main/UsersManagerConfiguration';
import { AuthenticationManagerConfiguration } from '../../../components/AuthenticationManager/main/AuthenticationManagerConfiguration';

@Injectable()
class UsersService {
    private readonly usersManager = UsersManagerConfiguration.aUsersManager();
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

    async editAssociationInfo(
        accessToken: string,
        request: Omit<EditAssociationAccountInfoUseCaseRequest, 'accountId'>,
    ) {
        const { userId: accountId } = await this.authenticationManager.decodeAccessToken({
            accessToken,
        });

        return this.usersManager.editAssociationAccountInfo({ ...request, accountId });
    }

    async editAssociationCredentials(
        accessToken: string,
        request: Omit<EditAssociationAccountCredentialsUseCaseRequest, 'accountId'>,
    ) {
        const { userId: accountId } = await this.authenticationManager.decodeAccessToken({
            accessToken,
        });

        return this.usersManager.editAssociationAccountCredentials({ ...request, accountId });
    }

    async editRegularUserInfo(
        accessToken: string,
        request: Omit<EditRegularUserAccountInfoUseCaseRequest, 'accountId'>,
    ) {
        const { userId: accountId } = await this.authenticationManager.decodeAccessToken({
            accessToken,
        });

        return this.usersManager.editRegularUserAccountInfo({ ...request, accountId });
    }

    async editRegularUserCredentials(
        accessToken: string,
        request: Omit<EditRegularUserAccountCredentialsUseCaseRequest, 'accountId'>,
    ) {
        const { userId: accountId } = await this.authenticationManager.decodeAccessToken({
            accessToken,
        });

        return this.usersManager.editRegularUserAccountCredentials({ ...request, accountId });
    }
}

export { UsersService };
