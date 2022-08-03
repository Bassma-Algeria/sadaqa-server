import { LoginUseCase } from './core/usecases/LoginUseCase/LoginUseCase';
import { LoginUseCaseRequest } from './core/usecases/LoginUseCase/LoginUseCaseRequest';

import { GetRegularUserByIdUseCase } from './core/usecases/GetRegularUserByIdUseCase/GetRegularUserByIdUseCase';
import { GetRegularUserByIdUseCaseRequest } from './core/usecases/GetRegularUserByIdUseCase/GetRegularUserByIdUseCaseRequest';

import { RegisterRegularUserUseCase } from './core/usecases/RegisterRegularUserUseCase/RegisterRegularUserUseCase';
import { RegisterRegularUserUseCaseRequest } from './core/usecases/RegisterRegularUserUseCase/RegisterRegularUserUseCaseRequest';

import { RegisterAssociationUseCase } from './core/usecases/RegisterAssociationUseCase/RegisterAssociationUseCase';
import { RegisterAssociationUseCaseRequest } from './core/usecases/RegisterAssociationUseCase/RegisterAssociationUseCaseRequest';

import { GetAssociationByIdUseCase } from './core/usecases/GetAssociationByIdUseCase/GetAssociationByIdUseCase';
import { GetAssociationByIdUseCaseRequest } from './core/usecases/GetAssociationByIdUseCase/GetAssociationByIdUseCaseRequest';

import { UsersEventBus } from './core/domain/services/UsersEventBus';
import { WilayasService } from './core/domain/services/WilayasService';
import { UserIdGenerator } from './core/domain/services/UserIdGenerator';
import { PasswordEncryptor } from './core/domain/services/PasswordEncryptor';
import { RegularUserAccountRepository } from './core/domain/services/RegularUserAccountRepository';
import { AssociationAccountRepository } from './core/domain/services/AssociationAccountRepository';
import { ActivateAssociationAccountUseCaseRequest } from './core/usecases/ActivateAssociationAccountUseCase/ActivateAssociationAccountUseCaseRequest';
import { ActivateAssociationAccountUseCase } from './core/usecases/ActivateAssociationAccountUseCase/ActivateAssociationAccountUseCase';

class UsersManagerFacade {
    constructor(
        private readonly regularUserAccountRepository: RegularUserAccountRepository,
        private readonly userIdGenerator: UserIdGenerator,
        private readonly passwordEncryptor: PasswordEncryptor,
        private readonly wilayasService: WilayasService,
        private readonly associationAccountRepository: AssociationAccountRepository,
        private readonly usersEventBus: UsersEventBus,
    ) {}

    login(request: LoginUseCaseRequest) {
        return new LoginUseCase(
            this.regularUserAccountRepository,
            this.passwordEncryptor,
            this.associationAccountRepository,
            this.usersEventBus,
        ).handle(request);
    }

    registerRegularUser(request: RegisterRegularUserUseCaseRequest) {
        return new RegisterRegularUserUseCase(
            this.regularUserAccountRepository,
            this.userIdGenerator,
            this.passwordEncryptor,
            this.wilayasService,
            this.associationAccountRepository,
            this.usersEventBus,
        ).handle(request);
    }

    getRegularUserById(request: GetRegularUserByIdUseCaseRequest) {
        return new GetRegularUserByIdUseCase(this.regularUserAccountRepository).handle(request);
    }

    registerAssociation(request: RegisterAssociationUseCaseRequest) {
        return new RegisterAssociationUseCase(
            this.wilayasService,
            this.passwordEncryptor,
            this.userIdGenerator,
            this.associationAccountRepository,
            this.regularUserAccountRepository,
            this.usersEventBus,
        ).handle(request);
    }

    getAssociationById(request: GetAssociationByIdUseCaseRequest) {
        return new GetAssociationByIdUseCase(this.associationAccountRepository).handle(request);
    }

    activateAssociationAccount(request: ActivateAssociationAccountUseCaseRequest) {
        return new ActivateAssociationAccountUseCase(this.associationAccountRepository).handle(
            request,
        );
    }
}

export { UsersManagerFacade };
