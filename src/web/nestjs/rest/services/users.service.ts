import { Injectable } from '@nestjs/common';

import { LoginUseCaseRequest } from '../../../../components/UsersManager/main/core/usecases/LoginUseCase/LoginUseCaseRequest';
import { GetAccountByIdUseCaseRequest } from '../../../../components/UsersManager/main/core/usecases/GetAccountByIdUseCase/GetAccountByIdUseCaseRequest';
import { RegisterRegularUserUseCaseRequest } from '../../../../components/UsersManager/main/core/usecases/RegisterUseCases/RegisterRegularUserUseCase/RegisterRegularUserUseCaseRequest';
import { RegisterAssociationUseCaseRequest } from '../../../../components/UsersManager/main/core/usecases/RegisterUseCases/RegisterAssociationUseCase/RegisterAssociationUseCaseRequest';
import { EditAssociationAccountInfoUseCaseRequest } from '../../../../components/UsersManager/main/core/usecases/EditAccountInfoUseCases/EditAssociationAccountInfoUseCase/EditAssociationAccountInfoUseCaseRequest';
import { EditRegularUserAccountInfoUseCaseRequest } from '../../../../components/UsersManager/main/core/usecases/EditAccountInfoUseCases/EditRegularUserAccountInfoUseCase/EditRegularUserAccountInfoUseCaseRequest';
import { EditAssociationAccountCredentialsUseCaseRequest } from '../../../../components/UsersManager/main/core/usecases/EditAccountCredentialsUseCases/EditAssociationAccountCredentialsUseCase/EditAssociationAccountCredentialsUseCaseRequest';
import { EditRegularUserAccountCredentialsUseCaseRequest } from '../../../../components/UsersManager/main/core/usecases/EditAccountCredentialsUseCases/EditRegularUseAccountCredentialsUseCase/EditRegularUserAccountCredentialsUseCaseRequest';

import { UsersManagerConfiguration } from '../../../../components/UsersManager/main/UsersManagerConfiguration';
import { AuthenticationManagerConfiguration } from '../../../../components/AuthenticationManager/main/AuthenticationManagerConfiguration';

import { Service } from './base/base.service';

@Injectable()
class UsersService extends Service {
    private readonly usersManager = UsersManagerConfiguration.aUsersManager();
    private readonly authenticationManager =
        AuthenticationManagerConfiguration.anAuthenticationManager();

    async login(loginBody: LoginUseCaseRequest) {
        try {
            const { accountId, type } = await this.usersManager.login(loginBody);
            const { accessToken } = await this.authenticationManager.generateAccessToken({
                userId: accountId,
            });

            return { type, accessToken };
        } catch (e) {
            await this.logError('Error while login', e);

            throw e;
        }
    }

    async registerRegularUser(registrationBody: RegisterRegularUserUseCaseRequest) {
        try {
            const { accountId } = await this.usersManager.registerRegularUser(registrationBody);
            const { accessToken } = await this.authenticationManager.generateAccessToken({
                userId: accountId,
            });

            return { accessToken };
        } catch (e) {
            await this.logError('Error while regular user registration', e);

            throw e;
        }
    }

    async getAuthenticatedRegularUser(accessToken: string) {
        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });

            return await this.getRegularUserById({ accountId: userId });
        } catch (e) {
            await this.logError('Error while getting auth regular user', e);

            throw e;
        }
    }

    async getRegularUserById(request: GetAccountByIdUseCaseRequest) {
        try {
            return await this.usersManager.getRegularUserById(request);
        } catch (e) {
            await this.logError('Error while getting regular user by id', e);

            throw e;
        }
    }

    async registerAssociation(registrationBody: RegisterAssociationUseCaseRequest) {
        try {
            const { accountId } = await this.usersManager.registerAssociation(registrationBody);
            const { accessToken } = await this.authenticationManager.generateAccessToken({
                userId: accountId,
            });

            return { accessToken };
        } catch (e) {
            await this.logError('Error while association registration', e);

            throw e;
        }
    }

    async getAuthenticatedAssociation(accessToken: string) {
        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });

            return await this.getAssociationById({ accountId: userId });
        } catch (e) {
            await this.logError('Error while getting auth association', e);

            throw e;
        }
    }

    async getAssociationById(request: GetAccountByIdUseCaseRequest) {
        try {
            return await this.usersManager.getAssociationById(request);
        } catch (e) {
            await this.logError('Error while getting association by id', e);

            throw e;
        }
    }

    async editAssociationInfo(
        accessToken: string,
        request: Omit<EditAssociationAccountInfoUseCaseRequest, 'accountId'>,
    ) {
        try {
            const { userId: accountId } = await this.authenticationManager.decodeAccessToken({
                accessToken,
            });

            return await this.usersManager.editAssociationAccountInfo({ ...request, accountId });
        } catch (e) {
            await this.logError('Error while editing association info', e);

            throw e;
        }
    }

    async editAssociationCredentials(
        accessToken: string,
        request: Omit<EditAssociationAccountCredentialsUseCaseRequest, 'accountId'>,
    ) {
        try {
            const { userId: accountId } = await this.authenticationManager.decodeAccessToken({
                accessToken,
            });

            return await this.usersManager.editAssociationAccountCredentials({
                ...request,
                accountId,
            });
        } catch (e) {
            await this.logError('Error while editing association credentials', e);

            throw e;
        }
    }

    async editRegularUserInfo(
        accessToken: string,
        request: Omit<EditRegularUserAccountInfoUseCaseRequest, 'accountId'>,
    ) {
        try {
            const { userId: accountId } = await this.authenticationManager.decodeAccessToken({
                accessToken,
            });

            return await this.usersManager.editRegularUserAccountInfo({ ...request, accountId });
        } catch (e) {
            await this.logError('Error while editing regular user info', e);

            throw e;
        }
    }

    async editRegularUserCredentials(
        accessToken: string,
        request: Omit<EditRegularUserAccountCredentialsUseCaseRequest, 'accountId'>,
    ) {
        try {
            const { userId: accountId } = await this.authenticationManager.decodeAccessToken({
                accessToken,
            });

            return await this.usersManager.editRegularUserAccountCredentials({
                ...request,
                accountId,
            });
        } catch (e) {
            await this.logError('Error while editing regular user credentials', e);

            throw e;
        }
    }

    async getOnlineUsers() {
        try {
            return await this.usersManager.getOnlineUsersList();
        } catch (e) {
            await this.logError('Error while editing getting online users', e);

            throw e;
        }
    }
}

export { UsersService };
