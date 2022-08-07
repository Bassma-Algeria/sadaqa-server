import { Injectable } from '@nestjs/common';

import { EnableAssociationAccountUseCaseRequest } from '../../../components/UsersManager/main/core/usecases/EnableAssociationAccountUseCase/EnableAssociationAccountUseCaseRequest';

import { UsersManagerConfiguration } from '../../../components/UsersManager/main/UsersManagerConfiguration';

@Injectable()
class AdminService {
    private readonly usersManager = UsersManagerConfiguration.aUsersManagerFacade();

    async activateAssociation(
        adminPassword: string,
        request: EnableAssociationAccountUseCaseRequest,
    ) {
        if (adminPassword !== process.env.ADMIN_PASSWORD) throw new InvalidAdminPasswordException();

        return this.usersManager.enableAssociationAccount(request);
    }
}

class InvalidAdminPasswordException extends Error {
    constructor() {
        super('invalid admin password');
    }
}

export { AdminService, InvalidAdminPasswordException };
