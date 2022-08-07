import { UseCase } from '../UseCase';
import { GetAccountByIdUseCaseRequest } from './GetAccountByIdUseCaseRequest';
import { GetAccountByIdUseCaseResponse } from './GetAccountByIdUseCaseResponse';

import { Account } from '../../domain/Account';
import { AccountId } from '../../domain/AccountId';

import { AccountDtoMapper } from '../_common_/dtos/base/AccountDtoMapper';

import { AccountRepository } from '../../domain/services/AccountRepository/base/AccountRepository';

import { NotFoundException } from '../../domain/exceptions/NotFoundException';
import { ExceptionMessages } from '../../domain/exceptions/ExceptionMessages';

class GetAccountByIdUseCase<A extends Account>
    implements UseCase<GetAccountByIdUseCaseRequest, GetAccountByIdUseCaseResponse>
{
    constructor(
        private readonly accountRepository: AccountRepository<A>,
        private readonly accountAccountDtoMapper: AccountDtoMapper<A>,
    ) {}

    async handle(request: GetAccountByIdUseCaseRequest): Promise<GetAccountByIdUseCaseResponse> {
        const account = await this.accountRepository.findById(new AccountId(request.accountId));

        if (!account) throw new NotFoundException(ExceptionMessages.ACCOUNT_NOT_FOUND);

        return this.accountAccountDtoMapper.toDto(account);
    }
}

export { GetAccountByIdUseCase };