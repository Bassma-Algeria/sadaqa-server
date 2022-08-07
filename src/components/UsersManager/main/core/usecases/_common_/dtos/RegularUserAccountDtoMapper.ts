import { RegularUserAccountDto } from './RegularUserAccountDto';

import { AccountDtoMapper } from './base/AccountDtoMapper';

import { RegularUserAccount } from '../../../domain/RegularUserAccount';

class RegularUserAccountDtoMapper extends AccountDtoMapper<RegularUserAccount> {

    private static instance = new RegularUserAccountDtoMapper();

    static getInstance() {
        return this.instance;
    }

    toDto(account: RegularUserAccount): RegularUserAccountDto {
        return {
            ...super.toDto(account),

            firstName: account.firstName.value(),
            lastName: account.lastName.value(),
        };
    }
}

export { RegularUserAccountDtoMapper };
