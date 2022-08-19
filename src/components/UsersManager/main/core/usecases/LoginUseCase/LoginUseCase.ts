import { UseCase } from '../UseCase';
import { LoginUseCaseRequest } from './LoginUseCaseRequest';
import { LoginUseCaseResponse } from './LoginUseCaseResponse';

import { Email } from '../../domain/Email';
import { Password } from '../../domain/Password';

import { PasswordEncryptor } from '../../domain/services/PasswordEncryptor';
import { UserEventPublisher } from '../../domain/services/UserEventPublisher';
import { RegularUserAccountRepository } from '../../domain/services/AccountRepository/RegularUserAccountRepository';
import { AssociationAccountRepository } from '../../domain/services/AccountRepository/AssociationAccountRepository';

import { ExceptionMessages } from '../../domain/exceptions/ExceptionMessages';
import { MultiLanguagesValidationException } from '../../domain/exceptions/MultiLanguagesValidationException';

class LoginUseCase implements UseCase<LoginUseCaseRequest, LoginUseCaseResponse> {
    constructor(
        private readonly usersEventBus: UserEventPublisher,
        private readonly passwordEncryptor: PasswordEncryptor,
        private readonly regularUserAccountRepository: RegularUserAccountRepository,
        private readonly associationAccountRepository: AssociationAccountRepository,
    ) {}

    async handle(request: LoginUseCaseRequest): Promise<LoginUseCaseResponse> {
        const { password: passwordFromRequest, email } = this.getFrom(request);

        const {
            accountId,
            accountType,
            password: realPassword,
        } = await this.findAccountByEmailThrowIfNotFound(email);

        await this.checkIfPasswordsMatchAndThrowIfNot(passwordFromRequest, realPassword);

        this.usersEventBus.publishUserLogin(accountId);

        return { accountId: accountId.value(), type: accountType };
    }

    private getFrom(request: LoginUseCaseRequest) {
        return { email: new Email(request.email), password: new Password(request.password) };
    }

    private async findAccountByEmailThrowIfNotFound(email: Email) {
        const regularUser = await this.regularUserAccountRepository.findByEmail(email);
        if (regularUser) return regularUser;

        const association = await this.associationAccountRepository.findByEmail(email);
        if (association) return association;

        throw new MultiLanguagesValidationException(ExceptionMessages.WRONG_CREDENTIALS);
    }

    private async checkIfPasswordsMatchAndThrowIfNot(
        passwordFromRequest: Password,
        realPassword: Password,
    ) {
        const isMatch = await this.passwordEncryptor.compare(passwordFromRequest, realPassword);

        if (!isMatch)
            throw new MultiLanguagesValidationException(ExceptionMessages.WRONG_CREDENTIALS);
    }
}

export { LoginUseCase };
