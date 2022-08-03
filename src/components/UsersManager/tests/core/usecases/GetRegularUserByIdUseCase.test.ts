import { expect } from 'chai';
import { UserNotFoundException } from '../../../main/core/domain/exceptions/UserNotFoundException';
import { UsersManagerFacade } from '../../../main/UsersManagerFacade';
import { aRegularUserRegistrationRequest } from './base/aRegularUserRegistrationRequest';

import { aUsersManagerFacade } from './base/aUsersManagerFacade';

describe('GetRegularUserByIdUseCase', () => {
    let usersManager: UsersManagerFacade;

    beforeEach(() => {
        usersManager = aUsersManagerFacade();
    });

    it('should get a user by his id after registration', async () => {
        const registrationInfo = aRegularUserRegistrationRequest();

        const { regularUserId } = await usersManager.registerRegularUser(registrationInfo);
        const { firstName, lastName, wilayaNumber } = await usersManager.getRegularUserById({
            regularUserId,
        });

        expect(firstName).to.equal(registrationInfo.firstName.toLowerCase());
        expect(lastName).to.equal(registrationInfo.lastName.toLowerCase());
        expect(wilayaNumber).to.equal(registrationInfo.wilayaNumber);
    });

    it('should throw a not found exception when no user found with the provided id', async () => {
        const ID_NOT_EXIST = 'some random id';

        await expect(
            usersManager.getRegularUserById({ regularUserId: ID_NOT_EXIST }),
        ).to.eventually.be.rejectedWith(UserNotFoundException);
    });
});
