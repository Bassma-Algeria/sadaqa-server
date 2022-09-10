import { Injectable } from '@nestjs/common';

import { ActivateAssociationAccountUseCaseRequest } from '../../../../components/UsersManager/main/core/usecases/ActivateAssociationAccountUseCase/ActivateAssociationAccountUseCaseRequest';

import { UsersManagerConfiguration } from '../../../../components/UsersManager/main/UsersManagerConfiguration';

import { Service } from './base/base.service';

@Injectable()
class AdminService extends Service {
    private readonly usersManager = UsersManagerConfiguration.aUsersManager();

    async activateAssociation(
        adminPassword: string,
        request: ActivateAssociationAccountUseCaseRequest,
    ) {
        try {
            if (adminPassword !== process.env.ADMIN_PASSWORD)
                throw new InvalidAdminPasswordException();

            return await this.usersManager.activateAssociationAccount(request);
        } catch (e) {
            await this.logError('Error while activating association', e);

            throw e;
        }
    }
}

class InvalidAdminPasswordException extends Error {
    constructor() {
        super('invalid admin password');
    }
}

export { AdminService, InvalidAdminPasswordException };
