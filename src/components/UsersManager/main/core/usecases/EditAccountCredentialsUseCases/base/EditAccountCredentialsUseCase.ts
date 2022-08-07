import { EditAccountCredentialsUseCaseRequest } from './EditAccountCredentialsUseCaseRequest';

import { Email } from '../../../domain/Email';
import { Account } from '../../../domain/Account';
import { Password } from '../../../domain/Password';
import { AccountId } from '../../../domain/AccountId';

import { PasswordEncryptor } from '../../../domain/services/PasswordEncryptor';
import { UserEventPublisher } from '../../../domain/services/UserEventPublisher';
import { AccountRepository } from '../../../domain/services/AccountRepository/base/AccountRepository';

import { NotFoundException } from '../../../domain/exceptions/NotFoundException';
import { ExceptionMessages } from '../../../domain/exceptions/ExceptionMessages';
import { MultiLanguagesValidationException } from '../../../domain/exceptions/MultiLanguagesValidationException';

abstract class EditAccountCredentialsUseCase {
    protected constructor(
        protected readonly passwordEncryptor: PasswordEncryptor,
        protected readonly userEventPublisher: UserEventPublisher,
        protected readonly accountRepository: AccountRepository<Account>,
    ) {}

    protected async validateAndProcessDataFrom(request: EditAccountCredentialsUseCaseRequest) {
        const { accountId, email, oldPassword, newPassword } = this.getFrom(request);

        const account = await this.accountRepository.findById(accountId);

        if (!account) throw new NotFoundException(ExceptionMessages.ACCOUNT_NOT_FOUND);

        await this.checkIfPasswordMatchThrowIfNot(account.password, oldPassword);

        const encryptedNewPassword = await this.encrypt(newPassword);

        return { email, encryptedNewPassword, account };
    }

    private getFrom(request: EditAccountCredentialsUseCaseRequest) {
        return {
            email: new Email(request.email),
            accountId: new AccountId(request.accountId),
            oldPassword: new Password(request.oldPassword),
            newPassword: new Password(request.newPassword),
        };
    }

    private async checkIfPasswordMatchThrowIfNot(realPassword: Password, givenPassword: Password) {
        const isMatch = await this.passwordEncryptor.compare(givenPassword, realPassword);
        if (!isMatch)
            throw new MultiLanguagesValidationException(ExceptionMessages.WRONG_OLD_PASSWORD);
    }

    private encrypt(password: Password) {
        return this.passwordEncryptor.encrypt(password);
    }

    protected updateAccount(account: Account) {
        return this.accountRepository.update(account);
    }

    protected publishAccountCredentialsEdited(accountId: AccountId) {
        this.userEventPublisher.publishAccountCredentialsEdited(accountId);
    }
}

export { EditAccountCredentialsUseCase };
