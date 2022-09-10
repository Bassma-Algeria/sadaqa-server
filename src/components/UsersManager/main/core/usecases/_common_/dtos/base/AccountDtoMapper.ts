import { AccountDto } from './AccountDto';

import { Account } from '../../../../domain/Account';

abstract class AccountDtoMapper<A extends Account> {
    toDto(account: A): AccountDto {
        return {
            accountId: account.getAccountId().value(),
            email: account.getEmail().value(),
            phoneNumber: account.getPhoneNumber().value(),
            wilayaNumber: account.getWilayaNumber().value(),
            profilePicture: account.getProfilePicture() ? account.getProfilePicture()!.url() : null,
            status: account.getAccountStatus(),
            createdAt: account.getCreationDate(),
        };
    }
}

export { AccountDtoMapper };
