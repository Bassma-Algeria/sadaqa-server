import { expect } from 'chai';
import { faker } from '@faker-js/faker';
import { anything, instance, mock, when } from 'ts-mockito';

import { anEditAccountCredentialsRequest } from '../base/requests/anEditAccountCredentialsRequest';
import { aRegularUserRegistrationRequest } from '../base/requests/aRegularUserRegistrationRequest';
import { anAssociationRegistrationRequest } from '../base/requests/anAssociationRegistrationRequest';

import { Password } from '../../../../main/core/domain/Password';
import { AccountId } from '../../../../main/core/domain/AccountId';

import { WilayasService } from '../../../../main/core/domain/services/WilayasService';

import { EventBus } from '../../../../../_shared_/event-bus/EventBus';

import { FakePicturesManager } from '../../../../main/infra/fake/FakePicturesManager';
import { UuidAccountIdGenerator } from '../../../../main/infra/real/UuidAccountIdGenerator';
import { UserEventPublisherImpl } from '../../../../main/infra/real/UserEventPublisherImpl';
import { BcryptPasswordEncryptor } from '../../../../main/infra/real/BcryptPasswordEncryptor';
import { InMemoryOnlineUserRepository } from '../../../../main/infra/real/InMemoryOnlineUserRepository';
import { PostgresRegularUserAccountRepository } from '../../../../main/infra/real/PostgresRegularUserAccountRepository';
import { PostgresAssociationAccountRepository } from '../../../../main/infra/real/PostgresAssociationAccountRepository';

import { UsersManagerFacade } from '../../../../main/UsersManagerFacade';

describe('Password Encryption', () => {
    const wilayasServiceMock = mock<WilayasService>();

    when(wilayasServiceMock.isExist(anything())).thenResolve(true);

    const passwordEncryptor = new BcryptPasswordEncryptor();
    const regularUserAccountRepository = new PostgresRegularUserAccountRepository();
    const associationAccountRepository = new PostgresAssociationAccountRepository();

    const usersManager = new UsersManagerFacade(
        instance(wilayasServiceMock),
        new FakePicturesManager(),
        passwordEncryptor,
        new UuidAccountIdGenerator(),
        new UserEventPublisherImpl(EventBus.getInstance()),
        new InMemoryOnlineUserRepository(),
        regularUserAccountRepository,
        associationAccountRepository,
    );

    it('given an regularUser registered, then the password should be encrypted and saved to the data store', async () => {
        const password = faker.datatype.string(10);
        const { accountId } = await usersManager.registerAssociation(
            anAssociationRegistrationRequest({ password, confirmPassword: password }),
        );

        const savedAccount: any = await associationAccountRepository.findById(
            new AccountId(accountId),
        );
        const savedPassword = savedAccount.password.value();

        const isPasswordMatch = await passwordEncryptor.compare(
            new Password(password),
            new Password(savedPassword),
        );
        expect(savedPassword).to.not.equal(password);
        expect(isPasswordMatch).to.equal(true);
    });

    it('given an regular user registered, then the password should be encrypted and saved to the data store', async () => {
        const password = faker.datatype.string(10);
        const { accountId } = await usersManager.registerRegularUser(
            aRegularUserRegistrationRequest({ password, confirmPassword: password }),
        );

        const savedAccount: any = await regularUserAccountRepository.findById(
            new AccountId(accountId),
        );
        const savedPassword = savedAccount.password.value();

        const isPasswordMatch = await passwordEncryptor.compare(
            new Password(password),
            new Password(savedPassword),
        );
        expect(savedPassword).to.not.equal(password);
        expect(isPasswordMatch).to.equal(true);
    });

    it('given an edit regularUser account credentials, when the password is changed, then should encrypt that new password and saved to the data store', async () => {
        const NEW_PASSWORD = faker.datatype.string(10);

        const regularUser = anAssociationRegistrationRequest();
        const { accountId } = await usersManager.registerAssociation(regularUser);

        await usersManager.editAssociationAccountCredentials(
            anEditAccountCredentialsRequest({
                accountId,
                oldPassword: regularUser.password,
                newPassword: NEW_PASSWORD,
            }),
        );

        const savedAccount: any = await associationAccountRepository.findById(
            new AccountId(accountId),
        );
        const savedPassword = savedAccount.password.value();

        const isPasswordMatch = await passwordEncryptor.compare(
            new Password(NEW_PASSWORD),
            new Password(savedPassword),
        );
        expect(savedPassword).to.not.equal(NEW_PASSWORD);
        expect(isPasswordMatch).to.equal(true);
    });

    it('given an edit regular user account credentials, when the password is changed, then should encrypt that new password and saved to the data store', async () => {
        const NEW_PASSWORD = faker.datatype.string(10);

        const regularUser = aRegularUserRegistrationRequest();
        const { accountId } = await usersManager.registerRegularUser(regularUser);

        await usersManager.editRegularUserAccountCredentials(
            anEditAccountCredentialsRequest({
                accountId,
                oldPassword: regularUser.password,
                newPassword: NEW_PASSWORD,
            }),
        );

        const savedAccount: any = await regularUserAccountRepository.findById(
            new AccountId(accountId),
        );
        const savedPassword = savedAccount.password.value();

        const isPasswordMatch = await passwordEncryptor.compare(
            new Password(NEW_PASSWORD),
            new Password(savedPassword),
        );
        expect(savedPassword).to.not.equal(NEW_PASSWORD);
        expect(isPasswordMatch).to.equal(true);
    });
});
