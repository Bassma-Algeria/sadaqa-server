import { UseCase } from '../../UseCase';
import { RegisterAssociationUseCaseRequest } from './RegisterAssociationUseCaseRequest';
import { RegisterAssociationUseCaseResponse } from './RegisterAssociationUseCaseResponse';

import { RegisterUseCase } from '../base/RegisterUseCase';

import { AccountStatus } from '../../../domain/AccountStatus';
import { AssociationName } from '../../../domain/AssociationName';
import { AssociationDocs } from '../../../domain/AssociationDocs';
import { AssociationAccount } from '../../../domain/AssociationAccount';
import { AssociationAccountBuilder } from '../../../domain/AssociationAccountBuilder';

import { WilayasService } from '../../../domain/services/WilayasService';
import { PasswordEncryptor } from '../../../domain/services/PasswordEncryptor';
import { UserEventPublisher } from '../../../domain/services/UserEventPublisher';
import { AccountIdGenerator } from '../../../domain/services/AccountIdGenerator';
import { AssociationAccountRepository } from '../../../domain/services/AccountRepository/AssociationAccountRepository';
import { RegularUserAccountRepository } from '../../../domain/services/AccountRepository/RegularUserAccountRepository';

class RegisterAssociationUseCase
    extends RegisterUseCase
    implements UseCase<RegisterAssociationUseCaseRequest, RegisterAssociationUseCaseResponse>
{
    constructor(
        protected readonly wilayaService: WilayasService,
        protected readonly passwordEncryptor: PasswordEncryptor,
        protected readonly userEventPublisher: UserEventPublisher,
        protected readonly accountIdGenerator: AccountIdGenerator,
        protected readonly associationAccountRepository: AssociationAccountRepository,
        protected readonly regularUserAccountRepository: RegularUserAccountRepository,
    ) {
        super(
            wilayaService,
            passwordEncryptor,
            accountIdGenerator,
            associationAccountRepository,
            regularUserAccountRepository,
        );
    }

    async handle(
        request: RegisterAssociationUseCaseRequest,
    ): Promise<RegisterAssociationUseCaseResponse> {
        const accountBuilder = await this.validateAndGetBasicAccountBuilderFrom(request);

        const associationName = new AssociationName(request.associationName);
        const associationDocs = new AssociationDocs(request.associationDocs);

        const associationAccount = (accountBuilder as AssociationAccountBuilder)
            .withName(associationName)
            .build();

        await this.associationAccountRepository.save(associationAccount);

        this.userEventPublisher.publishAssociationRegistered({
            associationAccount,
            associationDocs,
        });

        return { accountId: associationAccount.getAccountId().value() };
    }

    protected getAccountBuilder() {
        return AssociationAccount.aBuilder();
    }

    protected getInitialAccountStatus() {
        return AccountStatus.WAITING_FOR_ADMIN_VALIDATION;
    }
}

export { RegisterAssociationUseCase };
