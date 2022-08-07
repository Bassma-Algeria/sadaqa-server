import { UseCase } from '../../UseCase';
import { EditRegularUserAccountCredentialsUseCaseRequest } from './EditRegularUserAccountCredentialsUseCaseRequest';

import { EditAccountCredentialsUseCase } from '../base/EditAccountCredentialsUseCase';

import { RegularUserAccount } from '../../../domain/RegularUserAccount';

import { PasswordEncryptor } from '../../../domain/services/PasswordEncryptor';
import { UserEventPublisher } from '../../../domain/services/UserEventPublisher';
import { RegularUserAccountRepository } from '../../../domain/services/AccountRepository/RegularUserAccountRepository';

class EditRegularUserAccountCredentialsUseCase
    extends EditAccountCredentialsUseCase
    implements UseCase<EditRegularUserAccountCredentialsUseCaseRequest, void>
{
    constructor(
        protected readonly passwordEncryptor: PasswordEncryptor,
        protected readonly userEventPublisher: UserEventPublisher,
        protected readonly regularUserAccountRepository: RegularUserAccountRepository,
    ) {
        super(passwordEncryptor, userEventPublisher, regularUserAccountRepository);
    }

    async handle(request: EditRegularUserAccountCredentialsUseCaseRequest): Promise<void> {
        const { email, encryptedNewPassword, account } = await this.validateAndProcessDataFrom(
            request,
        );

        const updatedAccount = RegularUserAccount.aBuilderFrom(account as RegularUserAccount)
            .withEmail(email)
            .withPassword(encryptedNewPassword)
            .build();

        await this.updateAccount(updatedAccount);
        this.publishAccountCredentialsEdited(updatedAccount.accountId);
    }
}

export { EditRegularUserAccountCredentialsUseCase };