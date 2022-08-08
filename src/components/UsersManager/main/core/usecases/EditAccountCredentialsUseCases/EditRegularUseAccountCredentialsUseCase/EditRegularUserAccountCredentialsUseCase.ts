import { UseCase } from '../../UseCase';
import { EditRegularUserAccountCredentialsUseCaseRequest } from './EditRegularUserAccountCredentialsUseCaseRequest';

import { AccountId } from '../../../domain/AccountId';
import { RegularUserAccount } from '../../../domain/RegularUserAccount';

import { EditAccountCredentialsUseCase } from '../base/EditAccountCredentialsUseCase';

import { PasswordEncryptor } from '../../../domain/services/PasswordEncryptor';
import { UserEventPublisher } from '../../../domain/services/UserEventPublisher';
import { RegularUserAccountRepository } from '../../../domain/services/AccountRepository/RegularUserAccountRepository';
import { AssociationAccountRepository } from '../../../domain/services/AccountRepository/AssociationAccountRepository';

class EditRegularUserAccountCredentialsUseCase
    extends EditAccountCredentialsUseCase
    implements UseCase<EditRegularUserAccountCredentialsUseCaseRequest, void>
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

    async handle(request: EditRegularUserAccountCredentialsUseCaseRequest): Promise<void> {
        const editedAccount = await this.validateDataAndGetEditedAccountFrom(request);

        await this.regularUserAccountRepository.update(editedAccount as RegularUserAccount);
        this.publishAccountCredentialsEdited(editedAccount.accountId);
    }

    protected findAccountById(id: AccountId) {
        return this.regularUserAccountRepository.findById(id);
    }

    protected getAccountBuilderFrom(account: RegularUserAccount) {
        return RegularUserAccount.aBuilderFrom(account);
    }
}

export { EditRegularUserAccountCredentialsUseCase };