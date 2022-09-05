import { UseCase } from '../UseCase';
import { GetAccountsByWilayaNumberUseCaseRequest } from './GetAccountsByWilayaNumberUseCaseRequest';
import { GetAccountsByWilayaNumberUseCaseResponse } from './GetAccountsByWilayaNumberUseCaseResponse';

import { Account } from '../../domain/Account';
import { WilayaNumber } from '../../domain/WilayaNumber';

import { AccountDtoMapper } from '../_common_/dtos/base/AccountDtoMapper';

import {
    AccountRepository,
    AccountRepositoryFindManyFilters,
} from '../../domain/services/AccountRepository/base/AccountRepository';

class GetAccountsByWilayaNumberUseCase
    implements
        UseCase<GetAccountsByWilayaNumberUseCaseRequest, GetAccountsByWilayaNumberUseCaseResponse>
{
    constructor(
        private readonly AccountDtoMapper: AccountDtoMapper<Account>,
        private readonly accountRepository: AccountRepository<Account>,
    ) {}

    async handle(
        request: GetAccountsByWilayaNumberUseCaseRequest,
    ): Promise<GetAccountsByWilayaNumberUseCaseResponse> {
        const filters = this.getFiltersFrom(request);

        const accounts = await this.accountRepository.findMany(filters);

        return accounts.map(this.AccountDtoMapper.toDto);
    }

    private getFiltersFrom(
        request: GetAccountsByWilayaNumberUseCaseRequest,
    ): AccountRepositoryFindManyFilters {
        const wilayaNumber = new WilayaNumber(request.wilayaNumber);

        return { wilayaNumber };
    }
}

export { GetAccountsByWilayaNumberUseCase };
