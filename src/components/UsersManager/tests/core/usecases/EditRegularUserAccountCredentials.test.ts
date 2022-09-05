import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { aUsersManagerFacade } from './base/aUsersManagerFacade';
import { anEditAccountCredentialsRequest } from './base/requests/anEditAccountCredentialsRequest';
import { aRegularUserRegistrationRequest } from './base/requests/aRegularUserRegistrationRequest';
import { anAssociationRegistrationRequest } from './base/requests/anAssociationRegistrationRequest';

import { ExceptionMessages } from '../../../main/core/domain/exceptions/ExceptionMessages';
import { NotFoundException } from '../../../main/core/domain/exceptions/NotFoundException';
import { MultiLanguagesValidationException } from '../../../main/core/domain/exceptions/MultiLanguagesValidationException';

describe('Edit Regular User Account Credentials', () => {
    const usersManager = aUsersManagerFacade();

    it('given a none exiting regular account, when trying to edit the regular account credentials, then should fail', async () => {
        const NOT_EXIST = faker.datatype.uuid();

        await expect(
            usersManager.editRegularUserAccountCredentials(
                anEditAccountCredentialsRequest({ accountId: NOT_EXIST }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.ACCOUNT_NOT_FOUND)
            .and.to.be.an.instanceOf(NotFoundException);
    });

    it('given a wrong old password, when trying to edit the regular account credentials, then should fail', async () => {
        const WRONG_PASSWORD = faker.datatype.string(10);
        const { accountId } = await usersManager.registerRegularUser(
            aRegularUserRegistrationRequest(),
        );

        await expect(
            usersManager.editRegularUserAccountCredentials(
                anEditAccountCredentialsRequest({ accountId, oldPassword: WRONG_PASSWORD }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.WRONG_OLD_PASSWORD.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given an incorrect email, when trying to edit the regular account credentials, then should fail', async () => {
        const INCORRECT_EMAIL = faker.datatype.string(10);
        const { accountId } = await usersManager.registerRegularUser(
            aRegularUserRegistrationRequest(),
        );

        await expect(
            usersManager.editRegularUserAccountCredentials(
                anEditAccountCredentialsRequest({ accountId, email: INCORRECT_EMAIL }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.INVALID_EMAIL.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given a short new password, when trying to edit the regular account credentials, then should fail', async () => {
        const SHORT_PASSWORD = faker.datatype.string(3);
        const { accountId } = await usersManager.registerRegularUser(
            aRegularUserRegistrationRequest(),
        );

        await expect(
            usersManager.editRegularUserAccountCredentials(
                anEditAccountCredentialsRequest({ accountId, newPassword: SHORT_PASSWORD }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.SHORT_PASSWORD.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given an email used by another regularUser, when trying to edit the regular user account credentials, then should fail', async () => {
        const anotherAssociation = anAssociationRegistrationRequest();
        await usersManager.registerAssociation(anotherAssociation);

        const regularUser = aRegularUserRegistrationRequest();
        const { accountId } = await usersManager.registerRegularUser(regularUser);

        await expect(
            usersManager.editRegularUserAccountCredentials(
                anEditAccountCredentialsRequest({
                    accountId,
                    email: anotherAssociation.email,
                    oldPassword: regularUser.password,
                }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.EMAIL_ALREADY_USED.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given an email used by another regular user, when trying to edit the regular user account credentials, then should fail', async () => {
        const anotherUser = aRegularUserRegistrationRequest();
        await usersManager.registerRegularUser(anotherUser);

        const regularUser = aRegularUserRegistrationRequest();
        const { accountId } = await usersManager.registerRegularUser(regularUser);

        await expect(
            usersManager.editRegularUserAccountCredentials(
                anEditAccountCredentialsRequest({
                    accountId,
                    email: anotherUser.email,
                    oldPassword: regularUser.password,
                }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.EMAIL_ALREADY_USED.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given an edit regular account credentials request with correct values and a new email, then should change the account email', async () => {
        const regularUser = aRegularUserRegistrationRequest();
        const { accountId } = await usersManager.registerRegularUser(regularUser);

        const NEW_EMAIL = faker.internet.email();
        await usersManager.editRegularUserAccountCredentials(
            anEditAccountCredentialsRequest({
                accountId,
                email: NEW_EMAIL,
                oldPassword: regularUser.password,
            }),
        );

        const { email } = await usersManager.getRegularUserById({ accountId });

        expect(email).to.equal(NEW_EMAIL.toLowerCase());
    });

    it('given an edit regular account credentials request with correct values and a new password, then should change the account password', async () => {
        const regularUser = aRegularUserRegistrationRequest();
        const { accountId } = await usersManager.registerRegularUser(regularUser);

        const NEW_PASSWORD = faker.internet.password(10);
        await usersManager.editRegularUserAccountCredentials(
            anEditAccountCredentialsRequest({
                accountId,
                email: regularUser.email,
                newPassword: NEW_PASSWORD,
                oldPassword: regularUser.password,
            }),
        );

        const { accountId: idFromLogin } = await usersManager.login({
            email: regularUser.email,
            password: NEW_PASSWORD,
        });

        expect(idFromLogin).to.equal(accountId);
    });
});
