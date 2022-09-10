import { expect } from 'chai';

import { aUsersManagerFacade } from './base/aUsersManagerFacade';
import { aRegularUserRegistrationRequest } from './base/requests/aRegularUserRegistrationRequest';

import { ExceptionMessages } from '../../../main/core/domain/exceptions/ExceptionMessages';
import { NotFoundException } from '../../../main/core/domain/exceptions/NotFoundException';

describe('Get Regular User By Id', () => {
    const usersManager = aUsersManagerFacade();

    it('should get a user by his id after registration', async () => {
        const registrationInfo = aRegularUserRegistrationRequest();

        const { accountId } = await usersManager.registerRegularUser(registrationInfo);
        const { firstName, lastName, wilayaNumber } = await usersManager.getRegularUserById({
            accountId,
        });

        expect(firstName).to.equal(registrationInfo.firstName.toLowerCase());
        expect(lastName).to.equal(registrationInfo.lastName.toLowerCase());
        expect(wilayaNumber).to.equal(registrationInfo.wilayaNumber);
    });

    it('should throw a not found exception when no user found with the provided id', async () => {
        const ID_NOT_EXIST = 'some random id';

        await expect(usersManager.getRegularUserById({ accountId: ID_NOT_EXIST }))
            .to.eventually.be.rejectedWith(ExceptionMessages.ACCOUNT_NOT_FOUND)
            .and.to.be.an.instanceOf(NotFoundException);
    });
});
