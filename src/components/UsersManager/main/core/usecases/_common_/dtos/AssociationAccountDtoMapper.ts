import { AssociationAccountDto } from './AssociationAccountDto';

import { AccountDtoMapper } from './base/AccountDtoMapper';

import { AssociationAccount } from '../../../domain/AssociationAccount';

class AssociationAccountDtoMapper extends AccountDtoMapper<AssociationAccount> {
    private static instance = new AssociationAccountDtoMapper();

    static getInstance() {
        return this.instance;
    }
     
    toDto(account: AssociationAccount): AssociationAccountDto {
        return {
            ...super.toDto(account),

            associationName: account.associationName.value(),
        };
    }
}

export { AssociationAccountDtoMapper };