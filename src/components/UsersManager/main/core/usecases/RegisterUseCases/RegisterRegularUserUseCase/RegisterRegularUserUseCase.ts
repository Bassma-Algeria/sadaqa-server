import { UseCase } from '../../UseCase';
import { RegisterRegularUserUseCaseRequest } from './RegisterRegularUserUseCaseRequest';
import { RegisterRegularUserUseCaseResponse } from './RegisterRegularUserUseCaseResponse';

import { RegisterUseCase } from '../base/RegisterUseCase';

import { FirstName } from '../../../domain/FirstName';
import { AccountStatus } from '../../../domain/AccountStatus';
import { RegularUserAccount } from '../../../domain/RegularUserAccount';
import { RegularUserAccountBuilder } from '../../../domain/RegularUserAccountBuilder';

import { WilayasService } from '../../../domain/services/WilayasService';
import { PasswordEncryptor } from '../../../domain/services/PasswordEncryptor';
import { UserEventPublisher } from '../../../domain/services/UserEventPublisher';
import { AccountIdGenerator } from '../../../domain/services/AccountIdGenerator';
import { RegularUserAccountRepository } from '../../../domain/services/AccountRepository/RegularUserAccountRepository';
import { AssociationAccountRepository } from '../../../domain/services/AccountRepository/AssociationAccountRepository';

class RegisterRegularUserUseCase
    extends RegisterUseCase
    implements UseCase<RegisterRegularUserUseCaseRequest, RegisterRegularUserUseCaseResponse>
{
    constructor(
        protected readonly wilayasService: WilayasService,
        protected readonly passwordEncryptor: PasswordEncryptor,
        protected readonly accountIdGenerator: AccountIdGenerator,
        protected readonly userEventPublisher: UserEventPublisher,
        protected readonly associationAccountRepository: AssociationAccountRepository,
        protected readonly regularUserAccountRepository: RegularUserAccountRepository,
    ) {
        super(
            wilayasService,
            passwordEncryptor,
            accountIdGenerator,
            associationAccountRepository,
            regularUserAccountRepository,
        );
    }

    async handle(
        request: RegisterRegularUserUseCaseRequest,
    ): Promise<RegisterRegularUserUseCaseResponse> {
        const accountBuilder = await this.validateAndGetBasicAccountBuilderFrom(request);

        const firstName = new FirstName(request.firstName);
        const lastName = new FirstName(request.lastName);

        const regularUser = (accountBuilder as RegularUserAccountBuilder)
            .withFirstName(firstName)
            .withLastName(lastName)
            .build();

        await this.regularUserAccountRepository.save(regularUser);

        this.userEventPublisher.publishRegularUserRegistered(regularUser);

        return { accountId: regularUser.getAccountId().value() };
    }

    protected getAccountBuilder() {
        return RegularUserAccount.aBuilder();
    }

    protected getInitialAccountStatus() {
        return AccountStatus.ACTIVE;
    }
}

export { RegisterRegularUserUseCase };
