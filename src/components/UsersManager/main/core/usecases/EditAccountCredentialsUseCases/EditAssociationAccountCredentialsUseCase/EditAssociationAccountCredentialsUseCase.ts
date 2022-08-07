import { UseCase } from '../../UseCase';
import { EditAssociationAccountCredentialsUseCaseRequest } from './EditAssociationAccountCredentialsUseCaseRequest';

import { EditAccountCredentialsUseCase } from '../base/EditAccountCredentialsUseCase';

import { AssociationAccount } from '../../../domain/AssociationAccount';

import { PasswordEncryptor } from '../../../domain/services/PasswordEncryptor';
import { UserEventPublisher } from '../../../domain/services/UserEventPublisher';
import { AssociationAccountRepository } from '../../../domain/services/AccountRepository/AssociationAccountRepository';

class EditAssociationAccountCredentialsUseCase
    extends EditAccountCredentialsUseCase
    implements UseCase<EditAssociationAccountCredentialsUseCaseRequest, void>
{
    constructor(
        protected readonly passwordEncryptor: PasswordEncryptor,
        protected readonly userEventPublisher: UserEventPublisher,
        protected readonly associationAccountRepository: AssociationAccountRepository,
    ) {
        super(passwordEncryptor, userEventPublisher, associationAccountRepository);
    }

    async handle(request: EditAssociationAccountCredentialsUseCaseRequest): Promise<void> {
        const { email, encryptedNewPassword, account } = await this.validateAndProcessDataFrom(
            request,
        );

        const updatedAccount = AssociationAccount.aBuilderFrom(account as AssociationAccount)
            .withEmail(email)
            .withPassword(encryptedNewPassword)
            .build();

        await this.updateAccount(updatedAccount);
        this.publishAccountCredentialsEdited(updatedAccount.accountId);
    }
}

export { EditAssociationAccountCredentialsUseCase };