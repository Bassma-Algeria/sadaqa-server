import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { PostgresAssociationAccountRespository } from '../../main/infra/real/PostgresAssociationAccountRespository';

import { Email } from '../../main/core/domain/Email';
import { UserId } from '../../main/core/domain/UserId';
import { PhoneNumber } from '../../main/core/domain/PhoneNumber';

import { anAssociationAccount } from './base/anAssociationAccount';
import { AssociationAccount } from '../../main/core/domain/AssociationAccount';

describe('PostgresAssociationAccountRepository', () => {
  const associationAccountRepository = new PostgresAssociationAccountRespository();

  it('should save an account and get it by id', async () => {
    const account = anAssociationAccount();

    await associationAccountRepository.save(account);
    const accountById = await associationAccountRepository.findById(account.associationId);

    expect(accountById?.email.value()).to.equal(account.email.value());
    expect(accountById?.associationId.value()).to.equal(account.associationId.value());
    expect(accountById?.associationName.value()).to.equal(account.associationName.value());
  });

  it('should save the account and get it by email', async () => {
    const account = anAssociationAccount();

    await associationAccountRepository.save(account);
    const accountByEmail = await associationAccountRepository.findByEmail(account.email);

    expect(accountByEmail?.email.value()).to.equal(account.email.value());
    expect(accountByEmail?.associationId.value()).to.equal(account.associationId.value());
    expect(accountByEmail?.associationName.value()).to.equal(account.associationName.value());
  });

  it('should save the account and get it by phone number', async () => {
    const account = anAssociationAccount();

    await associationAccountRepository.save(account);
    const accountByPhone = await associationAccountRepository.findByPhoneNumber(account.phone);

    expect(accountByPhone?.email.value()).to.equal(account.email.value());
    expect(accountByPhone?.associationId.value()).to.equal(account.associationId.value());
    expect(accountByPhone?.associationName.value()).to.equal(account.associationName.value());
  });

  it('should return undefined when no user found by email, phone or id', async () => {
    const NOT_EXISTING_PHONE = new PhoneNumber(faker.phone.number('06 ## ## ## ##'));
    const NOT_EXISTING_EMAIL = new Email(faker.internet.email());
    const NOT_EXISTING_ID = new UserId(faker.datatype.uuid());

    const userByPhone = await associationAccountRepository.findByPhoneNumber(NOT_EXISTING_PHONE);
    const userByEmail = await associationAccountRepository.findByEmail(NOT_EXISTING_EMAIL);
    const userById = await associationAccountRepository.findById(NOT_EXISTING_ID);

    expect(userByPhone).to.equal(undefined);
    expect(userByEmail).to.equal(undefined);
    expect(userById).to.equal(undefined);
  });

  it('should be able to update an association account', async () => {
    const account = anAssociationAccount();
    await associationAccountRepository.save(account);

    const updatedAccount = AssociationAccount.aBuilder(account)
      .withEmail(new Email(faker.internet.email()))
      .build();
    await associationAccountRepository.update(updatedAccount);

    const accountInDb = await associationAccountRepository.findById(account.associationId);
    expect(accountInDb?.email.value()).to.equal(updatedAccount.email.value());
    expect(accountInDb?.email.value()).to.not.equal(account.email.value());
  });
});
