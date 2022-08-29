import { spy } from 'sinon';
import { expect } from 'chai';
import { anything, instance, mock, when } from 'ts-mockito';

import { aUsersManagerFacade } from './base/aUsersManagerFacade';
import { aRegularUserRegistrationRequest } from './base/requests/aRegularUserRegistrationRequest';

import { WilayasService } from '../../../main/core/domain/services/WilayasService';
import { ExceptionMessages } from '../../../main/core/domain/exceptions/ExceptionMessages';
import { MultiLanguagesValidationException } from '../../../main/core/domain/exceptions/MultiLanguagesValidationException';

import { EventBus } from '../../../../_shared_/event-bus/EventBus';

describe('Register Regular User', () => {
    const wilayasServiceMock = mock<WilayasService>();
    const usersManager = aUsersManagerFacade({ wilayasService: instance(wilayasServiceMock) });

    beforeEach(() => {
        when(wilayasServiceMock.isExist(anything())).thenResolve(true);
    });

    it('email should be valid', async () => {
        const user = aRegularUserRegistrationRequest({ email: 'invalid email!' });

        await expect(usersManager.registerRegularUser(user))
            .to.eventually.be.rejectedWith(ExceptionMessages.INVALID_EMAIL.en)
            .instanceOf(MultiLanguagesValidationException);
    });

    it('password should be more than 6 characters', async () => {
        const user = aRegularUserRegistrationRequest({ password: 'short' });

        await expect(usersManager.registerRegularUser(user))
            .to.eventually.be.rejectedWith(ExceptionMessages.SHORT_PASSWORD.en)
            .instanceOf(MultiLanguagesValidationException);
    });

    it('first name and last name should have more than 3 characters', async () => {
        const user = aRegularUserRegistrationRequest({ firstName: 'sh', lastName: 'sdf' });

        await expect(usersManager.registerRegularUser(user))
            .to.eventually.be.rejectedWith(ExceptionMessages.SHORT_NAME.en)
            .instanceOf(MultiLanguagesValidationException);
    });

    it('wilaya number should be valid', async () => {
        when(wilayasServiceMock.isExist(anything())).thenResolve(false);

        const user = aRegularUserRegistrationRequest({ wilayaNumber: 100 });

        await expect(usersManager.registerRegularUser(user))
            .to.eventually.be.rejectedWith(ExceptionMessages.INVALID_WILAYA_NUMBER.en)
            .instanceOf(MultiLanguagesValidationException);
    });

    it('phone number should be valid', async () => {
        const user = aRegularUserRegistrationRequest({ phoneNumber: '05 182 1' });
        const anotherUser = aRegularUserRegistrationRequest({ phoneNumber: '03 99 83 12 38' });

        await expect(usersManager.registerRegularUser(user))
            .to.eventually.be.rejectedWith(ExceptionMessages.INVALID_PHONE.en)
            .instanceOf(MultiLanguagesValidationException);
        await expect(usersManager.registerRegularUser(anotherUser))
            .to.eventually.be.rejectedWith(ExceptionMessages.INVALID_PHONE.en)
            .instanceOf(MultiLanguagesValidationException);
    });

    it('confirm password should equal the password', async () => {
        const user = aRegularUserRegistrationRequest({ confirmPassword: 'some other password' });

        await expect(usersManager.registerRegularUser(user))
            .to.eventually.be.rejectedWith(ExceptionMessages.PASSWORD_MISS_MATCH.en)
            .instanceOf(MultiLanguagesValidationException);
    });

    it('should not have two users with the same email', async () => {
        const user = aRegularUserRegistrationRequest();
        const anotherUser = aRegularUserRegistrationRequest({ email: user.email });

        await usersManager.registerRegularUser(user);
        await expect(usersManager.registerRegularUser(anotherUser))
            .to.eventually.be.rejectedWith(ExceptionMessages.EMAIL_ALREADY_USED.en)
            .instanceOf(MultiLanguagesValidationException);
    });

    it('should not have two users with the same phone number', async () => {
        const user = aRegularUserRegistrationRequest();
        const anotherUser = aRegularUserRegistrationRequest({ phoneNumber: user.phoneNumber });

        await usersManager.registerRegularUser(user);
        await expect(usersManager.registerRegularUser(anotherUser))
            .to.eventually.be.rejectedWith(ExceptionMessages.PHONE_NUMBER_ALREADY_USED.en)
            .instanceOf(MultiLanguagesValidationException);
    });

    it('each user should have a unique id', async () => {
        const user = aRegularUserRegistrationRequest();
        const anotherUser = aRegularUserRegistrationRequest();

        const { accountId: firstId } = await usersManager.registerRegularUser(user);
        const { accountId: secondId } = await usersManager.registerRegularUser(anotherUser);

        expect(firstId).to.not.equal(secondId);
    });

    it('given an association registration requests, when the registration complete, the association should not have a profile picture', async () => {
        const { accountId } = await usersManager.registerRegularUser(
            aRegularUserRegistrationRequest(),
        );

        const { profilePicture } = await usersManager.getRegularUserById({ accountId });
        expect(profilePicture).to.equal(null);
    });

    it('should publish an association registered event when the association is registered', async () => {
        const mockFn = spy();
        EventBus.getInstance().subscribeTo('REGULAR_USER_REGISTERED').by(mockFn);

        const { accountId } = await usersManager.registerRegularUser(
            aRegularUserRegistrationRequest(),
        );

        expect(mockFn.calledOnce).to.equal(true);
        expect(mockFn.args[0][0]).to.have.property('accountId', accountId);
    });
});
