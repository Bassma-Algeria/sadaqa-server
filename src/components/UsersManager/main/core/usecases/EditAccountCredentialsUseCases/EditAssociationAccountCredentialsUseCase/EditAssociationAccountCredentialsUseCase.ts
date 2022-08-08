import { UseCase } from '../../UseCase';
import { EditAssociationAccountCredentialsUseCaseRequest } from './EditAssociationAccountCredentialsUseCaseRequest';

import { AccountId } from '../../../domain/AccountId';
import { AssociationAccount } from '../../../domain/AssociationAccount';

import { EditAccountCredentialsUseCase } from '../base/EditAccountCredentialsUseCase';

import { PasswordEncryptor } from '../../../domain/services/PasswordEncryptor';
import { UserEventPublisher } from '../../../domain/services/UserEventPublisher';
import { AssociationAccountRepository } from '../../../domain/services/AccountRepository/AssociationAccountRepository';
import { RegularUserAccountRepository } from '../../../domain/services/AccountRepository/RegularUserAccountRepository';

class EditAssociationAccountCredentialsUseCase
    extends EditAccountCredentialsUseCase
    implements UseCase<EditAssociationAccountCredentialsUseCaseRequest, void>
{
    constructor(
        protected readonly passwordEncryptor: PasswordEncryptor,
        protected readonly userEventPublisher: UserEventPublisher,
        protected readonly associationAccountRepository: AssociationAccountRepository,
        protected readonly regularUserAccountRepository: RegularUserAccountRepository,
    ) {
        super(
            passwordEncryptor,
            userEventPublisher,
            associationAccountRepository,
            regularUserAccountRepository,
        );
    }

    async handle(request: EditAssociationAccountCredentialsUseCaseRequest): Promise<void> {
        const editedAccount = await this.validateDataAndGetEditedAccountFrom(request);

        await this.associationAccountRepository.update(editedAccount as AssociationAccount);
        this.publishAccountCredentialsEdited(editedAccount.accountId);
    }

    protected findAccountById(id: AccountId) {
        return this.associationAccountRepository.findById(id);
    }

    protected getAccountBuilderFrom(account: AssociationAccount) {
        return AssociationAccount.aBuilderFrom(account);
    }
}

export { EditAssociationAccountCredentialsUseCase };