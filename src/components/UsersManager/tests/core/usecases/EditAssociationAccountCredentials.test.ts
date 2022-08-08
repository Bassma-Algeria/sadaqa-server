import { spy } from 'sinon';
import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { aUsersManagerFacade } from './base/aUsersManagerFacade';
import { aRegularUserRegistrationRequest } from './base/requests/aRegularUserRegistrationRequest';
import { anEditAccountCredentialsRequest } from './base/requests/anEditAccountCredentialsRequest';
import { anAssociationRegistrationRequest } from './base/requests/anAssociationRegistrationRequest';

import { ExceptionMessages } from '../../../main/core/domain/exceptions/ExceptionMessages';
import { NotFoundException } from '../../../main/core/domain/exceptions/NotFoundException';
import { MultiLanguagesValidationException } from '../../../main/core/domain/exceptions/MultiLanguagesValidationException';

import { EventBus } from '../../../../_shared_/event-bus/EventBus';

describe('Edit Association Account Credentials', () => {
    const usersManager = aUsersManagerFacade();

    it('given a none exiting association account, when trying to edit the association account credentials, then should fail', async () => {
        const NOT_EXIST = faker.datatype.uuid();

        await expect(
            usersManager.editAssociationAccountCredentials(
                anEditAccountCredentialsRequest({ accountId: NOT_EXIST }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.ACCOUNT_NOT_FOUND)
            .and.to.be.an.instanceOf(NotFoundException);
    });

    it('given a wrong old password, when trying to edit the association account credentials, then should fail', async () => {
        const WRONG_PASSWORD = faker.datatype.string(10);
        const { accountId } = await usersManager.registerAssociation(
            anAssociationRegistrationRequest(),
        );

        await expect(
            usersManager.editAssociationAccountCredentials(
                anEditAccountCredentialsRequest({ accountId, oldPassword: WRONG_PASSWORD }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.WRONG_OLD_PASSWORD.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given an incorrect email, when trying to edit the association account credentials, then should fail', async () => {
        const INCORRECT_EMAIL = faker.datatype.string(10);
        const { accountId } = await usersManager.registerAssociation(
            anAssociationRegistrationRequest(),
        );

        await expect(
            usersManager.editAssociationAccountCredentials(
                anEditAccountCredentialsRequest({ accountId, email: INCORRECT_EMAIL }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.INVALID_EMAIL.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given a short new password, when trying to edit the association account credentials, then should fail', async () => {
        const SHORT_PASSWORD = faker.datatype.string(3);
        const { accountId } = await usersManager.registerAssociation(
            anAssociationRegistrationRequest(),
        );

        await expect(
            usersManager.editAssociationAccountCredentials(
                anEditAccountCredentialsRequest({ accountId, newPassword: SHORT_PASSWORD }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.SHORT_PASSWORD.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given an email used by another association, when trying to edit the association account credentials, then should fail', async () => {
        const anotherAssociation = anAssociationRegistrationRequest();
        await usersManager.registerAssociation(anotherAssociation);

        const association = anAssociationRegistrationRequest();
        const { accountId } = await usersManager.registerAssociation(association);

        await expect(
            usersManager.editAssociationAccountCredentials(
                anEditAccountCredentialsRequest({
                    accountId,
                    email: anotherAssociation.email,
                    oldPassword: association.password,
                }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.EMAIL_ALREADY_USED.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given an email used by another regular user, when trying to edit the association account credentials, then should fail', async () => {
        const anotherUser = aRegularUserRegistrationRequest();
        await usersManager.registerRegularUser(anotherUser);

        const association = anAssociationRegistrationRequest();
        const { accountId } = await usersManager.registerAssociation(association);

        await expect(
            usersManager.editAssociationAccountCredentials(
                anEditAccountCredentialsRequest({
                    accountId,
                    email: anotherUser.email,
                    oldPassword: association.password,
                }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.EMAIL_ALREADY_USED.en)
            .and.to.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('given an edit association account credentials request with correct values and a new email, then should change the account email', async () => {
        const association = anAssociationRegistrationRequest();
        const { accountId } = await usersManager.registerAssociation(association);

        const NEW_EMAIL = faker.internet.email();
        await usersManager.editAssociationAccountCredentials(
            anEditAccountCredentialsRequest({
                accountId,
                email: NEW_EMAIL,
                oldPassword: association.password,
            }),
        );

        const { email } = await usersManager.getAssociationById({ accountId });

        expect(email).to.equal(NEW_EMAIL.toLowerCase());
    });

    it('given an edit association account credentials request with correct values and a new password, then should change the account password', async () => {
        const association = anAssociationRegistrationRequest();
        const { accountId } = await usersManager.registerAssociation(association);

        const NEW_PASSWORD = faker.internet.password(10);
        await usersManager.editAssociationAccountCredentials(
            anEditAccountCredentialsRequest({
                accountId,
                email: association.email,
                newPassword: NEW_PASSWORD,
                oldPassword: association.password,
            }),
        );

        const { accountId: idFromLogin } = await usersManager.login({
            email: association.email,
            password: NEW_PASSWORD,
        });

        expect(idFromLogin).to.equal(accountId);
    });

    it('given an edit association account credentials request, when the credentials are edited successfully then publish a credentials edited event to the global event bus', async () => {
        const mockFn = spy();

        EventBus.getInstance().subscribeTo('ACCOUNT_CREDENTIALS_EDITED').by(mockFn);

        const association = anAssociationRegistrationRequest();
        const { accountId } = await usersManager.registerAssociation(association);

        await usersManager.editAssociationAccountCredentials(
            anEditAccountCredentialsRequest({ accountId, oldPassword: association.password }),
        );

        expect(mockFn.calledOnce).to.equal(true);
        expect(mockFn.args[0][0]).to.deep.equal({ accountId });
    });
});