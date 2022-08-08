import { EditAccountInfoUseCaseRequest } from './EditAccountInfoUseCaseRequest';

import { Account } from '../../../domain/Account';
import { AccountId } from '../../../domain/AccountId';
import { PhoneNumber } from '../../../domain/PhoneNumber';
import { WilayaNumber } from '../../../domain/WilayaNumber';
import { AccountBuilder } from '../../../domain/AccountBuilder';

import { WilayasService } from '../../../domain/services/WilayasService';
import { RegularUserAccountRepository } from '../../../domain/services/AccountRepository/RegularUserAccountRepository';
import { AssociationAccountRepository } from '../../../domain/services/AccountRepository/AssociationAccountRepository';

import { ExceptionMessages } from '../../../domain/exceptions/ExceptionMessages';
import { NotFoundException } from '../../../domain/exceptions/NotFoundException';
import { MultiLanguagesValidationException } from '../../../domain/exceptions/MultiLanguagesValidationException';

abstract class EditAccountInfoUseCase {
    protected abstract findAccountById(id: AccountId): Promise<Account | undefined>;

    protected abstract getAccountBuilderFrom(account: Account): AccountBuilder;

    protected constructor(
        protected readonly wilayasService: WilayasService,
        protected readonly regularUserAccountRepository: RegularUserAccountRepository,
        protected readonly associationAccountRepository: AssociationAccountRepository,
    ) {}
 
    async validateDataAndGetBasicAccountBuilderFrom(request: EditAccountInfoUseCaseRequest) {
        const { wilayaNumber, phoneNumber, accountId } = await this.getFrom(request);

        await this.checkIfWilayaExistThrowIfNot(wilayaNumber);

        const account = await this.findTargetAccountByIdThrowIfNotExist(accountId);

        await this.checkIfPhoneNumberUsedThrowIfSo(phoneNumber, account.phoneNumber);

        return this.getAccountBuilderFrom(account)
            .withWilayaNumber(wilayaNumber)
            .withPhone(phoneNumber);
    }

    private async getFrom(request: EditAccountInfoUseCaseRequest) {
        const accountId = new AccountId(request.accountId);
        const phoneNumber = new PhoneNumber(request.phoneNumber);
        const wilayaNumber = new WilayaNumber(request.wilayaNumber);

        return { accountId, phoneNumber, wilayaNumber };
    }

    private async checkIfWilayaExistThrowIfNot(wilayaNumber: WilayaNumber) {
        const isExist = await this.wilayasService.isExist(wilayaNumber);
        if (!isExist)
            throw new MultiLanguagesValidationException(ExceptionMessages.INVALID_WILAYA_NUMBER);
    }

    private async findTargetAccountByIdThrowIfNotExist(accountId: AccountId) {
        const account = await this.findAccountById(accountId);

        if (!account) throw new NotFoundException(ExceptionMessages.ACCOUNT_NOT_FOUND);

        return account;
    }

    private async checkIfPhoneNumberUsedThrowIfSo(
        givenPhone: PhoneNumber,
        targetUserPhone: PhoneNumber,
    ) {
        const user = await this.regularUserAccountRepository.findByPhoneNumber(givenPhone);
        if (user && !user.phoneNumber.equals(targetUserPhone))
            throw new MultiLanguagesValidationException(
                ExceptionMessages.PHONE_NUMBER_ALREADY_USED,
            );

        const association = await this.associationAccountRepository.findByPhoneNumber(givenPhone);
        if (association && !association.phoneNumber.equals(targetUserPhone))
            throw new MultiLanguagesValidationException(
                ExceptionMessages.PHONE_NUMBER_ALREADY_USED,
            );
    }
}

export { EditAccountInfoUseCase };