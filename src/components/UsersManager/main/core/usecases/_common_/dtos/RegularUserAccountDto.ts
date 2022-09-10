import { AccountDto } from './base/AccountDto';

export interface RegularUserAccountDto extends AccountDto {
    firstName: string;
    lastName: string;
}