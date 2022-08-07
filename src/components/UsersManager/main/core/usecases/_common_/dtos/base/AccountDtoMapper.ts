import { AccountDto } from './AccountDto';

import { Account } from '../../../../domain/Account';

abstract class AccountDtoMapper<A extends Account> {
    toDto(account: A): AccountDto {
        return {
            accountId: account.accountId.value(),
            email: account.email.value(),
            phoneNumber: account.phoneNumber.value(),
            wilayaNumber: account.wilayaNumber.value(),
            status: account.status,
            createdAt: account.createdAt,
        };
    }
}

export { AccountDtoMapper };