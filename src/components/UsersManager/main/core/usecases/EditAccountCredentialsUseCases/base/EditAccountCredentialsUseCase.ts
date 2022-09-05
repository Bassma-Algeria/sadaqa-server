import { EditAccountCredentialsUseCaseRequest } from './EditAccountCredentialsUseCaseRequest';

import { Email } from '../../../domain/Email';
import { Account } from '../../../domain/Account';
import { Password } from '../../../domain/Password';
import { AccountId } from '../../../domain/AccountId';
import { AccountBuilder } from '../../../domain/AccountBuilder';
import { PasswordEncryptor } from '../../../domain/services/PasswordEncryptor';
import { UserEventPublisher } from '../../../domain/services/UserEventPublisher';
import { AssociationAccountRepository } from '../../../domain/services/AccountRepository/AssociationAccountRepository';
import { RegularUserAccountRepository } from '../../../domain/services/AccountRepository/RegularUserAccountRepository';

import { NotFoundException } from '../../../domain/exceptions/NotFoundException';
import { ExceptionMessages } from '../../../domain/exceptions/ExceptionMessages';
import { ValidationException } from '../../../domain/exceptions/ValidationException';
import { MultiLanguagesValidationException } from '../../../domain/exceptions/MultiLanguagesValidationException';

abstract class EditAccountCredentialsUseCase {
    protected abstract findAccountById(id: AccountId): Promise<Account | undefined>;

    protected abstract getAccountBuilderFrom(account: Account): AccountBuilder;

    protected constructor(
        protected readonly passwordEncryptor: PasswordEncryptor,
        protected readonly userEventPublisher: UserEventPublisher,
        protected readonly associationAccountRepository: AssociationAccountRepository,
        protected readonly regularUserAccountRepository: RegularUserAccountRepository,
    ) {}

    protected async validateDataAndGetEditedAccountFrom(
        request: EditAccountCredentialsUseCaseRequest,
    ) {
        const { accountId, email, oldPassword, newPassword } = this.getFrom(request);

        const account = await this.findAccountById(accountId);

        if (!account) throw new NotFoundException(ExceptionMessages.ACCOUNT_NOT_FOUND);
        if (!account.canEditCredentials())
            throw new ValidationException(ExceptionMessages.CANNOT_EDIT_ACCOUNT_CREDENTIALS);

        await this.checkIfEmailAlreadyUsedThrowIfSo(email, account);
        await this.checkIfPasswordMatchThrowIfNot(oldPassword, account.getPassword());

        const encryptedNewPassword = await this.encrypt(newPassword);

        return this.getAccountBuilderFrom(account)
            .withEmail(email)
            .withPassword(encryptedNewPassword)
            .build();
    }

    private getFrom(request: EditAccountCredentialsUseCaseRequest) {
        return {
            email: new Email(request.email),
            accountId: new AccountId(request.accountId),
            oldPassword: new Password(request.oldPassword),
            newPassword: new Password(request.newPassword),
        };
    }

    private async checkIfEmailAlreadyUsedThrowIfSo(givenEmail: Email, targetAccount: Account) {
        const user = await this.regularUserAccountRepository.findByEmail(givenEmail);
        const association = await this.associationAccountRepository.findByEmail(givenEmail);

        if (user && !user.haveSamePhoneNumberAs(targetAccount))
            throw new MultiLanguagesValidationException(ExceptionMessages.EMAIL_ALREADY_USED);

        if (association && !association.haveSameEmailAs(targetAccount))
            throw new MultiLanguagesValidationException(ExceptionMessages.EMAIL_ALREADY_USED);
    }

    private async checkIfPasswordMatchThrowIfNot(
        givenPassword: Password,
        targetAccountPassword: Password,
    ) {
        const isMatch = await this.passwordEncryptor.compare(givenPassword, targetAccountPassword);
        if (!isMatch)
            throw new MultiLanguagesValidationException(ExceptionMessages.WRONG_OLD_PASSWORD);
    }

    private encrypt(password: Password) {
        return this.passwordEncryptor.encrypt(password);
    }

    protected publishAccountCredentialsEdited(account: Account) {
        this.userEventPublisher.publishAccountCredentialsEdited(account);
    }
}

export { EditAccountCredentialsUseCase };
