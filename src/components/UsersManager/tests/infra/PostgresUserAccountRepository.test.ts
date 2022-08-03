import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { Email } from '../../main/core/domain/Email';
import { UserId } from '../../main/core/domain/UserId';
import { PhoneNumber } from '../../main/core/domain/PhoneNumber';

import { aRegularUserAccount } from './base/aRegularUserAccount';

import { PostgresUserAccountRepository } from '../../main/infra/real/PostgresUserAccountRepository';

describe('PostgresUserAccountRepository', () => {
    const userAccountRepository = new PostgresUserAccountRepository();

    it('should add a user be able to retrieve it by email', async () => {
        const userAccount = aRegularUserAccount();

        await userAccountRepository.save(userAccount);
        const accountByEmail = await userAccountRepository.findByEmail(userAccount.email);

        expect(userAccount.userId.value()).to.equal(accountByEmail?.userId.value());
    });

    it('should add a user be able to retrieve it by phone', async () => {
        const userAccount = aRegularUserAccount();

        await userAccountRepository.save(userAccount);
        const accountByPhone = await userAccountRepository.findByPhoneNumber(userAccount.phone);

        expect(userAccount.userId.value()).to.equal(accountByPhone?.userId.value());
    });

    it('should add a user be able to retrieve it by id', async () => {
        const userAccount = aRegularUserAccount();

        await userAccountRepository.save(userAccount);
        const accountByPhone = await userAccountRepository.findById(userAccount.userId);

        expect(userAccount.userId.value()).to.equal(accountByPhone?.userId.value());
    });

    it('should return undefined when no user found by email, phone or id', async () => {
        const NOT_EXISTING_PHONE = new PhoneNumber(faker.phone.number('06 ## ## ## ##'));
        const NOT_EXISTING_EMAIL = new Email(faker.internet.email());
        const NOT_EXISTING_ID = new UserId(faker.datatype.uuid());

        const userByPhone = await userAccountRepository.findByPhoneNumber(NOT_EXISTING_PHONE);
        const userByEmail = await userAccountRepository.findByEmail(NOT_EXISTING_EMAIL);
        const userById = await userAccountRepository.findById(NOT_EXISTING_ID);

        expect(userByPhone).to.equal(undefined);
        expect(userByEmail).to.equal(undefined);
        expect(userById).to.equal(undefined);
    });
});
