import { UseCase } from '../UseCase';
import { GetAccountsByWilayaNumberUseCaseRequest } from './GetAccountsByWilayaNumberUseCaseRequest';
import { GetAccountsByWilayaNumberUseCaseResponse } from './GetAccountsByWilayaNumberUseCaseResponse';

import { Account } from '../../domain/Account';

import { AccountDtoMapper } from '../_common_/dtos/base/AccountDtoMapper';

import { AccountRepository } from '../../domain/services/AccountRepository/base/AccountRepository';

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
        return {} as any;
    }
}

export { GetAccountsByWilayaNumberUseCase };