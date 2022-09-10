import { AccountRepository } from './base/AccountRepository';
import { AssociationAccount } from '../../AssociationAccount';

export interface AssociationAccountRepository extends AccountRepository<AssociationAccount> {}