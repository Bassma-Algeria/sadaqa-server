import { spy } from 'sinon';
import { expect } from 'chai';

import { aUsersManagerFacade } from './base/aUsersManagerFacade';
import { aRegularUserRegistrationRequest } from './base/requests/aRegularUserRegistrationRequest';
import { anAssociationRegistrationRequest } from './base/requests/anAssociationRegistrationRequest';

import { ExceptionMessages } from '../../../main/core/domain/exceptions/ExceptionMessages';
import { MultiLanguagesValidationException } from '../../../main/core/domain/exceptions/MultiLanguagesValidationException';

import { EventBus } from '../../../../_shared_/event-bus/EventBus';

describe('Login & Registration', () => {
    const usersManager = aUsersManagerFacade();

    it('should be able to create a regular user account, and login with the same credentials, and return the account type', async () => {
        const user = aRegularUserRegistrationRequest();

        const { accountId: idFromSignup } = await usersManager.registerRegularUser(user);
        const { accountId: idFromLogin, type } = await usersManager.login({
            email: user.email,
            password: user.password,
        });

        expect(idFromLogin).to.equal(idFromSignup);
        expect(type).to.equal('REGULAR_USER');
    });

    it('should be able to create an association account, and login with the same credentials, and return the account type', async () => {
        const association = anAssociationRegistrationRequest();

        const { accountId: idFromRegistration } = await usersManager.registerAssociation(
            association,
        );
        const { accountId: idFromLogin, type } = await usersManager.login({
            email: association.email,
            password: association.password,
        });

        expect(idFromRegistration).to.equal(idFromLogin);
        expect(type).to.equal('ASSOCIATION');
    });

    it('should not have an association account with the same email as a user account', async () => {
        const association = anAssociationRegistrationRequest();
        await usersManager.registerAssociation(association);

        const regularUser = aRegularUserRegistrationRequest({ email: association.email });

        await expect(usersManager.registerRegularUser(regularUser))
            .to.eventually.be.rejectedWith(ExceptionMessages.EMAIL_ALREADY_USED.en)
            .and.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('should not have a user account with the same email as an association account', async () => {
        const regularUser = aRegularUserRegistrationRequest();
        await usersManager.registerRegularUser(regularUser);

        const association = anAssociationRegistrationRequest({ email: regularUser.email });

        await expect(usersManager.registerAssociation(association))
            .to.eventually.be.rejectedWith(ExceptionMessages.EMAIL_ALREADY_USED.en)
            .and.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('should not be able to login with wrong credentials', async () => {
        const user = await registerRandomUser();
        const anotherUser = await registerRandomUser();

        await expect(usersManager.login({ email: user.email, password: anotherUser.password }))
            .to.eventually.be.rejectedWith(ExceptionMessages.WRONG_CREDENTIALS.en)
            .and.be.an.instanceOf(MultiLanguagesValidationException);
    });

    it('should be able to login with the email upper cased and have some white spaces in left and right', async () => {
        const { accountId, email, password } = await registerRandomUser();

        await expect(
            usersManager.login({ email: `  ${email.toUpperCase()}`, password }),
        ).to.eventually.have.property('accountId', accountId);
    });

    it('should be able to login with the password have some white spaces in left and right', async () => {
        const { accountId, email, password } = await registerRandomUser();

        await expect(
            usersManager.login({ email, password: ` ${password}  ` }),
        ).to.eventually.have.property('accountId', accountId);
    });

    it('should publish a user login event when login successfully', async () => {
        const mockFn = spy();

        EventBus.getInstance().subscribeTo('USER_LOGIN').by(mockFn);

        const { email, password } = await registerRandomUser();
        const { accountId } = await usersManager.login({ email, password });

        expect(mockFn.calledOnce).to.equal(true);
        expect(mockFn.args[0][0]).to.deep.equal({ accountId });
    });

    const registerRandomUser = async () => {
        const regularUser = await registerRandomRegularUser();
        const association = await registerRandomAssociation();

        const randomNumber = Math.random();

        const accountId = randomNumber > 0.5 ? regularUser.accountId : association.accountId;
        const email = randomNumber > 0.5 ? regularUser.email : association.email;
        const password = randomNumber > 0.5 ? regularUser.password : association.password;

        return { accountId, email, password };
    };

    const registerRandomAssociation = async () => {
        const association = anAssociationRegistrationRequest();
        const { accountId } = await usersManager.registerAssociation(association);

        return { accountId, email: association.email, password: association.password };
    };

    const registerRandomRegularUser = async () => {
        const user = aRegularUserRegistrationRequest();
        const { accountId } = await usersManager.registerRegularUser(user);

        return { accountId, email: user.email, password: user.password };
    };
});
