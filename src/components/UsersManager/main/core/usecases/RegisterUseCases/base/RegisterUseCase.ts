import { RegisterUseCaseRequest } from './RegisterUseCaseRequest';

import { Email } from '../../../domain/Email';
import { Password } from '../../../domain/Password';
import { PhoneNumber } from '../../../domain/PhoneNumber';
import { WilayaNumber } from '../../../domain/WilayaNumber';
import { AccountStatus } from '../../../domain/AccountStatus';
import { AccountBuilder } from '../../../domain/AccountBuilder';

import { WilayasService } from '../../../domain/services/WilayasService';
import { PasswordEncryptor } from '../../../domain/services/PasswordEncryptor';
import { AccountIdGenerator } from '../../../domain/services/AccountIdGenerator';
import { AssociationAccountRepository } from '../../../domain/services/AccountRepository/AssociationAccountRepository';
import { RegularUserAccountRepository } from '../../../domain/services/AccountRepository/RegularUserAccountRepository';

import { ExceptionMessages } from '../../../domain/exceptions/ExceptionMessages';
import { MultiLanguagesValidationException } from '../../../domain/exceptions/MultiLanguagesValidationException';

abstract class RegisterUseCase {
    protected abstract getInitialAccountStatus(): AccountStatus;

    protected abstract getAccountBuilder(): AccountBuilder;

    protected constructor(
        protected readonly wilayaService: WilayasService,
        protected readonly passwordEncryptor: PasswordEncryptor,
        protected readonly accountIdGenerator: AccountIdGenerator,
        protected readonly associationAccountRepository: AssociationAccountRepository,
        protected readonly regularUserAccountRepository: RegularUserAccountRepository,
    ) {}

    protected async validateAndGetBasicAccountBuilderFrom(
        request: RegisterUseCaseRequest,
    ): Promise<AccountBuilder> {
        const { email, phoneNumber, wilayaNumber, confirmPassword, password } =
            this.getFrom(request);

        this.checkIfPasswordsMatchAndThrowIfNot(password, confirmPassword);

        await this.checkIfWilayaExistAndThrowIfNot(wilayaNumber);
        await this.checkIfEmailIsUniqueAndThrowIfNot(email);
        await this.checkIfPhoneIsUniqueAndThrowIfNot(phoneNumber);

        const encryptedPassword = await this.encrypt(password);

        return this.getAccountBuilder()
            .withAccountId(this.getRandomAccountId())
            .withWilayaNumber(wilayaNumber)
            .withPhone(phoneNumber)
            .withEmail(email)
            .withPassword(encryptedPassword)
            .withCreatedAt(this.now())
            .withStatus(this.getInitialAccountStatus());
    }

    private getFrom(request: RegisterUseCaseRequest) {
        const email = new Email(request.email);
        const password = new Password(request.password);
        const phoneNumber = new PhoneNumber(request.phoneNumber);
        const wilayaNumber = new WilayaNumber(request.wilayaNumber);
        const confirmPassword = new Password(request.confirmPassword);

        return { email, phoneNumber, wilayaNumber, password, confirmPassword };
    }

    private checkIfPasswordsMatchAndThrowIfNot(password: Password, confirmPassword: Password) {
        if (!password.equals(confirmPassword))
            throw new MultiLanguagesValidationException(ExceptionMessages.PASSWORD_MISS_MATCH);
    }

    private async checkIfWilayaExistAndThrowIfNot(wilayaNumber: WilayaNumber) {
        const isWilayaExist = await this.wilayaService.isExist(wilayaNumber);
        if (!isWilayaExist)
            throw new MultiLanguagesValidationException(ExceptionMessages.INVALID_WILAYA_NUMBER);
    }

    private async checkIfEmailIsUniqueAndThrowIfNot(email: Email) {
        const associationWithSameEmail = await this.associationAccountRepository.findByEmail(email);
        const regularUserWithSameEmail = await this.regularUserAccountRepository.findByEmail(email);

        if (associationWithSameEmail || regularUserWithSameEmail)
            throw new MultiLanguagesValidationException(ExceptionMessages.EMAIL_ALREADY_USED);
    }

    private async checkIfPhoneIsUniqueAndThrowIfNot(phone: PhoneNumber) {
        const associationWithSamePhone = await this.associationAccountRepository.findByPhoneNumber(
            phone,
        );
        const regularUserWithSamePhone = await this.regularUserAccountRepository.findByPhoneNumber(
            phone,
        );

        if (associationWithSamePhone || regularUserWithSamePhone)
            throw new MultiLanguagesValidationException(
                ExceptionMessages.PHONE_NUMBER_ALREADY_USED,
            );
    }

    private encrypt(password: Password) {
        return this.passwordEncryptor.encrypt(password);
    }

    private getRandomAccountId() {
        return this.accountIdGenerator.nextId();
    }

    private now() {
        return new Date();
    }
}

export { RegisterUseCase };