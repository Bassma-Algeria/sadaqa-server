import { AccountDto } from './base/AccountDto';

export interface AssociationAccountDto extends AccountDto {
    associationName: string;
}