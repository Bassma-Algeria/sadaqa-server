import { RegularUserAccount } from './core/domain/RegularUserAccount';
import { AssociationAccount } from './core/domain/AssociationAccount';

import { WilayasService } from './core/domain/services/WilayasService';
import { PasswordEncryptor } from './core/domain/services/PasswordEncryptor';
import { AccountIdGenerator } from './core/domain/services/AccountIdGenerator';
import { UserEventPublisher } from './core/domain/services/UserEventPublisher';
import { RegularUserAccountRepository } from './core/domain/services/AccountRepository/RegularUserAccountRepository';
import { AssociationAccountRepository } from './core/domain/services/AccountRepository/AssociationAccountRepository';

import { LoginUseCase } from './core/usecases/LoginUseCase/LoginUseCase';
import { LoginUseCaseRequest } from './core/usecases/LoginUseCase/LoginUseCaseRequest';

import { RegisterRegularUserUseCase } from './core/usecases/RegisterUseCases/RegisterRegularUserUseCase/RegisterRegularUserUseCase';
import { RegisterRegularUserUseCaseRequest } from './core/usecases/RegisterUseCases/RegisterRegularUserUseCase/RegisterRegularUserUseCaseRequest';

import { RegisterAssociationUseCase } from './core/usecases/RegisterUseCases/RegisterAssociationUseCase/RegisterAssociationUseCase';
import { RegisterAssociationUseCaseRequest } from './core/usecases/RegisterUseCases/RegisterAssociationUseCase/RegisterAssociationUseCaseRequest';

import { EnableAssociationAccountUseCase } from './core/usecases/EnableAssociationAccountUseCase/EnableAssociationAccountUseCase';
import { EnableAssociationAccountUseCaseRequest } from './core/usecases/EnableAssociationAccountUseCase/EnableAssociationAccountUseCaseRequest';

import { GetAccountByIdUseCase } from './core/usecases/GetAccountByIdUseCase/GetAccountByIdUseCase';
import { GetAccountByIdUseCaseRequest } from './core/usecases/GetAccountByIdUseCase/GetAccountByIdUseCaseRequest';

import { EditRegularUserAccountCredentialsUseCase } from './core/usecases/EditAccountCredentialsUseCases/EditRegularUseAccountCredentialsUseCase/EditRegularUserAccountCredentialsUseCase';
import { EditRegularUserAccountCredentialsUseCaseRequest } from './core/usecases/EditAccountCredentialsUseCases/EditRegularUseAccountCredentialsUseCase/EditRegularUserAccountCredentialsUseCaseRequest';

import { EditAssociationAccountCredentialsUseCase } from './core/usecases/EditAccountCredentialsUseCases/EditAssociationAccountCredentialsUseCase/EditAssociationAccountCredentialsUseCase';
import { EditAssociationAccountCredentialsUseCaseRequest } from './core/usecases/EditAccountCredentialsUseCases/EditAssociationAccountCredentialsUseCase/EditAssociationAccountCredentialsUseCaseRequest';

import { RegularUserAccountDto } from './core/usecases/_common_/dtos/RegularUserAccountDto';
import { RegularUserAccountDtoMapper } from './core/usecases/_common_/dtos/RegularUserAccountDtoMapper';

import { AssociationAccountDto } from './core/usecases/_common_/dtos/AssociationAccountDto';
import { AssociationAccountDtoMapper } from './core/usecases/_common_/dtos/AssociationAccountDtoMapper';

class UsersManagerFacade {
    constructor(
        private readonly wilayasService: WilayasService,
        private readonly passwordEncryptor: PasswordEncryptor,
        private readonly accountIdGenerator: AccountIdGenerator,
        private readonly userEventPublisher: UserEventPublisher,
        private readonly regularUserAccountRepository: RegularUserAccountRepository,
        private readonly associationAccountRepository: AssociationAccountRepository,
    ) {}

    login(request: LoginUseCaseRequest) {
        return new LoginUseCase(
            this.userEventPublisher,
            this.passwordEncryptor,
            this.regularUserAccountRepository,
            this.associationAccountRepository,
        ).handle(request);
    }

    registerRegularUser(request: RegisterRegularUserUseCaseRequest) {
        return new RegisterRegularUserUseCase(
            this.wilayasService,
            this.passwordEncryptor,
            this.accountIdGenerator,
            this.userEventPublisher,
            this.associationAccountRepository,
            this.regularUserAccountRepository,
        ).handle(request);
    }

    getRegularUserById(request: GetAccountByIdUseCaseRequest) {
        return new GetAccountByIdUseCase<RegularUserAccount>(
            this.regularUserAccountRepository,
            RegularUserAccountDtoMapper.getInstance(),
        ).handle(request) as Promise<RegularUserAccountDto>;
    }

    registerAssociation(request: RegisterAssociationUseCaseRequest) {
        return new RegisterAssociationUseCase(
            this.wilayasService,
            this.passwordEncryptor,
            this.userEventPublisher,
            this.accountIdGenerator,
            this.associationAccountRepository,
            this.regularUserAccountRepository,
        ).handle(request);
    }

    getAssociationById(request: GetAccountByIdUseCaseRequest) {
        return new GetAccountByIdUseCase<AssociationAccount>(
            this.associationAccountRepository,
            AssociationAccountDtoMapper.getInstance(),
        ).handle(request) as Promise<AssociationAccountDto>;
    }

    enableAssociationAccount(request: EnableAssociationAccountUseCaseRequest) {
        return new EnableAssociationAccountUseCase(this.associationAccountRepository).handle(
            request,
        );
    }

    editRegularUseAccountCredentials(request: EditRegularUserAccountCredentialsUseCaseRequest) {
        return new EditRegularUserAccountCredentialsUseCase(
            this.passwordEncryptor,
            this.userEventPublisher,
            this.regularUserAccountRepository,
        ).handle(request);
    }

    editAssociationAccountCredentials(request: EditAssociationAccountCredentialsUseCaseRequest) {
        return new EditAssociationAccountCredentialsUseCase(
            this.passwordEncryptor,
            this.userEventPublisher,
            this.associationAccountRepository,
        ).handle(request);
    }
}

export { UsersManagerFacade };
