import { Injectable } from '@nestjs/common';

import { ActivateAssociationAccountUseCaseRequest } from '../../../components/UsersManager/main/core/usecases/ActivateAssociationAccountUseCase/ActivateAssociationAccountUseCaseRequest';

import { UsersManagerConfiguration } from '../../../components/UsersManager/main/UsersManagerConfiguration';

@Injectable()
class AdminService {
  private readonly usersManager = UsersManagerConfiguration.aUsersManagerFacade();

  async activateAssociation(
    adminPassword: string,
    request: ActivateAssociationAccountUseCaseRequest,
  ) {
    if (adminPassword !== process.env.ADMIN_PASSWORD) throw new InvalidAdminPasswordException();

    return this.usersManager.activateAssociationAccount(request);
  }
}

class InvalidAdminPasswordException extends Error {
  constructor() {
    super('invalid admin password');
  }
}

export { AdminService, InvalidAdminPasswordException };