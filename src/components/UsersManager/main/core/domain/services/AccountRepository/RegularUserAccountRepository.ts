import { AccountRepository } from './base/AccountRepository';
import { RegularUserAccount } from '../../RegularUserAccount';

export interface RegularUserAccountRepository extends AccountRepository<RegularUserAccount> {}